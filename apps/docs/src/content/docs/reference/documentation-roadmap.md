---
title: Documentation Roadmap
description: Coverage backlog for Shift Pulse documentation, organized by Diataxis document type.
---

This page tracks the highest-value documentation still missing from the customer and operator docs set.

## Current assessment

The docs site is strong on product workflow orientation for employees, managers, and administrators.

The largest remaining gaps are:

- On-prem and operator runbooks
- Authentication and access lifecycle guidance
- Observability and incident response reference material
- Data and configuration reference pages for long-term system ownership

## Tutorials

Tutorials should help a new operator or admin achieve a first successful outcome.

- **First week rollout tutorial**: stand up a test environment, create an admin, add stations and employees, and validate a live floor workflow.
- **First integration tutorial**: fetch `/api/doc`, call a protected endpoint, and verify one downstream reporting workflow.
- **Manager readiness tutorial**: configure operational settings, open realtime monitoring, and validate corrections and reports for one shift.

## How-to guides

How-to guides should solve specific operational problems.

- **Rotate API credentials safely**
- **Recover administrator access after SSO failure**
- **Add a new warehouse station and validate downstream reporting**
- **Tune task-assignment policy for `MANAGER_ONLY`, `SELF_ASSIGN_ALLOWED`, and `SELF_ASSIGN_REQUIRED`**
- **Validate a release in staging before production rollout**
- **Troubleshoot stale realtime monitor data**
- **Back up and restore a Shift Pulse database**

## Reference

Reference should describe system facts, interfaces, and supported values.

- **Environment variable reference**
- **Operational configuration field reference**
- **Roles and permissions matrix**
- **Data model reference for core business entities**
- **API error and status code reference**
- **Health checks and expected responses reference**
- **Release compatibility matrix for app version, schema state, and key operational changes**

## Explanation

Explanation should help readers understand how and why the system behaves as it does.

- **Authentication model overview**: user sessions, SSO, API key auth, and realtime authorization
- **Operational data flow**: employees, stations, time logs, task assignments, and analytics
- **Why floor routes and manager routes are separated**
- **How realtime updates complement REST polling**
- **Hosted versus on-prem responsibilities**

## Priority order

1. On-prem operations and maintenance
2. Authentication and access setup
3. Environment variable and config reference
4. Roles and permissions matrix
5. Backup, restore, and release-validation runbooks
6. Data model and analytics explanations

## Done recently

- Added operator entry points under **Operating Shift Pulse**
- Added an on-prem operations handbook
- Added authentication and access setup guidance
- Added environment variable, role/permission, and operational-config reference pages
- Added backup/restore and release-validation runbooks

## Maintenance note

Update this roadmap when:

- A new supported feature ships without matching docs
- A known limitation is removed
- Operator responsibilities change between hosted and on-prem deployments
