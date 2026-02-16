---
title: Manager Guide
description: Daily manager workflows for monitoring, corrections, assignments, and reporting.
---

This guide is for supervisors and operations managers running day-to-day floor execution.

## Manager workspace

Primary manager routes:

- `/manager`
- `/manager/monitor`
- `/manager/employees`
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

### End of shift

- Resolve outstanding exceptions.
- Export and review reports for productivity, tasks, stations, overtime, and summary.
- Confirm schedule readiness for next shift.

## Key feature areas

### Floor Monitor (`/manager/monitor`)

- Live visibility into active logs and station placement.
- Task context per employee for in-progress work.

### Timesheets (`/manager/timesheets`)

- View logs, active sessions, and correction history.
- Edit or delete problematic logs when policy allows.
- Track assignment source and clock method metadata.

### Tasks (`/manager/tasks`)

- Create and manage task types.
- Assign tasks manually and complete/switch active work.
- Review task history with a rolling time window.

### Reports (`/manager/reports`)

- Generate productivity, task, station, overtime, and summary reports.
- Export CSV for downstream analysis.

## Operational best practices

- Resolve exceptions daily to reduce payroll correction risk.
- Keep task definitions aligned with station operations.
- Use schedule and monitor views together for staffing decisions.
- Coordinate threshold changes with administrators in [Administrator Guide](/web-app/administrator).
