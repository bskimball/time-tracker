---
title: Environment Variables
description: Reference for runtime environment variables used by the Shift Pulse web application and API.
---

This page documents environment variables that are referenced directly by the current application code.

## Core runtime

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `NODE_ENV` | Yes | Runtime mode selection | Expected values include `development`, `production`, and `test`. Affects logging and cookie security behavior. |
| `PORT` | No | HTTP server port | Defaults to `3000` in production server startup. |
| `APP_URL` | Conditionally | Public application base URL | Used to build Google and Microsoft OAuth callback URLs. Defaults to `http://localhost:5173` when unset. Set this explicitly in deployed environments. |

## Database

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Recommended | Full PostgreSQL connection string | Preferred database configuration path. |
| `POSTGRES_USER` | Conditionally | Database username | Used only when `DATABASE_URL` is not set. |
| `POSTGRES_PASSWORD` | Conditionally | Database password | Used only when `DATABASE_URL` is not set. |
| `POSTGRES_DB` | Conditionally | Database name | Used only when `DATABASE_URL` is not set. |
| `POSTGRES_HOST` | No | Database hostname | Defaults to `localhost` when composing a connection string. |
| `POSTGRES_PORT` | No | Database port | Defaults to `5432` when composing a connection string. |

## API and security

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `TIME_CLOCK_API_KEY` | Yes for protected API use | Shared API secret for `/api/*` routes | `/api/health` is open. `/api/doc` and most API routes require `x-api-key` to match this value. |

## OAuth and SSO

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `GOOGLE_CLIENT_ID` | If Google sign-in is enabled | Google OAuth client ID | Code falls back to placeholder values when unset; production should not rely on placeholders. |
| `GOOGLE_CLIENT_SECRET` | If Google sign-in is enabled | Google OAuth client secret | Store in your secret manager. |
| `MICROSOFT_CLIENT_ID` | If Microsoft sign-in is enabled | Microsoft Entra ID client ID | Store in your secret manager. |
| `MICROSOFT_CLIENT_SECRET` | If Microsoft sign-in is enabled | Microsoft Entra ID client secret | Store in your secret manager. |

## Logging and diagnostics

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `LOG_LEVEL` | No | Application log verbosity | Defaults to `debug` in development and `info` otherwise. |
| `LOG_DB_QUERIES` | No | Enable Prisma query logging | Only enabled when set to the string `true`. |
| `LOG_DIR` | No | Directory for log files | Defaults to the app-local `logs` directory when unset. |

## Minimal production baseline

At minimum, document and control:

- `NODE_ENV=production`
- `PORT`
- `APP_URL`
- `DATABASE_URL`
- `TIME_CLOCK_API_KEY`

Add OAuth and logging variables only for the features you are using.

## Operational notes

- If `DATABASE_URL` is omitted, the app constructs a PostgreSQL connection string from `POSTGRES_*` values.
- Cookie and session security behavior depends in part on `NODE_ENV`.
- OAuth callback URLs are derived from `APP_URL`, so a wrong value will break SSO even when provider credentials are correct.
- The codebase currently accepts placeholder OAuth values for local startup; production environments should treat that as misconfiguration.

## Related docs

- [Authentication and Access Setup](/operations/authentication-and-access-setup)
- [On-Prem Operations Handbook](/operations/on-prem-operations)
- [API Authentication](/api/authentication)
