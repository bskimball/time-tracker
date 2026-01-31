# Deployment (Agent Guide)

This is the minimum deployment-oriented info that’s stable across tasks.

## Build

- Repo root: `npm run build`
- Web app only: `cd apps/web && npm run build`

## Run

- Web app production server: `cd apps/web && npm run start`

## Containers

- Full stack (recommended for local parity): `docker compose --profile prod up`
