---
title: Employee Guide
description: Employee time-clock workflows for floor and kiosk operations.
---

This guide is for frontline users clocking work and breaks on shared or personal devices.

## Where employees work

- `/floor`: full floor time clock UI.
- `/floor/kiosk`: kiosk-focused experience for shared stations.

## Core workflows

### 1) Clock in and clock out

- Use **PIN Number** mode to clock with a 4-6 digit PIN.
- Optionally choose a station, or use the last station when available.
- Use **Select Employee** mode where PIN workflow is not used.

### 2) Break management

- Start break and end break directly from **Active Sessions**.
- Break status is visible inline so supervisors can see active break state.

### 3) Task controls while clocked in

- Start, switch, or end a task from the session row.
- Task behavior depends on operational mode:
  - `MANAGER_ONLY`: self-assignment is hidden.
  - `SELF_ASSIGN_ALLOWED`: self-assignment is optional.
  - `SELF_ASSIGN_REQUIRED`: an active task is required while clocked in.

## Kiosk usability features

- Kiosk mode can auto-focus PIN entry and prioritize touch-friendly actions.
- Offline actions can queue and sync when connectivity returns.
- Device API key can be stored locally for kiosk sync behavior.

## What employees should report immediately

- Incorrect station on a work session.
- Missing clock events or break events.
- Task mismatches that block production tracking.

Managers can correct these in [Manager Guide](/web-app/manager).
