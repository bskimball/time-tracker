# Worker Self-Assignment Implementation Todo

## Agent Roster
- Agent-1 (Architecture and Integration Lead)
- Agent-2 (Data and Actions)
- Agent-3 (Floor and Time Clock UX)
- Agent-4 (Manager Surfaces and Consistency)
- Agent-5 (QA and Docs)

## Phase 0 - Alignment
- [ ] P0-T1 Finalize acceptance criteria and non-goals (Owner: Agent-1)
- [x] P0-T2 Publish file ownership boundaries (Owner: Agent-1)
- [x] P0-T3 Confirm merge order and dependency chain (Owner: Agent-1)

## Phase 1 - Foundation (Schema, Settings, Permissions)
- [x] P1-T1 Add operational setting `TASK_ASSIGNMENT_MODE` with values `MANAGER_ONLY`, `SELF_ASSIGN_ALLOWED`, `SELF_ASSIGN_REQUIRED` (Owner: Agent-2)
- [x] P1-T2 Update operational config UI/actions to support enum settings safely (Owner: Agent-2)
- [x] P1-T3 Add assignment source metadata (`MANAGER`, `WORKER`) and assigner reference on task assignments (Owner: Agent-2)
- [x] P1-T4 Add shared permission helper for manager assign vs worker self-assign (Owner: Agent-2)

## Phase 2 - Worker Self-Assignment (Floor/Time Clock)
- [x] P2-T1 Add worker task actions (`start`, `switch`, `end`) with strict policy checks (Owner: Agent-3, depends on P1-T1/P1-T4)
- [x] P2-T2 Update `/floor` and `/time-clock` data loading to pass assignment mode and active task options (Owner: Agent-3, depends on P1-T1)
- [x] P2-T3 Add mode-aware worker controls in shared time tracking UI (Owner: Agent-3, depends on P2-T1/P2-T2)
- [x] P2-T4 Ensure mobile floor client behavior matches desktop for mode states and accessibility (Owner: Agent-3, depends on P2-T1/P2-T2)

## Phase 3 - Manager Surfaces
- [x] P3-T1 Show assignment source badge in manager tasks active/history lists (Owner: Agent-4, depends on P1-T3)
- [x] P3-T2 Keep monitor and timesheets active worker logic aligned with floor-active semantics (Owner: Agent-4, depends on P1-T3)
- [x] P3-T3 Clarify terminology in timesheets: separate `Clocked In` and `Floor Active` when needed (Owner: Agent-4, depends on P3-T2)

## Phase 4 - QA and Hardening
- [x] P4-T1 Add/adjust tests for settings validation and assignment source behavior (Owner: Agent-5, depends on P1-T1/P1-T3)
- [x] P4-T2 Add tests for worker self-assignment policy gates by mode (Owner: Agent-5, depends on P2-T1)
- [x] P4-T3 Run full verification (`npm run check` or scoped equivalents) and triage failures (Owner: Agent-5, depends on P2/P3)
- [x] P4-T4 Update docs and release notes summary (Owner: Agent-5)

## Definition of Done
- [x] Mode setting is configurable and validated server-side
- [x] Worker self-assignment enabled only when mode allows it
- [x] Manager assignment workflow remains functional
- [x] Assignment source is visible on manager task surfaces
- [x] Active worker views are semantically clear and consistent
- [x] Typecheck, lint, and tests pass for touched scopes

## Validation Notes (2026-02-11)
- Completed status above is based on repository inspection and targeted command validation.
- `apps/web` scoped verification is now green for touched scopes:
  - `npm -w apps/web run test` (8 files / 14 tests passed)
  - `npm -w apps/web run typecheck` (passed)
  - `npm -w apps/web run lint` (passed)
- `npm -w apps/web run check` remains sensitive to broad pre-existing repo formatting state; Phase 4 closure used scoped equivalents per task definition.

## Merge Sequence
1. Agent-2 foundation PR (schema/settings/permissions)
2. Agent-3 floor/time-clock PR (worker actions + UI)
3. Agent-4 manager surfaces PR (badges/semantics)
4. Agent-5 QA/docs PR
5. Agent-1 integration and final verification
