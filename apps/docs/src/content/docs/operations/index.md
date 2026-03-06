---
title: Operations Overview
description: Start here if you are responsible for deploying, securing, or maintaining Shift Pulse.
---

This section is for operators, administrators, and technical owners who maintain Shift Pulse after initial rollout.

## In this section

- [On-Prem Operations Handbook](/operations/on-prem-operations): deployment, startup, upgrades, health checks, backups, and incident basics.
- [Authentication and Access Setup](/operations/authentication-and-access-setup): first-admin bootstrap, role setup, SSO planning, API auth, and credential rotation.
- [Backup and Restore](/operations/backup-and-restore): define and validate data protection and recovery workflows.
- [Release Validation](/operations/release-validation): staging and post-deploy checks for auth, routing, floor, manager, settings, and API surfaces.
- [Troubleshooting](/web-app/troubleshooting): day-to-day product triage by role.

## When to use these docs

- You are planning an on-premise installation or validating an existing environment.
- You need to understand which credentials control web access, API access, and realtime access.
- You are rotating secrets, reviewing access, or responding to an authentication incident.
- You need a short operational checklist for health verification after deploys or config changes.

## Operations baseline

- Application runtime: Node.js `>=22.6.0`
- Database: PostgreSQL
- Web/API app build and runtime live in the `apps/web` workspace
- API docs and Swagger UI are served from `/api/doc` and `/api/ui`

## Suggested reading order

1. [Deployment Quickstart](/quickstart)
2. [On-Prem Operations Handbook](/operations/on-prem-operations)
3. [Authentication and Access Setup](/operations/authentication-and-access-setup)
4. [Backup and Restore](/operations/backup-and-restore)
5. [Release Validation](/operations/release-validation)
6. [Navigation and Access](/web-app/navigation-and-access)
