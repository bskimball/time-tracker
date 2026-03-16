---
title: Employee Guide
description: Employee time-clock workflows for floor and kiosk operations.
---

This guide is for frontline employees clocking work and breaks on shared or personal devices.

## Employee workspace routes

- `/floor`: standard employee floor entry point.
- `/time-clock` (legacy; no longer routed): use `/floor` as the current entry point.
- `/floor/kiosk`: shared-device kiosk workflow.
- `/floor/time-clock/mobile`: touch-first mobile time-clock variant.

## Core employee workflows

### 1) Start and end shift

- Clock in to an active station.
- Clock out from your active session row.
- If you are already clocked in, use break/task controls instead of creating a second work session.

### 2) Break management

- Start break and end break from your active session controls.
- Break state is reflected in your status card and manager monitor views.

### 3) Task controls while clocked in

- Start, switch, or end a task from the session row.
- Task behavior depends on operational mode:
  - `MANAGER_ONLY`: self-assignment is hidden.
  - `SELF_ASSIGN_ALLOWED`: self-assignment is optional.
  - `SELF_ASSIGN_REQUIRED`: an active task is required while clocked in.

## Screen-by-screen behavior

### Floor (`/floor`)

- Employee `My Status` card surfaces current station, break state, and active task state.
- `Access Terminal` card contains the interactive clock controls used for shift/break actions.
- `My Task Controls` appears after clock-in and supports start/switch/end task actions.

### Kiosk (`/floor/kiosk`)

- Two-step employee code + PIN verification and clock action flow for shared devices.
- Optional station selection when clocking in.
- Local offline queue + sync indicators for unstable connectivity.

### Mobile (`/floor/time-clock/mobile`)

- Touch-first compact layout for handheld operation.
- Employee code + PIN entry for shared-device style clocking.
- Mobile-specific action controls for clock, break, and task interactions.

## Kiosk and device usability features

- Kiosk mode can auto-focus PIN entry and prioritize touch-friendly actions.
- Offline actions can queue and sync when connectivity returns.
- Device API key can be stored locally for kiosk sync behavior.

## Known employee UX gaps

- `/floor` currently shows a PIN workflow for employee sessions that is server-blocked for employees. Tracked in [Issue #44](https://github.com/bskimball/time-tracker/issues/44).
- `/floor` manual select currently exposes full personnel roster options to employee sessions, but cross-employee actions are rejected server-side. Tracked in [Issue #45](https://github.com/bskimball/time-tracker/issues/45).

## What employees should report immediately

- Incorrect station on a work session.
- Missing clock events or break events.
- Task mismatches that block production tracking.

Managers can correct these in [Manager Guide](/web-app/manager).
