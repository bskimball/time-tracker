# Operations Onboarding Playbook

Suggested metadata for future docs site:

```yaml
title: Operations Onboarding Playbook
description: Employee and manager operating flows for floor execution, shift control, and troubleshooting.
audience: [employee, manager, admin]
product_area: time-tracking
status: active
last_reviewed: 2026-02-15
```

## 0. How to use this guide {#how-to-use}

This single document is intentionally structured as a future multi-page docs section. Each top-level section has a stable ID and can be split into standalone pages without rewriting core content.

## 1. Employee day-in-the-life flow {#employee-day-in-the-life}

### 1.1 Start of shift

1. Open `/floor` (or `/floor/time-clock/mobile` on mobile devices).
2. Clock in by PIN or employee + station selection.
3. Confirm success toast/alert before leaving the screen.

### 1.2 During shift

1. Use active session controls to start/end breaks.
2. If task controls are enabled, start or switch tasks as work changes.
3. If mode is `SELF_ASSIGN_REQUIRED`, resolve any "task required" warning immediately.

### 1.3 End of shift

1. End break if currently on break.
2. End active task if applicable.
3. Clock out and verify confirmation.

### 1.4 Mobile-specific notes

- Mobile task controls are intentionally progressive: tap **Manage** per employee session to reveal task action controls.
- Offline mode queues actions locally; operators should sync queued actions when connectivity returns.

## 2. Manager shift-control loop {#manager-shift-control-loop}

### 2.1 Open shift check

1. Start at `/manager/dashboard` for snapshot, alerts, utilization, and active sessions.
2. Confirm data freshness panel (manual refresh or optional auto-refresh).
3. Jump to `/manager/monitor` for station-level floor state.

### 2.2 Mid-shift control cycle

1. Use `/manager/tasks` to assign/switch/complete active work.
2. Filter assignment list by source (all, manager-assigned, self-assigned) when triaging high volume.
3. Use task type controls to edit definitions and deactivate/reactivate stale or seasonal task types.

### 2.3 Close shift

1. Validate breaks and clock-outs in monitor/dashboard views.
2. Review timesheets for exceptions and corrections.
3. Confirm no blocked deactivations or unresolved critical alerts.

## 3. Role permissions and assignment mode semantics {#permissions-and-modes}

### 3.1 Role model

- `WORKER`: uses floor tools and may self-assign tasks depending on mode.
- `MANAGER`: controls assignments, monitors floor, resolves shift exceptions.
- `ADMIN` / `EXECUTIVE`: executive/settings/reporting scope. Direct manager/floor routes are restricted by default for least-privilege separation.

### 3.2 Task assignment mode semantics (`TASK_ASSIGNMENT_MODE`)

- `MANAGER_ONLY`: worker task controls are hidden/blocked; manager assignment is required.
- `SELF_ASSIGN_ALLOWED`: workers can start/switch/end tasks while clocked in.
- `SELF_ASSIGN_REQUIRED`: same as allowed, and workers are warned when clocked in without an active task.

### 3.3 Assignment source semantics

- Manager-created assignments are stored as `source = MANAGER`.
- Worker self-assigned entries are stored as `source = WORKER`.
- Manager screens should treat source as a first-class signal for triage and accountability.

## 4. Troubleshooting and failure modes {#troubleshooting}

### 4.1 Data appears stale

- Check snapshot/freshness panel first.
- Use manual refresh when state is stale.
- If stale state repeats, verify network connectivity and browser tab visibility behavior.

### 4.2 Cannot deactivate a task type

- Cause: there are active assignments using that task type.
- Action: complete or switch active assignments, then retry deactivation.

### 4.3 Worker cannot self-assign task

- Confirm current assignment mode is not `MANAGER_ONLY`.
- Confirm worker account is linked to an employee record.
- Confirm worker is clocked in (for expected in-shift task operations).

### 4.4 Offline queue grows on floor/mobile

- Keep operating; actions are queued.
- Trigger sync when online status recovers.
- Escalate if queue does not drain after reconnect and retry.

### 4.5 Session control mismatch (break/task/clock state out of sync)

- Refresh once from manager and floor views.
- Validate source of truth in manager monitor.
- If mismatch persists, perform manual correction in manager timesheets workflow.

## 5. Future Docs Site IA {#future-docs-site-ia}

Proposed page split and slugs:

1. `/operations/onboarding-overview`
   - Scope, personas, and navigation map.
2. `/operations/employee/day-in-the-life`
   - Shift start/during/end flow for floor and mobile.
3. `/operations/manager/shift-control-loop`
   - Dashboard -> monitor -> tasks -> timesheets control loop.
4. `/operations/permissions/task-assignment-modes`
   - Roles, mode semantics, assignment source rules.
5. `/operations/troubleshooting/common-failures`
   - Stale data, deactivation blocks, offline queue, correction playbooks.

## 6. Suggested migration notes for docs platform {#migration-notes}

- Preserve section IDs to avoid link rot during split.
- Promote each H2 section into a page body; move H3 blocks into page-local tabs/callouts.
- Keep mode semantics in a single canonical page and reference from employee/manager guides.
