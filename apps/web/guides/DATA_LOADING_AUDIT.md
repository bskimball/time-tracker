# Data Loading Audit

Last updated: 2026-02-14

Scope checked:

- All route modules in `apps/web/src/routes/**/route.ts*`
- All route layouts in `apps/web/src/routes/**/layout.tsx`
- Route-coupled heavy components under `apps/web/src/routes/**`

## Status Legend

- `compliant`: shell-first + staged Suspense streaming (or route is naturally lightweight)
- `partial`: has optimization work but still has notable route-level gating
- `not-needed`: trivial page without meaningful heavy data loading

## Route Status

### Executive

- `apps/web/src/routes/executive/analytics/route.tsx` - compliant
- `apps/web/src/routes/executive/analytics/client.tsx` - compliant
- `apps/web/src/routes/executive/dashboard/route.tsx` - partial
- `apps/web/src/routes/executive/layout.tsx` - not-needed

### Manager

- `apps/web/src/routes/manager/dashboard/route.tsx` - partial
- `apps/web/src/routes/manager/dashboard/client.tsx` - compliant
- `apps/web/src/routes/manager/reports/route.tsx` - compliant
- `apps/web/src/routes/manager/reports/client.tsx` - compliant
- `apps/web/src/routes/manager/tasks/route.tsx` - partial
- `apps/web/src/routes/manager/tasks/client.tsx` - compliant
- `apps/web/src/routes/manager/timesheets/route.tsx` - partial
- `apps/web/src/routes/manager/timesheets/client.tsx` - compliant
- `apps/web/src/routes/manager/monitor/route.tsx` - compliant
- `apps/web/src/routes/manager/schedule/route.tsx` - partial
- `apps/web/src/routes/manager/schedule/client.tsx` - partial
- `apps/web/src/routes/manager/layout.tsx` - not-needed
- `apps/web/src/routes/manager/employees/route.tsx` - not-needed
- `apps/web/src/routes/manager/employees/new/route.tsx` - not-needed
- `apps/web/src/routes/manager/employees/[id]/route.tsx` - not-needed
- `apps/web/src/routes/manager/employees/[id]/edit/route.tsx` - not-needed

### Floor and Time Clock

- `apps/web/src/routes/floor/route.tsx` - partial
- `apps/web/src/routes/floor/kiosk/route.tsx` - partial
- `apps/web/src/routes/floor/layout.tsx` - not-needed
- `apps/web/src/routes/time-clock/route.tsx` - partial

### Settings and Utility

- `apps/web/src/routes/settings/route.tsx` - not-needed
- `apps/web/src/routes/settings/stations/route.tsx` - not-needed
- `apps/web/src/routes/settings/employees/route.tsx` - not-needed
- `apps/web/src/routes/settings/users/route.tsx` - not-needed
- `apps/web/src/routes/settings/api-keys/route.tsx` - not-needed
- `apps/web/src/routes/settings/operational-config/route.tsx` - not-needed
- `apps/web/src/routes/settings/layout.tsx` - not-needed
- `apps/web/src/routes/todo/route.tsx` - not-needed
- `apps/web/src/routes/home/route.tsx` - not-needed
- `apps/web/src/routes/login/route.tsx` - not-needed
- `apps/web/src/routes/logout/route.ts` - not-needed
- `apps/web/src/routes/dev-login/route.tsx` - not-needed
- `apps/web/src/routes/root/route.tsx` - not-needed
- `apps/web/src/routes/dashboard-redirect/route.ts` - not-needed

## Remaining Work to Reach Full Standard

1. Executive dashboard: split KPI and operations sections into independent deferred blocks.
2. Manager dashboard route: move more data sources to per-section promises so header and first block mount earlier.
3. Manager tasks/timesheets/schedule: keep shell immediate and stream heavy lists/tables in smaller boundaries.
4. Floor/time-clock: break remaining route-level aggregate loads into staged promises for secondary sections.

## Enforcement Notes

- New heavy routes must follow `apps/web/guides/DATA_LOADING_STREAMING_GUIDE.md`.
- During code review, reject changes that add monolithic page-level data promises for complex pages.
