# Web App: React Router + RSC Data Mode (Agent Guide)

This doc is the “sharp edges” list. If you touch routes, data fetching, redirects, or auth, read this first.

## Non-negotiables (do this)

- **No loaders**: don’t add React Router `loader` functions in the web app. Fetch data directly in async Server Components.
- **Server components fetch data**: `export default async function Route()` and `await` your queries.
- **Client components are for interactivity**: keep hooks/event handlers/browser APIs in `"use client"` files.

## Redirects & responses (current project rule)

- Redirects are allowed via thrown Responses / `throw redirect(...)` where the codebase already does this.
- **Do not return redirects from `fetchServer`** in the RSC pipeline. Handle redirects before rendering the RSC payload.

## RSC pipeline rule: `fetchServer`

When you’re in the RSC entry pipeline:

- `fetchServer()` must return a `Response` containing an RSC payload body.
- If auth/role logic requires redirecting, do it *before* calling the RSC render step.

## File organization pattern

Prefer this route structure:

- `apps/web/src/routes/<route>/route.tsx` — Server Component (async)
- `apps/web/src/routes/<route>/client.tsx` — Client Components (`"use client"`)
- `apps/web/src/routes/<route>/actions.ts` — Server Actions (`"use server"`)

## Legacy notes

- If you encounter an existing `loader` in older code, treat it as legacy and migrate toward async Server Component patterns when you’re already working in that area.
