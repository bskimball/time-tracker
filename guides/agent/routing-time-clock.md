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

## Worker self-assignment rollout checks

### Mode behavior (`TASK_ASSIGNMENT_MODE`)

- `MANAGER_ONLY`: worker task controls are hidden/blocked; manager assignment still works.
- `SELF_ASSIGN_ALLOWED`: worker task controls allow start/switch/end while clocked in.
- `SELF_ASSIGN_REQUIRED`: same as allowed, plus worker gets a required-task warning while clocked in without an active task.

### Assignment source semantics

- Manager task actions persist `source = MANAGER` and `assignedByUserId = <manager/admin user id>`.
- Worker self-task actions persist `source = WORKER` and `assignedByUserId = null`.
- Manager task/timesheet UI should label worker-originated records as self-assigned.

### Terminology consistency

- **Clocked-in**: active `WORK` time log.
- **Floor-active**: clocked-in or active task assignment (union view used for manager visibility).
