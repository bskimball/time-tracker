# Agent Guide Index

Start here. This folder contains task-scoped guidance (progressive disclosure) so you can get the minimum needed for the task you’re doing.

## What to read (by task)

- **Working anywhere in the monorepo** → [monorepo.md](./monorepo.md)
- **Changing the web app** (React Router + RSC Data mode) → [web-rsc-data-mode.md](./web-rsc-data-mode.md)
- **Changing shared UI/tokens across app + marketing + docs** → [design-system.md](./design-system.md)
- **Auth / roles / request context** → [auth.md](./auth.md)
- **Time clock routing** (`/floor`, kiosk, mobile) → [routing-time-clock.md](./routing-time-clock.md)
- **Testing** (Vitest patterns) → [testing.md](./testing.md)
- **Linting + formatting** (ESLint/Prettier conventions) → [linting-formatting.md](./linting-formatting.md)
- **Git workflow** (optional conventions) → [git-workflow.md](./git-workflow.md)
- **Data model** (schema + reporting changes) → [data-model.md](./data-model.md)
- **Deployment** (build/run) → [deployment.md](./deployment.md)
- **Troubleshooting** → [troubleshooting.md](./troubleshooting.md)
- **Agent skills + doc hygiene** (how to use tools and keep guides current) → [agent-skills-and-docs.md](./agent-skills-and-docs.md)

## Repo truth sources

- Scripts and workspaces: `package.json`
- Web app specifics: `apps/web/package.json`, `apps/web/README.md`
- Docs site specifics: `apps/docs/src/content/docs/*`, `apps/docs/src/styles/*`
- Local stack: `docker-compose.yml`
