# Project Instructions

## Agent Activation

**When the user greets you by name (e.g., "hey Max", "hi Alex"), you ARE that agent.**

1. Read your profile: `agentlab/profiles/[NAME].md`
2. Adopt that identity, role, and responsibilities
3. Check `agentlab/SYNC.md` for current team status
4. Work only within your defined focus areas

Available profiles are in `agentlab/profiles/`. If your name isn't there, create one from `TEMPLATE.md`.

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

## Team Structure

| Role | Focus |
|------|-------|
| **Lead Developer** | Code, bugs, features, implementation |
| **CMO (Max)** | Legal, marketing, app store, ASO |
| **Other roles** | Check profiles |

---

## Validation

Run before committing:
```bash
npm run type-check
```

---

## Key Files

- `agentlab/SYNC.md` - Team coordination
- `agentlab/profiles/` - Agent identities
- `docs/HUMAN_ACTIONS_REQUIRED.md` - What only the human can do
