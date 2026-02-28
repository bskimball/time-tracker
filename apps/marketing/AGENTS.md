# Marketing Site (Agent Instructions)

Astro-based marketing site for Shift Pulse using shared design-system components.

## Read order (progressive disclosure)

- Follow root [../../AGENTS.md](../../AGENTS.md) first.
- Start with [../../guides/agent/README.md](../../guides/agent/README.md), then open only guides needed for this task.

## Essentials for every marketing task

- Keep changes scoped to `apps/marketing` unless the task explicitly requires cross-workspace updates.
- Reuse `@monorepo/design-system` components/tokens before adding local styling patterns.
- If you discover missing or unclear guidance, update one focused guide and link it from [../../guides/agent/README.md](../../guides/agent/README.md).
- Runtime baseline is Node.js `>=22.6.0`.

## Non-standard validation commands

- Marketing lint: `cd apps/marketing && npm run lint`
- Marketing typecheck: `cd apps/marketing && npm run typecheck`
- Marketing build: `cd apps/marketing && npm run build`
