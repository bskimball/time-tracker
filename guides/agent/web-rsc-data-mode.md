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

## Data loading standard (shell first + staged streaming)

When a route is data-heavy, use this default approach:

- Render `PageHeader` and controls immediately.
- Start independent promises early.
- Split content into multiple `Suspense` boundaries by display block.
- Resolve deferred data per block (server async components or client `use(promise)` blocks).
- Use localized fallback/error states so one failed block does not blank the whole page.

Avoid this anti-pattern:

- One large route-level `await Promise.all([...])` that blocks the entire page render.

## Client cache for query-param tab switches

For routes that switch views with query params (for example `?section=productivity`), use a hybrid pattern:

- Keep the route server-rendered and URL-driven for deep links.
- Keep filters like `range` / `compare` in URL.
- Use a small client display shell to cache resolved deferred blocks in memory.
- Key cache by scope + section + block (for example `${range}:${compare}:${section}:${block}`).
- Clear cache when scope keys change (`range`/`compare`).
- Wrap section `navigate(...)` calls in `startTransition(...)` so prior content stays visible while routing.

This avoids skeleton flicker when users flip between sections and still preserves first-load streaming behavior.

Reference guide:

- `apps/web/guides/DATA_LOADING_STREAMING_GUIDE.md`
- `apps/web/src/routes/executive/analytics/analytics-dashboard.tsx`

## Legacy notes

- If you encounter an existing `loader` in older code, treat it as legacy and migrate toward async Server Component patterns when you’re already working in that area.

## Manager live updates (SSE)

- Manager operational pages use SSE at `/api/realtime/manager-stream` for live updates.
- Keep SSE endpoint auth aligned with manager/admin session auth (do not rely on API-key-only middleware for browser manager views).
- Publish lightweight typed events from server mutations (`task_assignment_changed`, `time_log_changed`, `break_changed`, `worker_status_changed`) and include event id/timestamp.
- Client pages must gracefully degrade to bounded polling with backoff when SSE is unavailable.
