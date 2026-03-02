---
title: Settings Guide
description: Complete administrator workflow guide for all /settings routes and configuration surfaces.
---

This guide is for administrators responsible for system setup, workforce records, access control, integration keys, and operational tuning.

## Settings workspace

Primary settings routes:

- `/settings`
- `/settings/stations`
- `/settings/employees`
- `/settings/users`
- `/settings/api-keys`
- `/settings/operational-config`

## Settings overview (`/settings`)

Use this page as the admin home for quick navigation into each settings area.

### Key components

- **Navigation cards** for Stations, Employees, Users, API Keys, and Operational Config.
- **Executive shortcut** link for strategic monitoring routes.
- **Settings shell navigation** shared across all `/settings/*` pages.

## Stations (`/settings/stations`)

Use this page to maintain workstation/station definitions used by floor and analytics workflows.

### Key components

- **Add New Station** form.
- **Current Stations** list with per-row delete actions.

## Employees (`/settings/employees`)

Use this page to manage worker records used in floor operations and reporting.

### Key components

- **Add New Employee** form (`name`, `email`, optional `pin`).
- **Current Employees** list.
- Per-employee actions: **Set PIN** and **Delete**.

## Users (`/settings/users`)

Use this page to manage authenticated user accounts and role assignments.

### Key components

- **Add New User** form (`email`, `name`, `role`).
- **User Management** list with role selector and update action per user.
- Role options include `WORKER`, `MANAGER`, `EXECUTIVE`, and `ADMIN`.

## API Keys (`/settings/api-keys`)

Use this page for integration key lifecycle management (creation, naming, and rotation of integration identifiers).

### Key components

- **Create New API Key** form (`name`).
- **Your API Keys** list for active keys.
- Key creation should follow secure distribution and rotation policy.
- **Important:** keys generated on this page do **not** currently control authentication for `/api/*` routes. API requests are authenticated via the `TIME_CLOCK_API_KEY` environment variable (see `/api/authentication`).

## Operational Configuration (`/settings/operational-config`)

Use this page to tune KPI thresholds and business constants used by manager and executive analytics.

### Key components

- **Editable Values** table of operational constants.
- Per-row value editing with individual **Save** actions.
- Numeric constraints enforced per field (min/max/step where applicable).

## Recommended operating cadence

- **Daily**: review access and account updates (users/employees).
- **Weekly**: review station definitions and API integrations.
- **Monthly**: calibrate operational constants with finance/operations stakeholders.

## Known issue

- `Add New Station` presents free-text creation but rejects typical non-seeded names with `Invalid station name`; track: https://github.com/bskimball/time-tracker/issues/41
