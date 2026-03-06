---
title: Operational Config Reference
description: Field-by-field reference for operational configuration keys used by Shift Pulse dashboards and task-policy behavior.
---

This page reflects the current operational configuration definitions seeded by the application.

## Overview

Operational configuration values are stored in the `operational_config` table and surfaced in `/settings/operational-config`.

Current write access is restricted to:

- `ADMIN`
- `EXECUTIVE`

## Config keys

| Key | Type | Default | Allowed range or values | Unit | Used for |
| --- | --- | --- | --- | --- | --- |
| `LABOR_HOURLY_RATE` | Number | `24` | `0` to `200` | `USD/hour` | Labor cost calculations |
| `OVERTIME_MULTIPLIER` | Number | `1.5` | `1` to `5` | `x` | Overtime cost calculations |
| `BUDGETED_HOURS_PER_DAY` | Number | `64` | `0` to `20000` | `hours/day` | Budget variance calculations |
| `DEFAULT_STATION_CAPACITY_FALLBACK` | Number | `6` | `1` to `500` | `workers/station` | Capacity fallback when station capacity is unset |
| `OPTIMAL_UTILIZATION_PERCENT` | Number | `82` | `1` to `100` | `%` | Capacity planning benchmarks |
| `TASK_ASSIGNMENT_MODE` | Enum | `MANAGER_ONLY` | `MANAGER_ONLY`, `SELF_ASSIGN_ALLOWED`, `SELF_ASSIGN_REQUIRED` | `mode` | Worker self-task assignment policy |
| `KPI_PRODUCTIVITY_HIGH_THRESHOLD` | Number | `30` | `0` to `1000` | `units/hour` | Executive productivity severity |
| `KPI_PRODUCTIVITY_MEDIUM_THRESHOLD` | Number | `24` | `0` to `1000` | `units/hour` | Executive productivity severity |
| `KPI_OVERTIME_HIGH_THRESHOLD` | Number | `12` | `0` to `100` | `%` | Executive overtime severity |
| `KPI_OVERTIME_MEDIUM_THRESHOLD` | Number | `6` | `0` to `100` | `%` | Executive overtime severity |
| `KPI_OCCUPANCY_HIGH_THRESHOLD` | Number | `90` | `0` to `100` | `%` | Executive occupancy severity |
| `KPI_OCCUPANCY_MEDIUM_THRESHOLD` | Number | `75` | `0` to `100` | `%` | Executive occupancy severity |
| `KPI_VARIANCE_HIGH_THRESHOLD` | Number | `8` | `0` to `100` | `%` | Executive cost variance severity |
| `KPI_VARIANCE_MEDIUM_THRESHOLD` | Number | `3` | `0` to `100` | `%` | Executive cost variance severity |

## Task assignment mode values

### `MANAGER_ONLY`

- Workers cannot self-assign tasks.
- Manager/admin/executive assignment flow remains authoritative.

### `SELF_ASSIGN_ALLOWED`

- Workers can self-manage tasks after clock-in.
- Manager-side assignment remains available.

### `SELF_ASSIGN_REQUIRED`

- Workers can self-manage tasks and are expected to keep one active while clocked in.

## Update behavior

- Unknown keys are rejected.
- Numeric values are validated against min/max limits.
- Enum values must match the supported option list exactly.
- Seed logic creates missing config rows automatically.

## Operator note

Several defaults include one-time legacy-to-current upgrades in seed logic. Existing environments may therefore carry older values until the app applies those migrations or an operator updates them explicitly.

## Related docs

- [Settings Guide](/web-app/settings)
- [Roles and Permissions](/reference/roles-and-permissions)
- [Administrator Guide](/web-app/administrator)
