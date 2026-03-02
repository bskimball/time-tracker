---
title: Manager Guide
description: Daily manager workflows for monitoring, corrections, assignments, and reporting.
---

This guide is for supervisors and operations managers running day-to-day floor execution.

## Manager workspace routes

Primary manager routes:

- `/manager`
- `/manager/monitor`
- `/manager/employees`
- `/manager/employees/new`
- `/manager/employees/:id`
- `/manager/employees/:id/edit`
- `/manager/timesheets`
- `/manager/reports`
- `/manager/schedule`
- `/manager/exceptions`
- `/manager/tasks`

## Daily operating loop

### Start of shift

- Open `/manager/monitor` to confirm active staffing by station.
- Validate assignment coverage in `/manager/tasks`.
- Check exceptions for unresolved carryover events.

### During shift

- Monitor active sessions, station utilization, and live updates.
- Adjust assignments and switch tasks as work demand changes.
- Review timesheet anomalies before they reach payroll.
- Review staffing gaps and exception ownership to keep SLA windows under control.

### End of shift

- Resolve outstanding exceptions.
- Review reports for productivity, tasks, stations, overtime, and summary.
- Confirm schedule readiness for next shift.

## Screen-by-screen walkthrough

### Dashboard (`/manager`)

- KPI cards for active personnel, active alerts, longest shift, and utilization.
- Active Task Sessions table with employee, station, current task, and live duration.
- Quick actions to add employee, open timesheets, manage tasks, and open reports.
- Operational Feed and System Status sidebar cards.
- Snapshot control refreshes data and shows freshness status.

### Floor Monitor (`/manager/monitor`)

- KPI cards for active personnel, station load, break status, and longest shift.
- Station status filters (`ACTIVE`, `BUSY`, `FULL`, `IDLE`, `INACTIVE`).
- Station cards with occupancy bars, station workers, and status lights.
- Personnel manifest showing `WORK`, `BREAK`, and `ASSIGNED` states.

### Employees (`/manager/employees*`)

- Search/filter by text and status with paginated roster.
- Employee list table includes profile, status, station, activity, and `View`/`Edit` actions.
- New employee form (`/manager/employees/new`) captures identity, PIN, status, station, and hour limits.
- Employee detail (`/manager/employees/:id`) includes tabs:
  - `Overview`
  - `Time Logs`
  - `Task History`
  - `Performance`
- Edit employee (`/manager/employees/:id/edit`) reuses the same form with update flow.

### Timesheets (`/manager/timesheets`)

- Three tabs:
  - `Current Time Logs`
  - `Corrections History`
  - `Active Employees`
- Add/Edit correction modal supports employee, type, station, start/end timestamps, reason, and notes.
- Active view separates clocked-in employees from assigned-on-floor employees.
- End-shift actions are available for open time logs.

### Reports (`/manager/reports`)

- Report tabs:
  - `Productivity`
  - `Task Performance`
  - `Station Efficiency`
  - `Overtime Analysis`
  - `Executive Summary`
- Date-range controls are available inline.
- CSV export is available via the `Export CSV` control in the reports UI.

### Schedule (`/manager/schedule`)

- Week/day navigation with selected-day summary.
- Planned vs actual staffing panel with station-level gap severity and recommendations.
- Shift board with station/search filters and grid/list views.
- Coverage heatmap by station/day.
- Active Today panel for currently clocked-in employees.
- Current behavior: several visible action buttons are inert placeholders (for example `Message`, `Reassign`, `Swap`, `Notify`, `Adjust`). Tracked in [Issue #43](https://github.com/bskimball/time-tracker/issues/43).

### Exceptions (`/manager/exceptions`)

- Queue for `MISSING_PUNCH`, `OVERTIME_RISK`, and `STAFFING_GAP`.
- Filters for type, severity, station, ownership, and sort mode.
- SLA badge and due-state labeling per row.
- Quick links route managers directly to related remediation screens.

### Tasks (`/manager/tasks`)

- Summary cards for active tasks, task types, average duration, and completion rate.
- Tabs:
  - `Active Assignments`
  - `Task History`
  - `Task Types`
- Assignment controls for assign, switch, and complete.
- Task type lifecycle for create, edit, and activate/deactivate.
- Assignment source badges distinguish manager-assigned vs self-assigned tasks.

## Operational best practices

- Resolve exceptions daily to reduce payroll correction risk.
- Keep task definitions aligned with station operations.
- Use schedule and monitor views together for staffing decisions.
- Review timesheets and task history before payroll cutoffs.
- Coordinate threshold changes with administrators in [Administrator Guide](/web-app/administrator).
