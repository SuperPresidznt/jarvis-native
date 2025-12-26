# Team Sync File

**All agents: Check this before starting work. Register yourself. Claim tasks. Avoid conflicts.**

---

## Team Roster (Managers)

| Name | Role | Focus | Team Template |
|------|------|-------|---------------|
| **???** | CTO | Code, architecture, DevOps, QA | `profiles/CTO_TEMPLATE.md` |
| **Max** | CMO | Legal, marketing, ASO, copy | `profiles/MAX_CMO.md` |
| **???** | CFO | Pricing, security, payments | `profiles/CFO_TEMPLATE.md` |

*New managers: Copy your template, rename to `[NAME].md`, fill in your name.*

## Org Structure

```
Human (CEO)
├── CTO [???] → subagents/CTO_TEAM.md
│   └── Frontend, Backend, DB, DevOps, QA, Perf
├── CMO [Max] → subagents/CMO_TEAM.md
│   └── Copy, Legal, Landing, Content, Growth
└── CFO [???] → subagents/CFO_TEAM.md
    └── Finance, Payments, Risk, AppSec, Privacy
```

Subagent definitions in `agentlab/subagents/`. Each has role, style, constraints.

---

## Currently Working On

| Agent | Area | Task | Status |
|-------|------|------|--------|
| Max (CMO) | Marketing | App store descriptions, keywords | Done |
| (unclaimed) | Technical | Pricing models, tech workstream | Working |

---

## Completed

| Agent | Deliverable | Files |
|-------|-------------|-------|
| Max | Privacy Policy | `legal/PRIVACY_POLICY.md` |
| Max | Terms of Service | `legal/TERMS_OF_SERVICE.md` |
| Max | Human actions checklist | `docs/HUMAN_ACTIONS_REQUIRED.md` |
| Max | App store copy + ASO | `docs/beta/APP_STORE_COPY.md` |
| Max | Legal links in Settings | `src/screens/main/SettingsScreen.tsx` |
| Max | Legal URL config | `src/constants/config.ts` |
| Max | FAQ / Support docs | `docs/SUPPORT_FAQ.md` |
| Max | Agent profiles system | `agentlab/profiles/` |
| Max | Master Launch Checklist | `docs/LAUNCH_CHECKLIST.md` |
| Copy Agent (Max team) | App name availability research | `docs/beta/APP_NAME_AVAILABILITY.md` |
| Growth Agent (Max team) | App naming best practices research | `docs/beta/APP_NAME_RESEARCH.md` |
| Max | App name final summary (11 names) | `docs/beta/APP_NAME_FINAL_SUMMARY.md` |
| (unknown) | Full workstream report | `docs/beta/APP_STORE_LAUNCH_WORKSTREAMS.md` |

---

## Blocked / Need Coordination

| Item | Owner | Status |
|------|-------|--------|
| App name decision | Human | Research complete - awaiting final decision (Yarvi recommended) |
| `src/navigation/*` | - | Don't touch without claiming |
| `src/types/index.ts` | - | Don't touch without claiming |

---

## Messages

**Max (CMO):** Other agents - please check in here with your name and role. Update when you complete work. Let's not step on each other's toes.

---

*Last updated: Session Max*
