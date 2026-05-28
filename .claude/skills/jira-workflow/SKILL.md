---
name: jira-workflow
description: Fluxo padrão para interagir com cards do Jira — buscar um card, atribuir ao usuário atual, transicionar status. Use ao iniciar uma tarefa, ao mover um card para "In Progress" / "In Review", ou ao consultar critérios de aceite de uma chave do Jira.
allowed-tools: Bash, mcp__atlassian, Read
---

# Jira Workflow

Cobre três operações: **buscar card**, **atribuir**, **transicionar status**.

A skill funciona com **dois caminhos** dependendo do que está disponível no ambiente:

1. **MCP Atlassian** (preferido — instalado via `claude mcp add atlassian ...`).
2. **CLI `jira`** ([ankitpokhrel/jira-cli](https://github.com/ankitpokhrel/jira-cli)) — fallback se o MCP não estiver configurado.

## Detecção rápida

Antes de cada operação, decida o caminho:

```bash
# Se este comando responde, use MCP. Caso contrário, use jira CLI.
which jira
```

Se nenhum dos dois existir, **pare** e peça ao usuário para configurar um deles. Não tente bater na API do Jira via `curl` sem credenciais explícitas.

## Operação 1 — Buscar card

**MCP:**
```
mcp__atlassian__get_issue(issue_key="PROJ-123")
```

**CLI:**
```bash
jira issue view PROJ-123
```

Apresente ao usuário: título, tipo, descrição, critérios de aceite e status atual. Confirme que é o card correto antes de qualquer mutação.

## Operação 2 — Atribuir ao usuário atual

**MCP:**
```
mcp__atlassian__assign_issue(issue_key="PROJ-123", account_id="<current-user-account-id>")
```

**CLI:**
```bash
jira issue assign PROJ-123 $(jira me)
```

Se a operação falhar por permissão, **reporte ao usuário** e pare. Nunca tente atribuir a outro usuário sem ordem explícita.

## Operação 3 — Transicionar status

**MCP:**
```
mcp__atlassian__transition_issue(issue_key="PROJ-123", transition="In Progress")
```

**CLI:**
```bash
jira issue move PROJ-123 "In Progress"
```

### Atenção a nomes de transição

Cada board do Jira tem nomes de transição diferentes. Antes de assumir "In Progress", confirme as opções disponíveis:

**MCP:**
```
mcp__atlassian__get_transitions(issue_key="PROJ-123")
```

**CLI:**
```bash
jira issue transitions PROJ-123
```

Use o nome **exato** retornado. Se o board usar "Em andamento" em vez de "In Progress", respeite isso.

## Estados de interesse

| Quando | Para qual status mover |
|--------|------------------------|
| Iniciar a tarefa | `In Progress` (ou equivalente do board) |
| Abrir o PR | `In Review` / `Code Review` (se o board exigir manual — alguns têm automação) |
| Merge feito | Geralmente automação cuida; não force manualmente |

## O que NÃO fazer

- ❌ Não mexa em campos do card além de assignee e status sem ordem explícita do usuário.
- ❌ Não reordene/repriorize o backlog.
- ❌ Não feche o card — fechamento normalmente é responsabilidade do PO/QA.
- ❌ Não atribua o card a outra pessoa.
- ❌ Não use `curl` direto na API se MCP/CLI não estiverem disponíveis — peça setup ao usuário.
