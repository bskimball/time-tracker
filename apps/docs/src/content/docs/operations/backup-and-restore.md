---
title: Backup and Restore
description: How to back up and validate recovery for a Shift Pulse environment.
---

Use this guide to define and exercise a backup and restore procedure for Shift Pulse.

## Goal

Protect the PostgreSQL data used by:

- Employees and user mappings
- Sessions and OAuth account links
- Time logs and task assignments
- Analytics and operational configuration data

## What to back up

- PostgreSQL database contents
- Runtime secret inventory, including `TIME_CLOCK_API_KEY` and OAuth credentials
- Deployment metadata needed to recreate the application version and environment settings

Do not rely on application containers alone as your recovery plan.

## Minimum backup policy

- Run database backups on a scheduled cadence
- Encrypt backups at rest
- Store backups separately from the primary runtime environment
- Retain enough history to cover operator error and delayed issue discovery
- Restrict backup access to the same or stronger level as production admin access

## Backup procedure

1. Confirm production database connectivity and available storage at the backup target.
2. Record the current application version and deploy timestamp.
3. Run a PostgreSQL backup using your platform-standard tooling.
4. Verify the backup artifact was created successfully.
5. Record backup metadata: timestamp, database name, operator, retention class, and storage location.

## Restore validation procedure

Run restore drills in a non-production environment.

1. Provision a fresh PostgreSQL instance or restore target database.
2. Restore the selected backup.
3. Start the application with a non-production `DATABASE_URL`.
4. Verify `/login` loads.
5. Verify `/api/health` returns success.
6. Sign in with a known admin account.
7. Check representative records in `/settings`, `/manager/timesheets`, and `/manager/tasks`.
8. Verify operational config values in `/settings/operational-config`.

## Recovery checks

After restore, confirm:

- Users and roles are intact
- Employee records and PIN-backed workflows behave as expected
- Time logs and active-task history are present
- Operational-config values match expected thresholds
- API access works with the intended restored or rotated secret set

## Incident use

Use restore only when:

- Primary data is corrupted
- Required records were deleted beyond app-level correction flows
- Infrastructure failure makes the primary database unavailable

If an incident includes credential exposure, rotate secrets after restore even if the restored data appears healthy.

## What this guide does not prescribe

This project does not currently ship a product-specific backup utility or managed restore CLI. Use your organization’s PostgreSQL backup standard and validate it against Shift Pulse smoke tests.

## Related docs

- [On-Prem Operations Handbook](/operations/on-prem-operations)
- [Release Validation](/operations/release-validation)
- [Operational Config Reference](/reference/operational-config-reference)
