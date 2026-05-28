---
description: Orquestra a pipeline completa de desenvolvimento agêntico do início ao fim (docs → spec → Jira → implementação → testes → PR).
---

# /ship-task — Pipeline Agêntica Ponta a Ponta

Executa a pipeline completa para a tarefa **$ARGUMENTS** (geralmente uma chave do Jira, ex.: `PROJ-123`).

Se `$ARGUMENTS` estiver vazio, **pergunte ao usuário** qual é a chave do Jira ou descrição da tarefa antes de prosseguir.

---

## Fluxo determinístico (siga em ordem — não pule etapas)

### Etapa 1 — Coleta de contexto técnico

Delegue ao subagent `context-collector` para investigar a base de código e a documentação técnica relevante para `$ARGUMENTS`.

> Use o agente `context-collector` para ler todas as docs (`docs/`, `README.md`, `CLAUDE.md`, ADRs, schemas) e código existente que toca a área afetada por `$ARGUMENTS`. Retorne apenas o relatório estruturado.

**Não prossiga** até o subagent retornar o relatório. O resultado entra no main thread como contexto para a próxima etapa.

### Etapa 2 — Spec de implementação

Delegue ao subagent `spec-architect`, **passando o relatório da etapa 1**, para produzir uma spec no formato `implementação → commit → testes → commit` (veja a skill `spec-format`).

> Use o agente `spec-architect` para montar a spec. Inclua o relatório do `context-collector` no input. Entregue a spec no formato exigido pela skill `spec-format`, com mensagens de commit prontas para colar.

Apresente a spec ao usuário e **aguarde aprovação explícita** antes de continuar.

### Etapa 3 — Jira: buscar card e mover para In Progress

Execute `/jira-start $ARGUMENTS` (que carrega a skill `jira-workflow`).

Confirme com o usuário antes de mover o card.

### Etapa 4 — Implementação seguindo a spec

Esta etapa **fica no main thread** (passos dependentes não delegam bem — veja aula 23 do curso).

Para cada bloco da spec aprovada:

1. Implemente o código exato do bloco.
2. Faça `git add` apenas dos arquivos relevantes (não use `-A`).
3. Faça `git commit` com a mensagem **literal** da spec — o hook `validate-commit-message` valida o formato (skill `commit-conventions`).
4. Implemente os testes do bloco.
5. Rode **apenas** os testes do bloco para feedback rápido.
6. Faça `git commit` dos testes com a mensagem da spec.

Repita até cobrir toda a spec.

### Etapa 5 — Suíte completa de testes

Execute `/run-all-tests`. **Não delegue para subagent** — você precisa ver o output completo (aula 23).

Se algo quebrar fora do escopo da tarefa, **pare** e reporte ao usuário. Decisão sobre escopo é dele.

### Etapa 6 — Descrição do PR

Delegue ao subagent `pr-writer`, passando:
- A chave do Jira (`$ARGUMENTS`)
- A spec aprovada
- Qualquer decisão fora do escopo original (peça ao usuário se houve)

O subagent devolve a descrição final usando a skill `pr-template`.

### Etapa 7 — Abrir o PR

Execute `/open-pr` com a descrição entregue pelo `pr-writer`.

Retorne ao usuário a URL do PR.

---

## Regras gerais

- **Nunca** pule a aprovação da spec (etapa 2).
- **Nunca** faça commit direto em `main`/`master` — o hook `block-direct-main-commit` impede, mas evite tentar.
- **Nunca** delegue execução de testes a subagent — fica no main thread.
- Se um hook bloquear, **leia a mensagem de erro** e corrija; não tente burlar.
- Decisões fora do escopo original devem ser anotadas para entrar na seção "Out of scope" do PR (skill `pr-template`).
