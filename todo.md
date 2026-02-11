# Worker Self-Assignment Implementation Todo

## Agent Roster
- Agent-1 (Architecture and Integration Lead)
- Agent-2 (Data and Actions)
- Agent-3 (Floor and Time Clock UX)
- Agent-4 (Manager Surfaces and Consistency)
- Agent-5 (QA and Docs)

## Phase 0 - Alignment
- [ ] P0-T1 Finalize acceptance criteria and non-goals (Owner: Agent-1)
- [ ] P0-T2 Publish file ownership boundaries (Owner: Agent-1)
- [ ] P0-T3 Confirm merge order and dependency chain (Owner: Agent-1)

## Phase 1 - Foundation (Schema, Settings, Permissions)
- [ ] P1-T1 Add operational setting `TASK_ASSIGNMENT_MODE` with values `MANAGER_ONLY`, `SELF_ASSIGN_ALLOWED`, `SELF_ASSIGN_REQUIRED` (Owner: Agent-2)
- [ ] P1-T2 Update operational config UI/actions to support enum settings safely (Owner: Agent-2)
- [ ] P1-T3 Add assignment source metadata (`MANAGER`, `WORKER`) and assigner reference on task assignments (Owner: Agent-2)
- [ ] P1-T4 Add shared permission helper for manager assign vs worker self-assign (Owner: Agent-2)

## Phase 2 - Worker Self-Assignment (Floor/Time Clock)
- [ ] P2-T1 Add worker task actions (`start`, `switch`, `end`) with strict policy checks (Owner: Agent-3, depends on P1-T1/P1-T4)
- [ ] P2-T2 Update `/floor` and `/time-clock` data loading to pass assignment mode and active task options (Owner: Agent-3, depends on P1-T1)
- [ ] P2-T3 Add mode-aware worker controls in shared time tracking UI (Owner: Agent-3, depends on P2-T1/P2-T2)
- [ ] P2-T4 Ensure mobile floor client behavior matches desktop for mode states and accessibility (Owner: Agent-3, depends on P2-T1/P2-T2)

## Phase 3 - Manager Surfaces
- [ ] P3-T1 Show assignment source badge in manager tasks active/history lists (Owner: Agent-4, depends on P1-T3)
- [ ] P3-T2 Keep monitor and timesheets active worker logic aligned with floor-active semantics (Owner: Agent-4, depends on P1-T3)
- [ ] P3-T3 Clarify terminology in timesheets: separate `Clocked In` and `Floor Active` when needed (Owner: Agent-4, depends on P3-T2)

## Phase 4 - QA and Hardening
- [ ] P4-T1 Add/adjust tests for settings validation and assignment source behavior (Owner: Agent-5, depends on P1-T1/P1-T3)
- [ ] P4-T2 Add tests for worker self-assignment policy gates by mode (Owner: Agent-5, depends on P2-T1)
- [ ] P4-T3 Run full verification (`npm run check` or scoped equivalents) and triage failures (Owner: Agent-5, depends on P2/P3)
- [ ] P4-T4 Update docs and release notes summary (Owner: Agent-5)

## Definition of Done
- [ ] Mode setting is configurable and validated server-side
- [ ] Worker self-assignment enabled only when mode allows it
- [ ] Manager assignment workflow remains functional
- [ ] Assignment source is visible on manager task surfaces
- [ ] Active worker views are semantically clear and consistent
- [ ] Typecheck, lint, and tests pass for touched scopes

## Merge Sequence
1. Agent-2 foundation PR (schema/settings/permissions)
2. Agent-3 floor/time-clock PR (worker actions + UI)
3. Agent-4 manager surfaces PR (badges/semantics)
4. Agent-5 QA/docs PR
5. Agent-1 integration and final verification
