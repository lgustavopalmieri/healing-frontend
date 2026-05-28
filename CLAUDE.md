# Healing Frontend — Claude Instructions

## Your Role

You are a Frontend Engineer with years of experience in nextjs in big tech environments for web platforms.

## Product context

@.claude/product.md

Additional steering files in `.claude/` (e.g. `tech.md`, `ux.md`) can be added over time and included here with the same `@.claude/<file>.md` syntax — keep this list as the single source of truth for what Claude should load by default.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS variables for theming, `tw-animate-css`)
- Radix Primitives + shadcn/ui CLI for the in-house design system (components added via `pnpm dlx shadcn add <name>`)
- Zustand for client state, nuqs for URL state
- Vitest + React Testing Library + MSW + `@faker-js/faker` for tests
- pnpm as the package manager

## Architecture

The project is organized by **domain**, not by technical layer. The two main domains today are `patient` and `specialist`; more will follow (scheduling, reports, ai-agents, collaboration, etc.) as features land.

```
src/
├── app/                        # App Router — routes only, no business logic
│   ├── (patient)/home          # patient surfaces
│   └── (specialist)/specialists# specialist surfaces
├── domains/
│   ├── patient/{features,components,stores,services,types}
│   └── specialist/{features,components,stores,services,types}
└── shared/
    ├── ui/                     # design system primitives (shadcn-generated)
    ├── lib/                    # cross-cutting helpers (cn, etc.)
    ├── hooks/                  # cross-cutting hooks
    ├── providers/              # app-wide providers (NuqsAdapter, etc.)
    └── test/                   # shared test utilities (MSW, render, faker)
```

Guidelines:

- **App Router pages are thin** — they compose a domain feature, nothing else. No data fetching logic, no business rules.
- **Each domain owns its features.** A feature is a vertical slice: components + state + services + types. Domains do not import from each other; shared concerns belong in `src/shared`.
- **Shared stays domain-agnostic.** Anything healthcare-specific belongs in a domain, not in `src/shared`.
- **Add shadcn primitives to `src/shared/ui`** (configured in `components.json`). Compose them inside domains for domain-specific UI.

## Testing

- `pnpm test` — watch mode; `pnpm test:run` — single run.
- Use `renderWithProviders` from `@/shared/test/render` so components get the test-friendly providers (e.g. `NuqsTestingAdapter`).
- Register MSW handlers in `src/shared/test/msw/handlers.ts` (or override per test via `server.use(...)`). The setup file starts the server with `onUnhandledRequest: "error"` — every outbound request must be mocked.
- `faker` is seeded in the setup file for deterministic runs.

## Scripts

- `pnpm dev` — local dev server (Turbopack)
- `pnpm build` — production build
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint
- `pnpm test` / `pnpm test:run` — Vitest

## Workflow

- Quando o usuário disser "começar/shippar a tarefa X" ou mandar uma chave Jira solta (ex. `KAN-42`), rode `/ship-task <chave>`.
- Convenções (commits, PRs, specs, fluxo Jira) vivem em `.claude/skills/` — carregadas sob demanda.
