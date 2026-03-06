---
title: On-Prem Operations Handbook
description: Deploy, validate, and maintain a Shift Pulse environment in your own infrastructure.
---

Use this guide when you are running Shift Pulse inside your own network and infrastructure.

## What this guide covers

- Initial environment requirements
- Local and production-oriented startup paths
- Post-deploy validation
- Upgrade, rollback, and backup considerations
- Health and incident checks

## Core architecture

Shift Pulse has three main operational layers:

- **Web/API application**: the `apps/web` workspace serves the user interface, REST API, and realtime SSE endpoints.
- **Database**: PostgreSQL stores employees, time logs, tasks, sessions, analytics data, and configuration records.
- **Documentation and support surfaces**: `/api/health`, `/api/doc`, `/api/ui`, and the docs site support verification and integration work.

## Minimum requirements

- Node.js `>=22.6.0`
- PostgreSQL
- TLS termination in front of the application
- Secret storage for application environment variables and API keys

## Deployment paths

### Docker Compose path

Use Docker Compose for local parity and smaller on-prem installations.

Development-oriented stack:

```bash
docker compose --profile dev up
```

Production-oriented app stack:

```bash
docker compose --profile prod up
```

Current Compose behavior includes:

- A `postgres:16-alpine` database container
- A development app container that runs `npm install`
- Automatic Prisma schema push during dev startup
- A production app image built from `apps/web/Dockerfile`

### Direct workspace path

Use this path when your platform team manages process supervision outside Docker.

Install dependencies from the repo root:

```bash
npm install
```

Build the application:

```bash
cd apps/web
npm run build
```

Start the production server:

```bash
cd apps/web
npm run start
```

## Environment planning

At minimum, document and manage:

- `DATABASE_URL`
- `NODE_ENV`
- `TIME_CLOCK_API_KEY`
- OAuth or SSO provider secrets if Google or Microsoft sign-in is enabled
- Logging-related variables such as `LOG_LEVEL` and `LOG_DB_QUERIES` when structured logging is in use

Keep these values in a secret manager. Do not store them in client code or ad hoc shell history.

## Database lifecycle

The application uses Prisma with a PostgreSQL datasource.

Operational implications:

- Schema changes must be applied before or during deploy in a controlled way.
- Development Docker startup currently runs `npx prisma db push --schema prisma/schema.prisma`.
- Seed data support exists through the web workspace script:

```bash
cd apps/web
npm run db:seed
```

Before running seed logic in shared environments, confirm that the seed behavior matches your tenant and data-retention expectations.

## First deployment checklist

1. Provision PostgreSQL and confirm network connectivity from the app runtime.
2. Set required environment variables and secrets.
3. Build and start the web application.
4. Verify the sign-in route at `/login`.
5. Verify API health at `/api/health`.
6. Fetch `/api/doc` with a valid `x-api-key`.
7. Sign in as an administrator and verify `/settings`, `/manager`, and `/executive` access paths.
8. Run a floor workflow check on `/floor` or `/floor/kiosk`.

## Post-deploy health verification

Use this short smoke test after deploys, secret rotation, or infrastructure changes.

### Web and auth

- `/login` loads successfully
- An administrator can sign in
- A manager can access `/manager/monitor`
- A floor device can reach `/floor` or `/floor/kiosk`

### API

- `GET /api/health` returns success
- `GET /api/doc` succeeds with `x-api-key`
- `GET /api/ui` loads in environments where Swagger access is expected

### Realtime

- A signed-in manager can open `/manager/monitor`
- Live indicators connect without repeated disconnect loops

## Upgrade workflow

Use a repeatable release checklist for every application update.

1. Review customer-facing [Release Notes](/reference/release-notes) and any internal engineering change notes.
2. Back up the database.
3. Apply schema changes required by the new release.
4. Build the new app version in a staging environment.
5. Run the post-deploy health verification checklist.
6. Promote to production during a defined maintenance window.

## Rollback planning

Prepare rollback before every production change.

- Keep the previous deployable artifact or container image available.
- Confirm whether a schema change is backward compatible before rollback.
- If the new version rotated keys or changed auth configuration, restore the prior secret set as part of rollback.
- Re-run the health verification checklist after rollback.

## Backup and restore expectations

This docs site does not yet define a product-specific backup toolchain. At minimum:

- Back up PostgreSQL on a scheduled cadence.
- Test restore into a non-production environment.
- Record expected recovery point objective and recovery time objective.
- Protect backups with the same access controls used for production credentials.

## Incident triage

Start with these checks:

- Verify app process status and recent deploy history.
- Check application logs for authentication failures, database errors, or repeated SSE reconnects.
- Confirm database connectivity.
- Confirm current `TIME_CLOCK_API_KEY` value matches integration clients.
- Use [Troubleshooting](/web-app/troubleshooting) for role-specific user issues.

## Known current boundaries

- `/api/time-clock` exists as a route but is not currently a supported public REST clock-action surface.
- `/settings/api-keys` does not currently control `/api/*` authentication directly; API auth uses `TIME_CLOCK_API_KEY`.

## Related docs

- [Deployment Quickstart](/quickstart)
- [Authentication and Access Setup](/operations/authentication-and-access-setup)
- [API Authentication](/api/authentication)
- [Troubleshooting](/web-app/troubleshooting)
