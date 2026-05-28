---
description: Busca um card no Jira, atribui ao usuário atual e move para "In Progress".
---

# /jira-start — Iniciar atividade no Jira

Chave do Jira: **$ARGUMENTS**

Se vazio, **peça ao usuário** a chave antes de continuar.

---

## Passos

Aplique a skill `jira-workflow` e execute, **nesta ordem**:

1. **Buscar o card**
   - Se o MCP `atlassian` estiver disponível, use `mcp__atlassian__get_issue` com a chave `$ARGUMENTS`.
   - Caso contrário, use o CLI `jira` (`jira issue view $ARGUMENTS`) ou `curl` no endpoint `/rest/api/3/issue/$ARGUMENTS` do Jira configurado.
   - Mostre ao usuário: título, descrição, critérios de aceite e status atual.

2. **Confirmar com o usuário** que é o card correto antes de qualquer mutação.

3. **Atribuir ao usuário atual**
   - MCP: `mcp__atlassian__assign_issue` com `accountId` do usuário logado.
   - CLI: `jira issue assign $ARGUMENTS $(jira me)`.

4. **Mover para "In Progress"**
   - MCP: `mcp__atlassian__transition_issue` com nome da transição "In Progress" (ou o slug exato do projeto — consulte a skill `jira-workflow`).
   - CLI: `jira issue move $ARGUMENTS "In Progress"`.

5. **Confirmar** retornando ao usuário:
   - Card atribuído ✅
   - Status atual ✅
   - Link direto para o card

---

## Erros comuns

- **Transição inexistente:** o nome da transição varia por board. Liste com `jira issue transitions $ARGUMENTS` e ajuste.
- **Sem permissão de assign:** reporte ao usuário; **não force** com outra conta.
- **MCP não configurado:** caia para CLI/`curl` sem reclamar — a skill `jira-workflow` cobre as duas vias.
