# Multi-Agent Communication Protocol

## Core Rules
- `todo.md` is the source of truth for task state.
- Post updates at task start, task completion, and any blocker.
- Do not edit files owned by another agent unless a handoff is acknowledged.
- Escalate blockers immediately with proposed resolution.

## Ownership Map
- Agent-1: architecture, integration, final merge orchestration.
- Agent-2: schema, settings, server-side permission/action foundation.
- Agent-3: floor/time-clock worker UX and action wiring.
- Agent-4: manager tasks/monitor/timesheets consistency updates.
- Agent-5: testing, QA verification, docs/release notes.

## Status Update Template
```
[STATUS] Agent: <Agent-Name>
Time: <YYYY-MM-DD HH:MM TZ>
Task: <Todo ID>
State: <Not Started | In Progress | Blocked | Done>
Progress:
- <bullet>
Next:
- <bullet>
Needs: <none or explicit ask>
Links: <PR/commit/files/tests>
```

## Blocker Template
```
[BLOCKER] Agent: <Agent-Name>
Time: <YYYY-MM-DD HH:MM TZ>
Task: <Todo ID>
Severity: <Critical | High | Medium>
Blocked By: <dependency/decision/error>
Impact: <what is blocked>
Attempted: <what has been tried>
Proposed Resolution: <recommended fix>
Needed From: <Agent-Name>
```

## Handoff Template
```
[HANDOFF] From: <Agent-A> -> To: <Agent-B>
Time: <YYYY-MM-DD HH:MM TZ>
Task: <Todo ID>
Completed:
- <bullet>
Artifacts:
- <files/tests/PR>
Risks/Open Items:
- <bullet>
Requested Next Step:
- <single concrete action>
```

## Merge and Signoff Sequence
1. Agent-2 posts foundation completion and validation.
2. Agent-3 posts worker flow completion and validation.
3. Agent-4 posts manager surface completion and validation.
4. Agent-5 posts QA signoff and docs completion.
5. Agent-1 performs integration check, runs final validation, and merges in order listed in `todo.md`.

## Kickoff Message
```
Team kickoff for worker self-assignment:
1) Claim your first task in todo.md and post a STATUS update.
2) Follow file ownership boundaries and use HANDOFF when crossing boundaries.
3) Escalate blockers immediately with the BLOCKER template.
4) Do not mark Done until validation commands and impacted flows are verified.
```
