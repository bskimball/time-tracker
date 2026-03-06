---
title: Authentication and Access Setup
description: Set up user access, API authentication, roles, and credential rotation for Shift Pulse.
---

Use this guide when you are preparing a new environment, onboarding administrators, or reviewing access controls.

## Authentication surfaces

Shift Pulse currently uses more than one authentication path:

- **Web sign-in**: user sessions through `/login`
- **SSO entry points**: `/auth/google/start` and `/auth/microsoft/start`
- **REST API authentication**: `x-api-key` header validated against `TIME_CLOCK_API_KEY`
- **Realtime manager stream**: signed-in user session with manager or admin authorization

These surfaces are related, but they are not interchangeable.

## Bootstrap order

Follow this order in a new environment.

1. Establish the database and application environment variables.
2. Confirm `/login` loads.
3. Create or recover the first administrator account.
4. Verify administrator access to `/settings`.
5. Create user accounts and assign least-privilege roles.
6. Configure API consumers with `TIME_CLOCK_API_KEY`.
7. Enable and test SSO only after baseline sign-in is working.

## Role model

Current role options exposed in the product are:

- `WORKER`
- `MANAGER`
- `EXECUTIVE`
- `ADMIN`

Recommended assignment pattern:

- `WORKER`: floor-only activity where possible
- `MANAGER`: shift supervision and operational corrections
- `EXECUTIVE`: KPI and analytics review with limited config authority where approved
- `ADMIN`: system ownership, user administration, and sensitive configuration

## First administrator

This docs site does not yet define an automated bootstrap flow for the first admin user.

Until a dedicated bootstrap procedure exists, maintain an internal runbook that answers:

- How the first user record is created in your environment
- Who approves admin access
- How emergency access is recovered if all admins are locked out

If you do not have that runbook, create one before go-live.

## User and role administration

After first login:

1. Open `/settings/users`.
2. Create named user accounts for each operator.
3. Assign the minimum required role.
4. Remove stale access promptly when staffing changes.

Do not share admin accounts. Shared accounts make incident review and access audits materially harder.

## Employee access versus user access

Keep these distinct:

- **Employees** in `/settings/employees` support floor workflows such as PIN-based clock actions.
- **Users** in `/settings/users` control authenticated portal access and role-based navigation.

An employee record alone does not imply manager or admin portal access.

## SSO planning

Shift Pulse exposes Google and Microsoft auth routes, but successful rollout depends on your provider configuration.

Before enabling SSO:

- Confirm redirect URIs for your deployed hostname
- Store provider secrets in your secret manager
- Test sign-in and callback behavior in a non-production environment
- Keep a break-glass non-SSO administrator path until SSO is proven stable

## API authentication setup

REST API requests use:

- Header: `x-api-key`
- Validation source: `TIME_CLOCK_API_KEY`

Example:

```bash
curl -H "x-api-key: YOUR_API_KEY" https://your-domain.example/api/employees
```

Important boundary:

- `/settings/api-keys` is an application key-management surface
- `/api/*` middleware currently validates against the server-side `TIME_CLOCK_API_KEY` value

Treat these as separate controls unless and until the product behavior changes.

## Credential rotation

### API key rotation

1. Generate and distribute the replacement secret through your secret manager.
2. Update `TIME_CLOCK_API_KEY` in the runtime environment.
3. Restart or redeploy the application so all instances load the new key.
4. Re-test `/api/doc` and one protected API route.
5. Remove the old key from clients and stored secrets.

### User access review

Run access review on a fixed cadence:

- Weekly for active admin and manager users
- Monthly for all portal users
- Immediately after role changes, departures, or incidents

## Realtime authorization checks

The manager SSE stream at `/api/realtime/manager-stream` is not API-key authenticated.

It requires:

- A valid signed-in user session
- A role with manager or admin access

Use this distinction during incident triage. A working API key does not prove realtime access is configured correctly.

## Lockout and recovery planning

Before production launch, document:

- Who can approve emergency admin recovery
- How a disabled SSO integration affects sign-in
- How to restore API access after an incorrect key rotation
- Which logs and timestamps must be captured during auth incidents

## Related docs

- [Navigation and Access](/web-app/navigation-and-access)
- [Administrator Guide](/web-app/administrator)
- [Settings Guide](/web-app/settings)
- [API Authentication](/api/authentication)
- [On-Prem Operations Handbook](/operations/on-prem-operations)
