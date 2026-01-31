# Git Workflow (Agent Guide)

This repo doesn’t require a special workflow, but these conventions help keep changes consistent.

## Branching

- Prefer short-lived feature branches.

## Before opening a PR

- Run the workspace checks relevant to your change:
  - Web app: `cd apps/web && npm run check`
  - Monorepo-wide: `npm run lint` and `npm run typecheck`

## Commit messages (optional convention)

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` refactor
