---
title: Roles and Permissions
description: Reference matrix for user roles, route access, and sensitive actions in Shift Pulse.
---

This page reflects current route and action behavior in the application code.

## Roles

- `WORKER`
- `MANAGER`
- `EXECUTIVE`
- `ADMIN`

## Route access matrix

| Surface | WORKER | MANAGER | EXECUTIVE | ADMIN |
| --- | --- | --- | --- | --- |
| `/floor`, `/floor/kiosk`, `/floor/time-clock/mobile` | Yes | Redirected away when authenticated | Redirected away when authenticated | Redirected away when authenticated |
| `/manager/*` | No | Yes | Redirected to `/executive` | Redirected to `/executive` at the top-level router, even though some manager layout components also allow admin |
| `/executive/*` | No | No | No | Yes |
| `/settings/*` | Requires authentication; page-level actions vary by feature | Requires authentication; page-level actions vary by feature | Requires authentication; page-level actions vary by feature | Requires authentication; page-level actions vary by feature |
| `/todo` | Requires authentication | Requires authentication | Requires authentication | Requires authentication |
| `/api/realtime/manager-stream` | No | Yes | No | Yes |

## Important current behavior

- `EXECUTIVE` users are redirected to `/executive` as their default home, but the `/executive/*` route itself currently requires `ADMIN`.
- `MANAGER` users can access manager routes.
- `ADMIN` users are routed toward the executive area by default and are blocked from top-level `/floor/*` access.
- Floor routes remain available for unauthenticated worker-style/PIN flows.

## Sensitive action matrix

| Action | WORKER | MANAGER | EXECUTIVE | ADMIN |
| --- | --- | --- | --- | --- |
| View settings pages | Auth required; access depends on route navigation | Auth required | Auth required | Auth required |
| Create or update users and roles in `/settings/users` | No | No | Yes | Yes |
| Update operational config | No | No | Yes | Yes |
| Generate personal app API keys in `/settings/api-keys` | Any authenticated user | Any authenticated user | Any authenticated user | Any authenticated user |
| Use protected REST API with `x-api-key` | Not role-based | Not role-based | Not role-based | Not role-based |
| Access realtime manager stream | No | Yes | No | Yes |
| Manage manager task assignments | No | Yes | Yes | Yes |
| Worker self-assign tasks | Only when task-assignment mode allows it and the user is linked to a worker identity | No | No | No |

## Worker task-assignment policy

Worker self-task behavior is controlled by `TASK_ASSIGNMENT_MODE`.

| Mode | Worker behavior |
| --- | --- |
| `MANAGER_ONLY` | Workers cannot self-assign tasks |
| `SELF_ASSIGN_ALLOWED` | Workers can start, switch, and end their own task assignments while clocked in |
| `SELF_ASSIGN_REQUIRED` | Workers must maintain an active task while clocked in |

Manager-side task assignment permissions currently include:

- `MANAGER`
- `EXECUTIVE`
- `ADMIN`

## Recommendation

Because `EXECUTIVE` route access and `EXECUTIVE` config permissions are currently split, treat this role as a special-case permission set and verify expected behavior in staging before assigning it broadly.

## Related docs

- [Authentication and Access Setup](/operations/authentication-and-access-setup)
- [Navigation and Access](/web-app/navigation-and-access)
- [Operational Config Reference](/reference/operational-config-reference)
