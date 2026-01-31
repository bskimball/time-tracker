# Troubleshooting (Agent Guide)

## RSC-specific issues

- **Hanging pages / requests**: check for accidental `loader` usage; prefer async Server Components.
- **Redirect problems**: avoid redirecting from the RSC `fetchServer` boundary; redirect earlier.
- **"use client" warnings**: ensure the directive is the first line in the file.

## Database issues

- If using Docker: start postgres via `docker compose --profile dev up`.
- If Prisma client seems stale: re-run `npx prisma generate` in the relevant workspace.

## Where to look

- RSC rules: `guides/agent/web-rsc-data-mode.md`
- Monorepo basics: `guides/agent/monorepo.md`
