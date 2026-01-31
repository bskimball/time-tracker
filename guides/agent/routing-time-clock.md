# Time Clock Routing (Agent Guide)

## Primary routes

- `/floor` — primary time clock interface
- `/time-clock/kiosk` — kiosk mode
- `/floor/time-clock/mobile` — mobile-optimized view (typically reached via device detection)
- `/time-clock` — legacy redirect to `/floor`

## Where to change what (rule of thumb)

- **Server-side data fetching / gating**: the Server Component for the route you’re changing
- **Shared time clock UI interactions**: shared client components (time-clock client module)
- **Mutations (clock in/out, break start/end)**: server actions

## RSC constraints

- Keep the route entry as an async Server Component (no loaders).
- Redirects can be thrown, but avoid redirecting from the RSC `fetchServer` boundary (handle earlier in the pipeline).

## Manual verification checklist

- `/floor` renders for unauthenticated/public usage (as intended)
- Mobile user agents land on `/floor/time-clock/mobile`
- Enabling kiosk mode routes to `/time-clock/kiosk`
- `/time-clock` redirects to `/floor`
