---
description: Roda a suíte completa de testes do projeto no main thread, sem delegar (preserva o output completo).
---

# /run-all-tests — Suíte completa de testes

Roda **toda** a suíte de testes no main thread. Não delegue a subagent (aula 23 do curso: test runners delegados escondem informação útil para debug).

---

## Detecção do stack

Antes de rodar, detecte o stack para escolher o comando certo:

| Arquivo detectado | Comando |
|-------------------|---------|
| `package.json` com script `test` | `npm test` (ou `pnpm test` / `yarn test` conforme o lockfile) |
| `pytest.ini` / `pyproject.toml` com `[tool.pytest]` | `pytest` |
| `go.mod` | `go test ./...` |
| `Cargo.toml` | `cargo test` |
| `Gemfile` com `rspec` | `bundle exec rspec` |
| `pom.xml` | `mvn test` |
| `build.gradle*` | `./gradlew test` |

Se houver `Makefile` com alvo `test`, prefira `make test`.

Se a `CLAUDE.md` do projeto definir um comando específico, **ele tem precedência**.

---

## Execução

1. Rode o comando detectado **uma única vez**.
2. Capture stdout + stderr **na íntegra** no main thread.
3. Se passar: reporte número de testes, tempo total e siga para a próxima etapa.
4. Se falhar:
   - Mostre o output dos testes que falharam.
   - **Pare** a pipeline.
   - Pergunte ao usuário se o problema é dentro ou fora do escopo da tarefa.
     - Dentro do escopo → corrija e rode de novo.
     - Fora do escopo → registre como decisão para a seção "Out of scope" do PR e pergunte se deve seguir mesmo assim.

---

## O que NÃO fazer

- ❌ Não rode só "os testes que mudei" — a suíte completa pega regressões.
- ❌ Não delegue a subagent (aula 23).
- ❌ Não suprima o output com `> /dev/null` ou `--quiet`.
- ❌ Não tente "consertar" testes alheios silenciosamente — eleve ao usuário.
