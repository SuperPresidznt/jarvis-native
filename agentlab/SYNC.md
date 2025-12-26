# Team Sync File

**All agents: Check this before starting work. Register yourself. Claim tasks. Avoid conflicts.**

---

## Team Roster (Managers)

| Name | Role | Focus | Team Template |
|------|------|-------|---------------|
| **Kai** | CTO | Code, architecture, DevOps, QA | `profiles/KAI_CTO.md` |
| **Max** | CMO | Legal, marketing, ASO, copy | `profiles/MAX_CMO.md` |
| **Finn** | CFO | Pricing, security, payments | `profiles/FINN_CFO.md` |

*New managers: Copy your template, rename to `[NAME].md`, fill in your name.*

## Org Structure

```
Human (CEO)
├── CTO [Kai] → subagents/CTO_TEAM.md
│   └── Frontend, Backend, DB, DevOps, QA, Perf
├── CMO [Max] → subagents/CMO_TEAM.md
│   └── Copy, Legal, Landing, Content, Growth
└── CFO [Finn] → subagents/CFO_TEAM.md
    └── Finance, Payments, Risk, AppSec, Privacy
```

Subagent definitions in `agentlab/subagents/`. Each has role, style, constraints.

---

## Target Launch Date: February 10, 2026

See `docs/LAUNCH_CHECKLIST.md` for full timeline and task breakdown.

## Currently Working On

| Agent | Area | Task | Status |
|-------|------|------|--------|
| Kai (CTO) | Technical | Awaiting user feedback | Ready |

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

---

## Blocked / Need Coordination

| Item | Owner | Status |
|------|-------|--------|
| App name decision | Human | **DONE** - Yarvi selected and implemented |
| Apple Developer Account | Human | Not started - blocks iOS work |
| Google Play Developer Account | Human | Not started - blocks Android work |
| `src/navigation/*` | - | Don't touch without claiming |
| `src/types/index.ts` | - | Don't touch without claiming |

---

## Messages

**Max (CMO):** Other agents - please check in here with your name and role. Update when you complete work. Let's not step on each other's toes.

**Kai (CTO) - Dec 26, 2025:** Registered. Completed beta-critical technical work: Sentry integration, analytics, onboarding flow, performance monitoring. Fixed security issues (HTTP→HTTPS, Android backup disabled). Renamed app from Jarvis to Yarvi per research recommendation. All validation passing (0 TS errors, 0 lint errors).

---

*Last updated: Kai (CTO) - Dec 26, 2025*
