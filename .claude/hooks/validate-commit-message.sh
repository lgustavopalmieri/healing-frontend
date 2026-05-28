#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash)
# Valida `git commit -m "..."` contra a skill commit-conventions:
#   <tipo>(<escopo opcional>): <assunto, ≤72 chars>
#   ...
#   Refs: <JIRA-KEY>  (ou Closes: <JIRA-KEY>)

set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

# Só nos interessa se o comando é um git commit com mensagem
if ! printf '%s' "$cmd" | grep -qE '\bgit commit\b'; then
  exit 0
fi

# Permite --amend explícito (usuário sabe o que está fazendo)
if printf '%s' "$cmd" | grep -qE '(^|[[:space:]])--amend([[:space:]]|$)'; then
  exit 0
fi

# Bloqueia --no-verify
if printf '%s' "$cmd" | grep -qE '(^|[[:space:]])--no-verify([[:space:]]|$)'; then
  echo "--no-verify não é permitido pela política do projeto. Conserte a causa raiz." >&2
  exit 2
fi

# Extrai TODAS as ocorrências de -m "..." ou -m '...', uma por linha.
# git commit junta múltiplos -m com linha em branco entre eles, então simulamos isso.
message=$(printf '%s' "$cmd" \
  | grep -oE "(-m[[:space:]]+\"[^\"]+\"|-m[[:space:]]+'[^']+')" \
  | sed -E "s/^-m[[:space:]]+//; s/^[\"']//; s/[\"']$//" \
  | awk 'BEGIN{first=1} {if(!first)print ""; print; first=0}')

# Se não conseguir via -m, tenta HEREDOC (cat <<'EOF' ... EOF)
if [ -z "$message" ]; then
  message=$(printf '%s' "$cmd" | awk "/<<[ ]*'?EOF'?/{flag=1;next}/^[[:space:]]*EOF/{flag=0}flag")
fi

# Se ainda assim não conseguir, permite (vai abrir editor — o usuário valida no editor)
if [ -z "$message" ]; then
  exit 0
fi

header=$(printf '%s' "$message" | head -n 1)

# Tamanho do header
header_len=${#header}
if [ "$header_len" -gt 72 ]; then
  echo "Header do commit tem $header_len chars (máx 72): \"$header\"" >&2
  echo "Encurte o assunto. Veja a skill commit-conventions." >&2
  exit 2
fi

# Tipo válido
if ! printf '%s' "$header" | grep -qE '^(feat|fix|chore|docs|refactor|test|perf|hotfix)(\([a-z0-9-]+\))?: '; then
  cat >&2 <<EOF
Header do commit fora do padrão: "$header"

Formato esperado:
  <tipo>(<escopo opcional>): <assunto>

Tipos válidos: feat, fix, chore, docs, refactor, test, perf, hotfix
Exemplos:
  feat(search): add user search endpoint
  fix(checkout): handle null cart on guest flow

Veja a skill commit-conventions.
EOF
  exit 2
fi

# Refs/Closes da chave do Jira em alguma linha da mensagem
if ! printf '%s' "$message" | grep -qE '^(Refs|Closes): [A-Z]+-[0-9]+'; then
  cat >&2 <<EOF
Faltou referência ao card do Jira no rodapé do commit.

Adicione uma linha:
  Refs: PROJ-123
ou
  Closes: PROJ-123  (quando o commit fecha a tarefa)

Veja a skill commit-conventions.
EOF
  exit 2
fi

exit 0
