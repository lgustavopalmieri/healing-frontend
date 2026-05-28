#!/usr/bin/env bash
# PostToolUse hook (matcher: Write|Edit)
# Roda formatador/linter no(s) arquivo(s) recém-editados e devolve qualquer
# erro de tipo/lint para o Claude corrigir antes de seguir.
#
# Baseado na "TypeScript Type Checking Hook" da aula 11.

set -euo pipefail

input=$(cat)
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')

if [ -z "$file_path" ]; then
  exit 0
fi

# Resolve o root do projeto (onde rodam os comandos)
repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

cd "$repo_root"

ext="${file_path##*.}"

run() {
  # Executa o comando, captura tudo, e se sair !=0 imprime no stderr para o Claude ver.
  # PostToolUse não bloqueia, mas a saída via stderr serve de feedback.
  local label="$1"; shift
  if ! out=$("$@" 2>&1); then
    echo "[$label] falhou em $file_path:" >&2
    echo "$out" >&2
    return 1
  fi
}

case "$ext" in
  ts|tsx|js|jsx|mjs|cjs)
    # Type-check do projeto inteiro — pega call sites quebrados após mudar assinatura
    if [ -f "tsconfig.json" ]; then
      run "tsc" npx --no-install tsc --noEmit || true
    fi
    # Formatador
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ]; then
      npx --no-install prettier --write "$file_path" >/dev/null 2>&1 || true
    fi
    # Lint só no arquivo editado (rápido)
    if [ -f ".eslintrc" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
      run "eslint" npx --no-install eslint "$file_path" || true
    fi
    ;;
  py)
    if command -v ruff >/dev/null 2>&1; then
      ruff format "$file_path" >/dev/null 2>&1 || true
      run "ruff" ruff check "$file_path" || true
    fi
    if command -v mypy >/dev/null 2>&1 && [ -f "mypy.ini" -o -f "pyproject.toml" ]; then
      run "mypy" mypy "$file_path" || true
    fi
    ;;
  go)
    if command -v gofmt >/dev/null 2>&1; then
      gofmt -w "$file_path"
    fi
    if command -v go >/dev/null 2>&1; then
      run "go vet" go vet ./... || true
    fi
    ;;
  rs)
    if command -v rustfmt >/dev/null 2>&1; then
      rustfmt "$file_path" || true
    fi
    ;;
esac

exit 0
