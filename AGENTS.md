# Shift Pulse (Agent Notes)

Shift Pulse is a monorepo containing a React Router web app (RSC Data mode), an Astro marketing site, an Astro Starlight docs site, and a shared design system.

## Essentials

- **Node.js**: `>=22.6.0`
- **Package manager**: `npm` preferred; `pnpm` supported

## Workspaces

- `apps/web` — main application
- `apps/marketing` — marketing site
- `apps/docs` — customer docs site (Astro Starlight)
- `packages/design-system` — shared UI components ("Precision Industrial" / Braun aesthetic)

## Design System

The project uses a custom **"Precision Industrial"** aesthetic inspired by Dieter Rams and Braun, built on **TailwindCSS v4**.
- **Source of Truth**: `packages/design-system` contains all tokens (via CSS vars) and styles.
- **Integration**: `apps/web`, `apps/marketing`, and `apps/docs` must use `@source` to point to the design system for JIT compilation.
- **Tokens**: Zinc neutrals, Signal Orange (`primary`), Tabular numbers.
- **Configuration**: **No `tailwind.config.*` files**. All configuration is done via CSS `@theme` blocks.
- **Aesthetic**: Sharp corners (`rounded-[2px]`), hard borders, no soft shadows, data-dense.
- **Fonts**: `Space Grotesk` (Headings/Industrial), `JetBrains Mono` (Data/Inputs).

See: [guides/agent/design-system.md](guides/agent/design-system.md)

## Commands you’ll use often

From repo root:

- Dev (all): `npm run dev` (watches design-system + web + marketing + docs)
- Build all: `npm run build`
- Lint all: `npm run lint`
- Typecheck all: `npm run typecheck`

Local full-stack (database, app containers):

- Dev profile: `docker compose --profile dev up`
- Prod profile: `docker compose --profile prod up`

## Progressive disclosure docs

Start here: [guides/agent/README.md](guides/agent/README.md)

Common entry points:

- Monorepo workflows: [guides/agent/monorepo.md](guides/agent/monorepo.md)
- Web app RSC rules: [guides/agent/web-rsc-data-mode.md](guides/agent/web-rsc-data-mode.md)
- Auth/request context: [guides/agent/auth.md](guides/agent/auth.md)
- Testing: [guides/agent/testing.md](guides/agent/testing.md)

## How to work (agent expectations)

- Use the task-scoped guides in `guides/agent/*` first; they encode the repo’s “gotchas” and preferred patterns.
- Use your available tools/skills when they increase correctness and speed (search before guessing, run lint/typecheck after meaningful code changes, prefer small targeted patches).
- If you discover a missing/unclear rule or a recurring pitfall, update an existing guide or add a new one (then link it from `guides/agent/README.md`).

See: [guides/agent/agent-skills-and-docs.md](guides/agent/agent-skills-and-docs.md)
