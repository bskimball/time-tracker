# Web App: React Router + RSC Data Mode (Agent Guide)

This doc is the “sharp edges” list. If you touch routes, data fetching, redirects, or auth, read this first.

## Non-negotiables (do this)

- **No loaders**: don’t add React Router `loader` functions in the web app. Fetch data directly in async Server Components.
- **Server components fetch data**: `export default async function Route()` and `await` your queries.
- **Client components are for interactivity**: keep hooks/event handlers/browser APIs in `"use client"` files.
- **Do not make the route module a client page just to fetch data**: avoid `"use client"` at the top of `route.tsx` when the page's primary work is loading server data.

## Server actions from client modules (easy mistake)

- Do not use a client route (`"use client"` in `route.tsx`) that imports `./actions` and calls many server actions in `useEffect` for initial page data.
- In this repo/RSC setup, that pattern can fail validation in dev with: `[vite-rsc] invalid server reference '/src/.../actions.ts'`.
- Preferred pattern:
  - Keep `route.tsx` as an async Server Component.
  - Fetch initial data directly in that Server Component.
  - Render a small `client.tsx` shell only for interactivity, passing server-fetched data as props.
- Use Server Actions from client code for user-triggered interactions (forms/buttons via `useActionState`), not as the page bootstrapping data loader.

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
