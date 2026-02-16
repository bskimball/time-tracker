---
title: Endpoint Reference
description: Customer-facing endpoint inventory for the Time Tracker API.
---

All endpoints below are under `/api`.

## System

- `GET /health` - service health check (`{ status: "ok" }`).

## Employees

- `GET /employees` - list employees.
- `GET /employees/{id}` - get employee by ID.

## Stations

- `GET /stations` - list stations.

## Time Logs

- `GET /time-logs` - list logs with optional filters:
  - `employeeId`
  - `stationId`
  - `startDate`
  - `endDate`

## Users

- `GET /users` - list users and roles.

## Task Types

- `GET /task-types`
- `GET /task-types/{id}`
- `POST /task-types`
- `PATCH /task-types/{id}`
- `DELETE /task-types/{id}`

## Task Assignments

- `GET /task-assignments`
- `GET /task-assignments/{id}`
- `POST /task-assignments`
- `PATCH /task-assignments/{id}`
- `DELETE /task-assignments/{id}`

Supported query filters on list endpoint:

- `employeeId`
- `taskTypeId`
- `active=true|false`

## Performance Metrics

- `GET /performance-metrics`
- `GET /performance-metrics/{id}`
- `GET /performance-metrics/employee/{employeeId}/summary`
- `POST /performance-metrics`
- `PATCH /performance-metrics/{id}`
- `DELETE /performance-metrics/{id}`

Common query filters:

- `employeeId`
- `stationId`
- `startDate`
- `endDate`
- `limit` (max 100)

## Todos (operational utility)

- `GET /todos`
- `POST /todos`
- `PATCH /todos/{id}`
- `DELETE /todos/{id}`

## Realtime

- `GET /realtime/manager-stream` - SSE feed for live manager experiences.

See [Realtime Streaming](/api/realtime-streaming) for connection behavior.

## Not currently available

- `/api/time-clock` route exists but is currently not implemented for public REST clock actions.

## Explore in OpenAPI UI

- OpenAPI spec: `/api/doc`
- Swagger UI: `/api/ui`
