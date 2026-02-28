# Shift Pulse (Agent Instructions)

Shift Pulse is a monorepo with a React Router web app, Astro marketing/docs sites, and a shared Tailwind v4 design system.

## Read order (progressive disclosure)

- `AGENTS.md` is canonical for all first-party agents and subagents.
- If any linked guide conflicts with this file, follow `AGENTS.md`.
- Start with [guides/agent/README.md](guides/agent/README.md), then open only the guides needed for the current task.

## Essentials for every task

- Keep changes task-scoped and minimal.
- If guidance is missing or unclear, update/add one focused guide and link it from [guides/agent/README.md](guides/agent/README.md).
- Baseline runtime is Node.js `>=22.6.0`.

## Non-standard validation commands

- Monorepo typecheck: `npm run typecheck` (runs workspace typecheck scripts).
- Monorepo build: `npm run build` (runs workspace build scripts).
- Web app full quality check: `cd apps/web && npm run check` (format check + lint + typecheck).
