---
title: Roles and Permissions
description: Reference matrix for user roles, route access, and sensitive actions in Shift Pulse.
---

This page reflects current route and action behavior in the application code.

## Roles

- `MANAGER`
- `EXECUTIVE`
- `ADMIN`

`WORKER` still exists in the application model for employee-linked floor sessions, but it is no longer a role administrators create or assign from `/settings/users`.

## Route access matrix

| Surface                                              | Manager                            | Executive                          | Admin                                                                                                           |
| ---------------------------------------------------- | ---------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/floor`, `/floor/kiosk`, `/floor/time-clock/mobile` | Redirected away when authenticated | Redirected away when authenticated | Redirected away when authenticated                                                                              |
| `/manager/*`                                         | Yes                                | Redirected to `/executive`         | Redirected to `/executive` at the top-level router, even though some manager layout components also allow admin |
| `/executive/*`                                       | No                                 | Yes                                | Yes                                                                                                             |
| `/settings/*`                                        | No                                 | No                                 | Yes                                                                                                             |
| `/todo`                                              | Requires authentication            | Requires authentication            | Requires authentication                                                                                         |
| `/api/realtime/manager-stream`                       | Yes                                | No                                 | Yes                                                                                                             |

## Important current behavior

- `EXECUTIVE` users are routed to `/executive` as their default home and can access executive routes.
- `ADMIN` users own `/settings/*` and are also routed toward the executive area by default.
- `MANAGER` users can access manager routes but not `/settings/*`.
- Floor routes remain available for unauthenticated employee code + PIN clock flows.

## Sensitive action matrix

| Action                                                 | Manager        | Executive      | Admin          |
| ------------------------------------------------------ | -------------- | -------------- | -------------- |
| View settings pages                                    | No             | No             | Yes            |
| Create, update, or delete users in `/settings/users`   | No             | No             | Yes            |
| Update operational config                              | No             | No             | Yes            |
| Generate personal app API keys in `/settings/api-keys` | No             | No             | Yes            |
| Use protected REST API with `x-api-key`                | Not role-based | Not role-based | Not role-based |
| Access realtime manager stream                         | Yes            | No             | Yes            |
| Manage manager task assignments                        | Yes            | Yes            | Yes            |

## Employee-linked worker behavior

Some authenticated floor sessions still operate through a user account linked to an employee record. That employee-linked worker behavior is controlled by `TASK_ASSIGNMENT_MODE`.

| Mode                   | Worker behavior                                                                |
| ---------------------- | ------------------------------------------------------------------------------ |
| `MANAGER_ONLY`         | Workers cannot self-assign tasks                                               |
| `SELF_ASSIGN_ALLOWED`  | Workers can start, switch, and end their own task assignments while clocked in |
| `SELF_ASSIGN_REQUIRED` | Workers must maintain an active task while clocked in                          |

Manager-side task assignment permissions currently include:

- `MANAGER`
- `EXECUTIVE`
- `ADMIN`

## Recommendation

Treat `EXECUTIVE` as a reporting and analytics role, not a settings/configuration role. Use `ADMIN` for system ownership and access control changes.

## Related docs

- [Authentication and Access Setup](/operations/authentication-and-access-setup)
- [Navigation and Access](/web-app/navigation-and-access)
- [Operational Config Reference](/reference/operational-config-reference)
