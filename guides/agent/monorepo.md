# Monorepo (Agent Guide)

## One sentence

This is a monorepo with a React Router web app (RSC Data mode), an Astro marketing site, and a shared design system package.

## Tooling baseline

- **Node.js**: `>=22.6.0` (web app engines requirement)
- **Package manager**: `npm` preferred; `pnpm` supported

## Workspaces

- `apps/web` — main application
- `apps/marketing` — marketing site
- `packages/design-system` — shared UI components

## Common commands (repo root)

- Dev (web + marketing): `npm run dev`
- Build all: `npm run build`
- Lint all: `npm run lint`
- Typecheck all: `npm run typecheck`

If using pnpm, the equivalents are typically:
- `pnpm -r dev`
- `pnpm -r build`
- `pnpm -r lint`
- `pnpm -r typecheck`

## Local stack (recommended)

Use Docker Compose when you need a real database:

- Dev profile: `docker compose --profile dev up`
- Prod-ish profile: `docker compose --profile prod up`

### Database

- **Prisma + PostgreSQL** (see `docker-compose.yml` and `apps/web/prisma/schema.prisma`)

## Where docs live

- Canonical agent docs: `guides/agent/*`
- Additional app docs: `apps/web/guides/*` and `apps/marketing/README.md`
