#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash)
# Impede `git commit` direto em main/master/develop e impede `git push` para essas refs.

set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

# Branches protegidas — ajuste conforme o repo
protected_regex='^(main|master|develop|release/.*)$'

# Detecta git commit ou git push
is_commit=$(printf '%s' "$cmd" | grep -qE '\bgit commit\b' && echo 1 || echo 0)
is_push=$(printf '%s' "$cmd" | grep -qE '\bgit push\b' && echo 1 || echo 0)

if [ "$is_commit" = "0" ] && [ "$is_push" = "0" ]; then
  exit 0
fi

# Branch atual
current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$current_branch" ]; then
  # Não estamos num repo git — deixe o git falhar sozinho
  exit 0
fi

# Para commit: bloqueia se estamos numa branch protegida
if [ "$is_commit" = "1" ] && [[ "$current_branch" =~ $protected_regex ]]; then
  echo "Branch atual \"$current_branch\" é protegida. Commits diretos não são permitidos." >&2
  echo "Crie uma branch com 'git switch -c <tipo>/<JIRA-KEY>-<slug>' antes." >&2
  exit 2
fi

# Para push: bloqueia se o destino é uma branch protegida com --force/--force-with-lease
if [ "$is_push" = "1" ]; then
  if printf '%s' "$cmd" | grep -qE '\-\-force(-with-lease)?\b'; then
    if printf '%s' "$cmd" | grep -qE '\b(origin|upstream)?[[:space:]]*(main|master|develop)\b'; then
      echo "force-push em branch protegida não é permitido." >&2
      exit 2
    fi
  fi
fi

exit 0
