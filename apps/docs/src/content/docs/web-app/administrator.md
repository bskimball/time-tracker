---
title: Administrator Guide
description: Administration workflows for system setup, permissions, integrations, and KPI controls.
---

This guide is for platform owners and operations administrators. Executive-role users may share some configuration responsibilities, but route access differs from full admin behavior.

## Administration surfaces

- `/settings/stations`
- `/settings/employees`
- `/settings/users`
- `/settings/api-keys`
- `/settings/operational-config`
- `/executive` (`ADMIN` route access in current app behavior)
- `/executive/analytics` (`ADMIN` route access in current app behavior)

Detailed route walkthroughs:

- [Settings Guide](/web-app/settings)
- [Executive Guide](/web-app/executive)

## Setup and governance workflow

### 1) Configure stations and workforce records

- Create and maintain stations for physical work areas.
- Create employee records and maintain PIN readiness.
- Keep user accounts aligned to role responsibilities.

### 2) Manage system access

- Assign roles (`WORKER`, `MANAGER`, `EXECUTIVE`, `ADMIN`) to enforce least privilege.
- Revoke stale user access as staffing changes.
- Use [Roles and Permissions](/reference/roles-and-permissions) when validating what each role can actually do.

### 3) Manage API integrations

- Generate and revoke API keys in `/settings/api-keys`.
- Distribute keys through secure channels only.
- Audit integrations against [API Authentication](/api/authentication).

### 4) Tune operational config

- Update KPI and costing constants in `/settings/operational-config`.
- Changes affect manager and executive dashboards for new requests.
- Coordinate changes with finance and operations policy owners.

## Executive analytics usage

- Use `/executive` for KPI snapshots and strategic alerts.
- Use `/executive/analytics` for deeper trend and cost analysis.
- Validate productivity, occupancy, overtime, and variance thresholds regularly.
- Follow the section-level walkthrough in [Executive Guide](/web-app/executive).

## Permission-sensitive actions

- Operational config updates are restricted to `ADMIN` and `EXECUTIVE` users.
- Executive portal is an admin-only access path in the current app behavior.
- API keys should be treated like credentials and rotated as needed.

## Recommended operating cadence

- **Daily**: review alerts, exceptions, and access anomalies.
- **Weekly**: review thresholds, role assignments, and integration health.
- **Monthly**: audit API key usage, station definitions, and reporting quality.
