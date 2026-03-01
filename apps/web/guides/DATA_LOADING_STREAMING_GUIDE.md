# Data Loading and Streaming Standard (RSC Data Mode)

This is the default loading model for the web app.

Use this on every route that loads meaningful data.

## Core Standard

1. Render shell first.
   - Route header, tabs, filters, and controls should render immediately.
   - Do not gate shell on heavy DB queries.
2. Start early, await late.
   - Start independent promises as soon as possible.
   - Await only where data is required for a specific display block.
3. Stream by display block.
   - Split page content into multiple `Suspense` boundaries.
   - Each major chart/table/card group should resolve independently.
4. Use safe deferred promises.
   - Wrap async loaders so one failed block shows a local error card.
   - Never let one failed query blank the whole page.
5. Keep RSC boundaries clean.
   - Server routes/components fetch and compose data.
   - Client components handle interactivity and may `use(promise)` for deferred props.

## Required Patterns

### Route shell + deferred blocks

```tsx
export default async function Component() {
	const authPromise = validateRequest();
	const summaryPromise = getSummary();
	const trendPromise = getTrend();

	await authPromise;

	return (
		<>
			<PageHeader title="..." />
			<Suspense fallback={<BlockFallback label="Loading summary" />}>
				<SummaryBlock promise={summaryPromise} />
			</Suspense>
			<Suspense fallback={<BlockFallback label="Loading trends" />}>
				<TrendBlock promise={trendPromise} />
			</Suspense>
		</>
	);
}
```

### Safe promise wrapper for partial failures

```ts
function createSafePromise<T>(promise: Promise<T>) {
	return promise
		.then((data) => ({ data, error: null as string | null }))
		.catch((error) => ({
			data: null as T | null,
			error: error instanceof Error ? error.message : "Failed to load data",
		}));
}
```

### Client-side deferred block resolution

```tsx
"use client";

import { Suspense, use } from "react";

function Section({
	kpiPromise,
}: {
	kpiPromise: Promise<{ data: Kpi | null; error: string | null }>;
}) {
	return (
		<Suspense fallback={<BlockFallback label="Loading KPIs" />}>
			<KpiBlock kpiPromise={kpiPromise} />
		</Suspense>
	);
}

function KpiBlock({
	kpiPromise,
}: {
	kpiPromise: Promise<{ data: Kpi | null; error: string | null }>;
}) {
	const result = use(kpiPromise);
	if (result.error) return <ErrorCard message={result.error} />;
	if (!result.data) return <EmptyCard />;
	return <KpiGrid data={result.data} />;
}
```

## Client-side section cache pattern (tabbed analytics/reporting UIs)

Use this when a route changes query params (for example `?section=`) and users rapidly flip between tabs.

- Keep `route.tsx` server-rendered and URL-driven.
- Keep `range` / `compare` in URL as data scope keys.
- In a small client display shell, cache resolved block results in memory by key:
  - `${range}:${compare}:${section}:${block}`
- On cache hit, render immediately without re-showing skeletons.
- On cache miss, resolve the deferred promise and cache the result.
- Invalidate cache when scope changes (for example `range` or `compare`).
- Wrap section tab `navigate(...)` calls in `startTransition(...)` so current content stays visible during route transition.

Example shape:

```tsx
"use client";

const cacheRef = useRef(new Map<string, unknown>());

function useCachedDisplay<T>(key: string, promise: Promise<T>): T {
	if (cacheRef.current.has(key)) return cacheRef.current.get(key) as T;
	const resolved = use(promise);
	cacheRef.current.set(key, resolved);
	return resolved;
}
```

This pattern avoids loading flicker while preserving deep-linking and server streaming on first load.

## Anti-Patterns (Do Not Use)

- One giant route-level `await Promise.all([...])` that gates the full page.
- Monolithic `dataPromise` for an entire page when displays can be split.
- Fetching heavy secondary modules before rendering header/controls.
- Converting route to client component just to bootstrap initial data.

## Existing Reference Routes

- Fine-grained streaming: `apps/web/src/routes/executive/analytics/route.tsx`
- Streaming + client display cache for section switches: `apps/web/src/routes/executive/analytics/analytics-dashboard.tsx`
- Progressive manager dashboard: `apps/web/src/routes/manager/dashboard/client.tsx`
- Deferred report sections: `apps/web/src/routes/manager/reports/client.tsx`

## Implementation Checklist (for every heavy route)

- [ ] Header/controls render before heavy data
- [ ] Independent promises started early
- [ ] 2+ Suspense boundaries for major displays
- [ ] Localized error UI per deferred block
- [ ] No loaders, no redirect from RSC payload function
- [ ] Typecheck + lint pass
