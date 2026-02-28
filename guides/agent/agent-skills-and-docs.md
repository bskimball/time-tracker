# Agent Skills + Doc Hygiene (Agent Guide)

This guide explains two expectations:

1. Use the assistant’s _skills/tools_ when they improve correctness and speed.
2. Keep this repo’s agent docs accurate by updating or adding guides when you learn something new.

## Use skills/tools when appropriate

Mandatory skill loading rules live in [core/required-skills.md](./core/required-skills.md). Follow those first.

### Prefer evidence over guessing

Before making changes, quickly gather context:

- Use search first (find the existing pattern before inventing a new one).
- Read the nearest guide for the area you’re editing (often `web-rsc-data-mode.md` or `auth.md`).
- Skim adjacent routes/components to match conventions.

### Validate changes at the right scope

Run the smallest check that gives confidence, then expand if needed:

- Web app only: `cd apps/web && npm run check`
- Monorepo wide: `npm run lint` and `npm run typecheck`

If you changed behavior (not just types), add or update a test when there’s an obvious existing test location.

### Skill selection heuristic

- Use the smallest set of skills needed for the task.
- Prefer one implementation skill plus one review skill when both are needed.
- For UI changes, include a UI/UX review pass before finalizing.

## Update guides when you discover a pitfall

This repo relies on “progressive disclosure” docs in `guides/agent/*`.

Update docs when you find:

- A recurring bug pattern (e.g. an RSC redirect gotcha).
- A non-obvious convention (file placement, naming, routing rules).
- A sharp edge in tooling (lint/typecheck/test commands, workspace quirks).
- A feature area that lacks a guide and is likely to be touched again.

### Where to put documentation

- General cross-cutting guidance: `guides/agent/*`
- Web-app-specific deep dives: `apps/web/guides/*`
- Marketing-specific notes: `apps/marketing/README.md` (or a focused guide if it grows)
- Docs-site-specific notes: `apps/docs/src/content/docs/*` (and `apps/docs/src/styles/*` for presentation/system integration)

### Minimal format for a new guide

- **One sentence**: the purpose / when to read it.
- **Do / Don’t list**: the most important constraints.
- **Examples**: a short snippet or file pointer when it prevents mistakes.
- Link the new guide from `guides/agent/README.md`.
