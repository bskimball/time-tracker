# Web App Release Notes

## 2026-02-11 - Worker self-assignment rollout (Phase 4 docs)

### What shipped

- Added `TASK_ASSIGNMENT_MODE` operational config with three supported modes: `MANAGER_ONLY`, `SELF_ASSIGN_ALLOWED`, and `SELF_ASSIGN_REQUIRED`.
- Enabled worker self-task actions (start, switch, end) when mode allows it.
- Persisted task assignment source metadata with `TaskAssignment.source` (`MANAGER` or `WORKER`) and `assignedByUserId` for manager-originated assignments.
- Updated manager-facing visibility surfaces to include assignment source labeling and floor-active worker behavior.

### Operator behavior reference

- `MANAGER_ONLY`: workers cannot self-assign tasks; manager/admin assignment flow remains authoritative.
- `SELF_ASSIGN_ALLOWED`: workers can self-manage task assignment after clock-in; manager/admin assignment flow remains available.
- `SELF_ASSIGN_REQUIRED`: workers can self-manage tasks and are prompted to start a task when clocked in without one.

### Assignment source semantics

- Manager/admin assignment writes `source = MANAGER` and sets `assignedByUserId`.
- Worker self-assignment writes `source = WORKER` and leaves `assignedByUserId` empty.
- Manager task and timesheet views should treat `source = WORKER` as self-assigned activity.

### Terminology

- **Clocked-in**: employee has an active `WORK` time log.
- **Floor-active**: employee is clocked-in, has an active task assignment, or both.

### Verification expectations

- Validate all three `TASK_ASSIGNMENT_MODE` values in `/settings/operational-config`.
- In `MANAGER_ONLY`, confirm worker self-task actions return policy-denied behavior.
- In `SELF_ASSIGN_ALLOWED` and `SELF_ASSIGN_REQUIRED`, confirm worker start/switch/end task actions succeed only when clocked in.
- Confirm manager views (`/manager/tasks`, `/manager/timesheets`, `/manager/monitor`) display floor-active workers and source-aware task context.
