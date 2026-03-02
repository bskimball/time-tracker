---
title: Navigation and Access
description: Route map, portal structure, and role access guidance for Shift Pulse.
---

This page maps core URLs to user experiences and explains who should use each area.

## Access model

- **Employee workflows** are centered on floor routes and kiosk entry points.
- **Manager workflows** run in the manager portal.
- **Administrator workflows** run in system settings and executive analytics.
- Access is role-based and should be provisioned using least privilege.

## Route map

### Public and sign-in routes

- `/login`: standard sign-in route.
- `/auth/google/start` and `/auth/microsoft/start`: SSO start routes.
- `/auth/google/callback` and `/auth/microsoft/callback`: SSO callback routes.

### Employee and floor routes

- `/floor`: standard floor time clock workflow.
- `/floor/kiosk`: kiosk-optimized touch workflow.
- `/floor/time-clock/mobile`: touch-first mobile time clock route.
- `/time-clock`: compatibility route that renders the floor time-clock experience.
- Current worker-session behavior gaps on `/floor` are tracked in [Issue #44](https://github.com/bskimball/time-tracker/issues/44) and [Issue #45](https://github.com/bskimball/time-tracker/issues/45).

### Manager portal routes

- `/manager`: manager dashboard overview.
- `/manager/monitor`: live floor monitor.
- `/manager/employees`: employee directory and search.
- `/manager/employees/new`: create employee profile.
- `/manager/employees/:id`: employee detail tabs.
- `/manager/employees/:id/edit`: employee profile update form.
- `/manager/timesheets`: logs, active sessions, and correction history.
- `/manager/reports`: reporting tabs and date-range analysis (CSV export control currently not exposed in manager UI).
- `/manager/schedule`: schedule planning and active staffing context.
- `/manager/exceptions`: exception queue and operational follow-up.
- `/manager/tasks`: task types, assignment, switching, and completion.

### Administrator and executive routes

- `/settings`: settings portal overview and admin navigation hub.
- `/settings/stations`: station lifecycle and configuration.
- `/settings/employees`: employee records and PIN management.
- `/settings/users`: role assignment and user access.
- `/settings/api-keys`: API key generation and revocation.
- `/settings/operational-config`: KPI thresholds and business constants.
- `/executive`: executive KPI dashboard.
- `/executive/analytics`: deep analytics by section and time range.

Settings route details are documented in [Settings Guide](/web-app/settings).

Executive analysis details are documented in [Executive Guide](/web-app/executive).

## Permissions guidance

- Reserve administrator access for system owners and finance/ops leads.
- Assign manager access to shift supervisors and floor leads.
- Keep floor endpoints available where employee clock activity occurs.
- Revisit role assignments periodically in [Administrator Guide](/web-app/administrator).
