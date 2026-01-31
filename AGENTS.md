# Time Tracker (Agent Notes)

Time Tracker is a monorepo containing a React Router web app (RSC Data mode), an Astro marketing site, and a shared design system.

## Essentials

- **Node.js**: `>=22.6.0`
- **Package manager**: `npm` preferred; `pnpm` supported

## Commands you’ll use often

From repo root:

- Dev (web + marketing): `npm run dev`
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
