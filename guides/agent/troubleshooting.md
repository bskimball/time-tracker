# Troubleshooting (Agent Guide)

## RSC-specific issues

- **Hanging pages / requests**: check for accidental `loader` usage; prefer async Server Components.
- **Redirect problems**: avoid redirecting from the RSC `fetchServer` boundary; redirect earlier.
- **"use client" warnings**: ensure the directive is the first line in the file.
- **`[plugin vite-rsc-metafile] Error: Not implemented` during dev startup**: check for multiple Vite majors in the workspace.
  - The web app's `@vitejs/plugin-rsc` must resolve the same Vite major as the `vite` binary running `apps/web`.
  - In this monorepo, keep root Vite aligned with the web app's Vite 8 line so the hoisted RSC plugin does not import an older Astro-provided Vite.
- **`ERR_INVALID_STATE: Unable to enqueue` in dev**: usually a downstream stream crash, not the root cause.
  - Check logs just before it for `[vite-rsc] invalid server reference '/src/.../actions.ts'`.
  - Common trigger in this repo: a client route (`route.tsx` with `"use client"`) importing `./actions` and calling server actions for initial page data in `useEffect`.
  - Fix by moving initial data fetch into an async Server Component route and keeping only interactive UI in a `client.tsx` child.

## Database issues

- If using Docker: start postgres via `docker compose --profile dev up`.
- If Prisma client seems stale: re-run `npx prisma generate` in the relevant workspace.

## Where to look

- RSC rules: `guides/agent/web-rsc-data-mode.md`
- Monorepo basics: `guides/agent/monorepo.md`
