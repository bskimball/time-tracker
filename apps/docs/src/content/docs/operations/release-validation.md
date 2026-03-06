---
title: Release Validation
description: How to validate a Shift Pulse release before and after deployment.
---

Use this guide during staging validation, production rollout, and rollback readiness checks.

## Goal

Catch regressions in:

- Sign-in and route authorization
- Floor workflows
- Manager workflows and realtime updates
- Settings and operational configuration
- Protected API access

## Before deployment

1. Review [Release Notes](/reference/release-notes) and internal engineering notes.
2. Confirm the target environment variables and secrets are present.
3. Confirm database schema changes are understood and scheduled.
4. Prepare a rollback artifact and a backup of the database.

## Staging validation checklist

### Auth and routing

- `/login` loads
- Admin sign-in succeeds
- Manager sign-in succeeds
- Worker floor access behaves as expected
- `ADMIN` can access `/executive`
- `EXECUTIVE` behavior is verified explicitly, since this role currently differs from `ADMIN` in route access

### Floor workflows

- `/floor` loads on desktop
- `/floor/kiosk` loads on kiosk hardware or emulated touch environment
- `/floor/time-clock/mobile` works on a mobile device or emulator
- Clock in/out works
- Break start/end works
- Task controls match the configured `TASK_ASSIGNMENT_MODE`

### Manager workflows

- `/manager` loads for manager users
- `/manager/monitor` connects and shows live state
- `/manager/timesheets` loads and filtering works
- `/manager/tasks` supports assignment workflows
- `/manager/reports` and `/manager/schedule` load

### Admin and config

- `/settings` loads
- `/settings/users` supports expected role management
- `/settings/api-keys` loads
- `/settings/operational-config` loads current values
- Config updates validate correctly for one numeric key and `TASK_ASSIGNMENT_MODE`

### API

- `GET /api/health` returns success
- `GET /api/doc` succeeds with `x-api-key`
- One representative protected endpoint succeeds with `x-api-key`
- `/api/realtime/manager-stream` works for a signed-in manager or admin session

## Production smoke test

After deploy:

1. Verify `/login`.
2. Verify `/api/health`.
3. Verify one admin session and one manager session.
4. Verify `/manager/monitor` reconnects normally.
5. Verify one protected REST request with `x-api-key`.
6. Verify no immediate auth or database errors in logs.

## Rollback triggers

Consider rollback when:

- Sign-in fails for known-good accounts
- `/manager/monitor` or realtime routing is broadly unstable
- Protected API routes return unexpected authorization failures
- Operational-config updates or key settings pages fail after deployment

## Evidence to capture

- Environment name and release identifier
- Timestamp of validation
- Role used for each check
- Failed route or endpoint
- Relevant log excerpts and request identifiers

## Related docs

- [On-Prem Operations Handbook](/operations/on-prem-operations)
- [Backup and Restore](/operations/backup-and-restore)
- [Roles and Permissions](/reference/roles-and-permissions)
