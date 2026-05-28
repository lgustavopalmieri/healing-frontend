---
description: Abre um Pull Request no GitHub via MCP do GitHub (não usa gh CLI) — isso garante que a mesma sessão possa, em seguida, ler comentários e ajustar o PR.
---

# /open-pr — Abrir Pull Request via MCP do GitHub

Abre o PR no GitHub **usando o MCP do GitHub** (não use `gh` CLI). O texto do PR vem em `$ARGUMENTS` (espera-se que tenha vindo do subagent `pr-writer`); se vazio, peça ao usuário.

> **Por que MCP em vez de `gh`:** o MCP do GitHub expõe tools tipadas que esta mesma sessão pode reusar depois para **ler comentários** (`mcp__github__get_pull_request_comments`), **buscar reviews** (`mcp__github__get_pull_request_reviews`) e iterar o PR sem trocar de ferramenta. `gh` quebra esse fluxo.

---

## Pré-checagens

Rode as checagens locais (são `git`, não `gh` — git é nativo, segue):

```bash
git status
git diff origin/HEAD...HEAD --stat
git log --oneline origin/HEAD..HEAD
git rev-parse --abbrev-ref HEAD
git remote get-url origin
```

Bloqueie a criação se:
- Houver alterações não commitadas → peça decisão ao usuário.
- A branch atual for `main`/`master` → o hook já impede commits, mas confirme.
- `origin` não apontar para `github.com` (extraia `owner/repo` do remote — se não der, **pare** e reporte).

### MCP do GitHub disponível?

O MCP do GitHub precisa estar configurado nesta sessão. Confirme rodando uma chamada read-only barata:

```
mcp__github__get_me()
```

Se falhar com "tool not found" ou erro de auth, **pare** e oriente o usuário:

```
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

(O token do GitHub é lido do ambiente — `GITHUB_TOKEN` ou `GITHUB_PERSONAL_ACCESS_TOKEN`.)

---

## Push da branch

O push continua sendo `git` nativo (operação local-para-remoto do próprio git, não do GitHub):

```bash
git push -u origin HEAD
```

Se o push falhar (ex.: branch protegida ou rebase necessário), **pare** e reporte ao usuário.

---

## Criação do PR via MCP

Extraia `owner` e `repo` de `git remote get-url origin` (formato `git@github.com:OWNER/REPO.git` ou `https://github.com/OWNER/REPO.git`).

Chame:

```
mcp__github__create_pull_request(
  owner="<OWNER>",
  repo="<REPO>",
  head="<branch atual>",
  base="<branch alvo — geralmente main; confirme com o usuário se ambíguo>",
  title="[PROJ-123] <título conciso, ≤70 chars>",
  body="<descrição completa entregue pelo pr-writer, já no formato da skill pr-template>",
  draft=false
)
```

**Regras de título:**
- Prefixe com a chave do Jira: `[PROJ-123] Título conciso`.
- Máximo 70 caracteres.
- Não duplique conteúdo do corpo.

**`base`:** se o repo tiver branch default diferente de `main`, use a real. Confirme via:

```
mcp__github__get_repository(owner="<OWNER>", repo="<REPO>")
```

e leia `default_branch`.

---

## Pós-criação

A resposta do `create_pull_request` traz `html_url`, `number` e `node_id`. Capture e:

1. Reporte ao usuário:
   - URL do PR ✅
   - Número do PR (use depois para ler comentários/reviews via MCP)
   - Link do card do Jira (se aplicável)
   - Lembrete de mover o card para "In Review" se o board exigir manualmente.

2. **Não** mescle o PR automaticamente. Merge é decisão humana.

3. Mantenha o número do PR no contexto — operações subsequentes nesta sessão (ler comentários, responder reviews, atualizar a descrição) usam essa chave junto com as tools `mcp__github__*`.

---

## O que NÃO fazer

- ❌ **Não** use `gh pr create`, `gh pr view`, `gh pr comment` ou qualquer `gh` para operações remotas no GitHub. Esta pipeline padroniza no MCP.
- ❌ Não exponha o token do GitHub em logs/output.
- ❌ Não force `base=main` se o repo usa outra branch default.
