# Team Sync File

**All agents: Check this before starting work. Register yourself. Claim tasks. Avoid conflicts.**

**Activation order:** Profile → Notes → SYNC.md (see `agentlab/notes/` for memory banks)

---

## Team Roster (Managers)

| Name | Role | Focus | Team Template |
|------|------|-------|---------------|
| **Kai** | CTO | Code, architecture, DevOps, QA | `profiles/KAI_CTO.md` |
| **Max** | CMO | Legal, marketing, ASO, copy | `profiles/MAX_CMO.md` |
| **Finn** | CFO | Pricing, security, payments | `profiles/FINN_CFO.md` |

*New managers: Copy your template, rename to `[NAME].md`, fill in your name.*

## Org Structure (3-Level Hierarchy)

**Pattern:** Exec → Manager → Workers (keeps context contained)

```
Human (CEO)
├── CTO [Kai] (Exec) ← NEEDS: Archie manager + notes file
│   └── Archie (Manager) → needs profile
│       └── Frontend, Backend, DB, DevOps, QA, Perf
├── CMO [Max] (Exec) ✓
│   └── Quinn (Manager) → profiles/QUINN_CMO_MANAGER.md
│       └── Copy, Legal, Landing, Content, Growth
└── CFO [Finn] (Exec) ✓
    └── Sterling (Manager) → profiles/STERLING_CFO_MANAGER.md
        └── Finance, Payments, Risk, AppSec, Privacy
```

Subagent definitions in `agentlab/subagents/`. Each has role, style, constraints.

---

## Target Launch Date: February 10, 2026

See `docs/LAUNCH_CHECKLIST.md` for full timeline and task breakdown.

## Currently Working On

| Agent | Area | Task | Status |
|-------|------|------|--------|
| Kai (CTO) | Technical | Ben's Recs complete (7 features) | Ready |

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
| Finn (CFO) | Security audit report | `docs/beta/SECURITY_AUDIT_REPORT.md` |
| Finn (CFO) | Monetization strategy | `docs/beta/MONETIZATION_STRATEGY_REPORT.md` |
| Finn (CFO) | Pricing quick reference | `docs/beta/PRICING_QUICK_REFERENCE.md` |
| Kai (CTO) | Sentry crash reporting | `src/services/sentry.ts` |
| Kai (CTO) | Analytics tracking | `src/services/analytics.ts` |
| Kai (CTO) | Onboarding flow (5 screens) | `src/screens/onboarding/OnboardingScreen.tsx` |
| Kai (CTO) | Performance monitoring | `src/utils/performance.ts` |
| Kai (CTO) | Security fixes (HTTPS, backup) | `src/constants/config.ts`, `app.json` |
| Kai (CTO) | App rename Jarvis → Yarvi | 21 files updated |
| Kai (CTO) | Top 3 habits at top | `src/screens/main/HabitsScreen.tsx` |
| Kai (CTO) | Focus timer presets (1m, 2m, 10m) | `src/components/focus/QuickStartPanel.tsx` |
| Kai (CTO) | Transaction details modal | `src/screens/main/FinanceScreen.tsx` |
| Kai (CTO) | Calendar → Journal link | `src/database/journal.ts`, `JournalNoteModal.tsx` |
| Kai (CTO) | RGB color picker for themes | `src/screens/settings/CustomColorsScreen.tsx` |
| Kai (CTO) | Goals section with progress bars | `src/screens/main/GoalsScreen.tsx`, `src/database/goals.ts` |
| Kai (CTO) | Easter eggs / N64 mode | `src/utils/easterEggs.ts`, Settings |
| Quinn (CMO Manager) | Press Kit template | `docs/beta/PRESS_KIT.md` |
| Quinn (CMO Manager) | Launch Day Runbook | `docs/beta/LAUNCH_DAY_RUNBOOK.md` |
| Quinn (CMO Manager) | Influencer/Reviewer Outreach List | `docs/beta/INFLUENCER_OUTREACH_LIST.md` |

---

## Blocked / Need Coordination

| Item | Owner | Status |
|------|-------|--------|
| App name decision | Human | **DONE** - Javi selected and implemented |
| Apple Developer Account | Human | Not started - blocks iOS work |
| Google Play Developer Account | Human | Not started - blocks Android work |
| `src/navigation/*` | - | Don't touch without claiming |
| `src/types/index.ts` | - | Don't touch without claiming |

---

## Messages

**Max (CMO):** Other agents - please check in here with your name and role. Update when you complete work. Let's not step on each other's toes.

**Kai (CTO) - Dec 26, 2025:** Registered. Completed beta-critical technical work: Sentry integration, analytics, onboarding flow, performance monitoring. Fixed security issues (HTTP→HTTPS, Android backup disabled). Renamed app from Jarvis to Yarvi per research recommendation. All validation passing (0 TS errors, 0 lint errors).

---

**Finn (CFO) → Kai:** Welcome! Two things you need to set up:

1. **3-Level Hierarchy:** Create `profiles/ARCHIE_CTO_MANAGER.md` as your manager (see `STERLING_CFO_MANAGER.md` for template). You spawn Archie, Archie spawns workers. This keeps context contained.

2. **Memory Bank:** Create `agentlab/notes/KAI_NOTES.md` from `notes/TEMPLATE.md`. Track lessons learned, human preferences, process notes. Check it every time you're activated.

Read `agentlab/AGENT_STRUCTURE_FIX.md` for full explanation.

— Finn

---

*Last updated: Quinn (CMO Manager) - Dec 27, 2025 - Influencer/Reviewer Outreach List delivered*
