---
name: commit-conventions
description: Convenções de mensagem de commit (Conventional Commits + chave do Jira). Use sempre que escrever uma mensagem de commit, sugerir uma mensagem para outro agente, ou ao montar a seção de "Commit" de uma spec.
allowed-tools: Bash, Read
---

# Commit Conventions

Baseado em **Conventional Commits** com a chave do Jira obrigatória no rodapé.

## Formato

```
<tipo>(<escopo opcional>): <assunto no imperativo, ≤72 chars>

<corpo opcional — o "por quê", não o "o quê"; quebre em 72 chars>

Refs: <JIRA-KEY>
```

## Tipos permitidos

`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `hotfix`.

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade visível ao usuário |
| `fix` | Bug fix em comportamento existente |
| `chore` | Manutenção (deps, configs, scripts) |
| `docs` | Apenas documentação |
| `refactor` | Mudança interna sem alterar comportamento |
| `test` | Adição/correção de testes apenas |
| `perf` | Otimização de performance |
| `hotfix` | Correção urgente em produção |

## Regras de assunto

1. **Imperativo**: "add user search", **não** "added user search" nem "adding user search".
2. **Minúscula** após os dois-pontos (exceto nomes próprios/siglas).
3. **Sem ponto final**.
4. **≤72 caracteres** no header inteiro.
5. **Escopo** opcional, em minúsculas: `feat(auth): ...`, `fix(checkout): ...`.

## Regras de corpo

- Use o corpo para explicar **por quê** a mudança foi feita, não **o quê** (o diff já mostra o quê).
- Quebre linhas em 72 chars.
- Refira o card do Jira no rodapé: `Refs: PROJ-123` ou `Closes: PROJ-123` quando o commit fecha a tarefa.

## Padrão de pareamento por bloco da spec

Cada bloco da spec gera **dois commits**:

1. **Commit de código**: descreve a mudança funcional.
   ```
   feat(search): add user search endpoint

   Adds GET /users?q= so the dashboard can show
   matches as the user types.

   Refs: PROJ-123
   ```

2. **Commit de testes**: descreve a cobertura adicionada.
   ```
   test(search): cover user search endpoint

   Adds happy path, empty result, and pagination cases
   for GET /users?q=.

   Refs: PROJ-123
   ```

Os dois commits **devem** referenciar o mesmo `JIRA-KEY`.

## Anti-padrões (não fazer)

- ❌ `wip`, `fix stuff`, `update`, `address review` — mensagens sem informação.
- ❌ Misturar várias mudanças sem relação em um commit. Quebre por bloco da spec.
- ❌ `--amend` em commits já pushed, exceto se o usuário pedir explicitamente.
- ❌ Pular hooks com `--no-verify`. Se o hook reclamou, **conserte**.

## Validação

O hook `validate-commit-message` (PreToolUse em `Bash` para `git commit`) checa:
- Tipo válido.
- Header ≤72 chars.
- Rodapé `Refs: <KEY>` ou `Closes: <KEY>` presente.

Se bloquear: leia o erro, ajuste a mensagem, refaça o `git commit`. **Não** burle.
