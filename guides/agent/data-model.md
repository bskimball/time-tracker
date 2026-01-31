# Data Model (Agent Guide)

Use this when you’re changing database schema, writing Prisma queries, or adding new reporting.

## Core entities (conceptual)

- **User**: authenticated user identity, role-based access (e.g., ADMIN / MANAGER / WORKER)
- **Employee**: warehouse worker record (name/email/PIN), status, assignments
- **Station**: physical or logical work station (name/type/zone/capacity)
- **TimeLog**: work sessions + breaks (start/end, employee, station)
- **TaskAssignment / TaskType**: task tracking and productivity metrics

## Relationships (high level)

- A `User` may be linked to an `Employee`.
- An `Employee` has many `TimeLog` records.
- A `Station` has many `TimeLog` records.

## Notes

- Keep schema changes and query changes close to the feature they support.
- Prefer adding tests around new business logic rather than relying on UI behavior.
