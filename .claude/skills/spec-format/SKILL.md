---
name: spec-format
description: Formato canônico para uma spec de implementação dividida em blocos "implementação → commit → testes → commit". Use ao escrever uma spec de tarefa, ao revisar uma spec produzida por outro agente, ou quando o usuário pedir um "plano de implementação detalhado".
allowed-tools: Read
---

# Spec Format

A spec é o contrato entre o main thread e o autor da tarefa. Ela tem que ser **executável commit-a-commit** sem precisar reinterpretar nada.

## Estrutura obrigatória

```markdown
# Spec: <título curto da tarefa>

## Resumo
2-3 frases. Problema → solução → impacto.

## Pré-requisitos
- [ ] Card no Jira em "In Progress" via [[jira-workflow]]
- [ ] (Outros pré-requisitos específicos)

## Blocos de implementação

### Bloco N — <título>

**Por quê:** 1 frase de motivação.

**Mudanças de código:**
- `path/para/arquivo.ext` — 1 a 3 bullets curtos do que muda.

**Commit do código** (siga [[commit-conventions]]):
```
<tipo>(<escopo>): <assunto>

<corpo opcional>

Refs: <JIRA-KEY>
```

**Testes a adicionar:**
- `path/para/arquivo.test.ext` — `nome do teste` — o que valida.

**Commit dos testes** (siga [[commit-conventions]]):
```
test(<escopo>): cover <assunto>

Refs: <JIRA-KEY>
```

## Riscos e mitigações
- <risco> — <mitigação>

## Fora do escopo
<o que ficou de fora e por quê>

## Critérios de pronto
- [ ] <verificável>

## Obstáculos encontrados
<setup/quirks/workarounds — "Nenhum" se não houver>
```

## Regras de blocos

1. **Atômico:** cada bloco deve ser revertível sem quebrar outros.
2. **Ordem importa:** se o bloco 3 depende do bloco 1, o bloco 2 não pode quebrar o bloco 1.
3. **Pareamento:** sempre **um commit de código + um commit de testes** por bloco. Se um bloco é só refactor sem testes novos, justifique e use 1 commit só.
4. **Tamanho:** 2 a 5 blocos é o ponto doce. Mais que 6 = PR provavelmente grande demais; sugira fatiar a tarefa.

## O que NÃO incluir

- ❌ Código pronto. Spec descreve a mudança, não implementa. Pseudocódigo curto é ok quando uma decisão de design não-óbvia precisa ser fixada.
- ❌ Reescrita de partes do sistema fora do escopo. Use a seção "Fora do escopo" para listar oportunidades.
- ❌ Convenções genéricas — elas já estão em [[commit-conventions]]. Linke, não duplique.
