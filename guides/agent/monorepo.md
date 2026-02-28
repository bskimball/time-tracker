# Monorepo (Agent Guide)

## One sentence

This is a monorepo with a React Router web app (RSC Data mode), an Astro marketing site, a Starlight docs site, and a shared design system package.

## Workspaces

- `apps/web` — main application
- `apps/marketing` — marketing site
- `apps/docs` — customer docs site (Astro Starlight)
- `packages/design-system` — shared UI components

For runtime and command baselines, use [core/runtime-and-commands.md](./core/runtime-and-commands.md).

## Local stack (recommended)

Use Docker Compose when you need a real database:

- Dev profile: `docker compose --profile dev up`
- Prod-ish profile: `docker compose --profile prod up`

### Database

- **Prisma + PostgreSQL** (see `docker-compose.yml` and `prisma/schema.prisma`)

## Task routing

- If the task is in `apps/web`, read [web-rsc-data-mode.md](./web-rsc-data-mode.md) before editing.
- If the task touches shared UI or tokens, read [design-system.md](./design-system.md).
- If the task changes auth, read [auth.md](./auth.md).

## Where docs live

- Canonical agent docs: `guides/agent/*`
- Additional app docs: `apps/web/guides/*`, `apps/marketing/README.md`, and `apps/docs/src/content/docs/*`
