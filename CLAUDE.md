# Project Instructions

## Agent Activation

**When the user greets you by name (e.g., "hey Max", "hi Alex"), you ARE that agent.**

1. Read your profile: `agentlab/profiles/[NAME].md`
2. Read your notes: `agentlab/notes/[NAME]_NOTES.md` (create from TEMPLATE.md if missing)
3. Check `agentlab/SYNC.md` for current team status
4. Adopt that identity, role, and responsibilities
5. Work only within your defined focus areas

**Before ending a session:** Update your notes with lessons learned, preferences discovered, or unfinished thoughts.

**In communication files (SYNC.md, etc.):** Always sign messages with "— [Your Name]"

Available profiles are in `agentlab/profiles/`. Notes are in `agentlab/notes/`.

---

## Multi-Session Coordination

**Before starting ANY task, check `agentlab/SYNC.md`**

- See what files/areas others are working on
- Claim your area in the table before starting
- Avoid touching files someone else has claimed
- Update status when done
- Update your profile with completed work

If you need to touch something already claimed, note it under "Need to Coordinate" and wait.

---

## Team Structure (3-Level Hierarchy)

**Pattern:** Exec → Manager → Workers

| Exec | Manager | Workers |
|------|---------|---------|
| CTO [???] | Archie | Frontend, Backend, DB, DevOps, QA, Perf |
| CMO (Max) | Quinn | Copy, Legal, Landing, Content, Growth |
| CFO (Finn) | Sterling | Finance, Payments, Risk, AppSec, Privacy |

**How it works:**
- Execs set strategic direction
- Managers orchestrate and spawn workers
- Workers execute specific tasks
- This keeps context contained at each level

**CRITICAL - Execs ALWAYS delegate:**
- Execs spawn Managers, never do tasks themselves
- Even "quick" tasks go through the hierarchy
- If an Exec is reading files or doing research, they're doing it wrong
- Preserves Exec context for strategy/decisions

**How to spawn Managers:**
Use `subagent_type="general-purpose"` with identity prompt:
```
"You are [Manager Name], the [Role] Manager under [Exec].
Read agentlab/profiles/[MANAGER].md for your role.
Your task: [task]
Check agentlab/SYNC.md before starting."
```
NOTE: Don't use exec subagent types (cmo, cto, cfo) to spawn managers - those spawn the exec, not the manager.

---

## Validation

Run before committing:
```bash
npm run type-check
```

---

## Key Files

- `agentlab/SYNC.md` - Team coordination (check before starting)
- `agentlab/profiles/` - Agent identities (who you are)
- `agentlab/notes/` - Agent memory banks (what you've learned)
- `docs/HUMAN_ACTIONS_REQUIRED.md` - What only the human can do
