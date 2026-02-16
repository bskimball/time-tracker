---
title: Troubleshooting
description: Common issues and practical fixes for employee, manager, and administrator workflows.
---

Use this page for quick triage before escalating to engineering support.

## Employee issues

### PIN does not work

- Confirm the PIN is 4-6 digits.
- Confirm the employee record has a PIN set in `/settings/employees`.
- If using kiosk mode, verify the selected station or retry with "Use last station".

### Clock action does not complete

- Check network connectivity on the device.
- If offline queue is enabled, sync pending actions when back online.
- Confirm the device API key is present and current if kiosk sync is configured.

### Cannot start or switch tasks

- Check current task mode in `/settings/operational-config`.
- In `MANAGER_ONLY`, self-assignment controls are intentionally unavailable.
- In `SELF_ASSIGN_REQUIRED`, a task must be active while clocked in.

## Manager issues

### Floor monitor appears stale

- Verify manager session is active and has permission.
- Check realtime indicator state and reconnect behavior.
- Reload `/manager/monitor` to rehydrate active logs and task state.

### Missing or incorrect timesheet entries

- Open `/manager/timesheets` and review logs, active, and corrections tabs.
- Filter by employee, station, and date range to isolate the issue.
- Apply edits or corrective actions and re-check exception queues.

### Reports export fails

- Confirm valid date range and report type.
- Ensure start date is not later than end date.
- Retry after reducing range if data window is unusually large.

## Administrator issues

### API requests return 401 Unauthorized

- Confirm `x-api-key` header is set on every request.
- Confirm the integration key matches the current active value.
- If exposure or mismatch is suspected, rotate `TIME_CLOCK_API_KEY` in the server environment and redeploy.

### `/api/doc` or `/api/ui` not accessible

- These routes are API-key protected in this environment.
- Send `x-api-key` for spec and Swagger access.
- Validate service health first at `/api/health`.

### Operational config update rejected

- Confirm user role is `ADMIN` or `EXECUTIVE` for updates.
- Ensure value type and range match the field validation.
- For enum values, use one of the allowed options exactly.

## Known limitation

- `/api/time-clock` exists as a placeholder and is not currently implemented for public clock actions.

## When to escalate

- Repeated data integrity issues after corrections.
- Realtime stream instability across multiple manager sessions.
- Authentication failures after environment key rotation and access revalidation.

Include route, user role, timestamp, and request details when escalating.
