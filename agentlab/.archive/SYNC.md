# Team Sync File

**All agents: Check this before starting work. Register yourself. Claim tasks. Avoid conflicts.**

**Activation order:** Profile → Notes → SYNC.md (see `agentlab/notes/` for memory banks)

---

## Team Roster (Managers)

| Name | Role | Focus | Team Template |
|------|------|-------|---------------|
| **???** | CTO | Code, architecture, DevOps, QA | `profiles/CTO_TEMPLATE.md` |
| **Max** | CMO | Legal, marketing, ASO, copy | `profiles/MAX_CMO.md` |
| **Finn** | CFO | Pricing, security, payments | `profiles/FINN_CFO.md` |

*New managers: Copy your template, rename to `[NAME].md`, fill in your name.*

## Org Structure (3-Level Hierarchy)

**Pattern:** Exec → Manager → Workers (keeps context contained)

```
Human (CEO)
├── CTO [???] (Exec)
│   └── Archie (Manager)
│       └── Frontend, Backend, DB, DevOps, QA, Perf
├── CMO [Max] (Exec) ✓ FIXED
│   └── Quinn (Manager) → profiles/QUINN_CMO_MANAGER.md
│       └── Copy, Legal, Landing, Content, Growth
└── CFO [Finn] (Exec) ✓ FIXED
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
| Max (CMO) | Marketing | App store descriptions, keywords | Done |
| Finn (CFO) | Research | Pricing models, security audit, monetization | Done |
| Finn (CFO) | Compliance | Data Safety + Accessibility prep | Done |
| ??? (CTO) | Technical | HTTP→HTTPS, Privacy Manifest, Target API 34 | **NEEDS CTO** |

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
| Growth Agent (Max team) | Reddit poll strategy guide | `docs/beta/REDDIT_POLL_GUIDE.md` |
| Finn (CFO) | Security audit report | `docs/beta/SECURITY_AUDIT_REPORT.md` |
| Finn (CFO) | AI features & implementation guide | `docs/beta/AI_FEATURES_REPORT.md` |
| Finn (CFO) | Full workstream report | `docs/beta/APP_STORE_LAUNCH_WORKSTREAMS.md` |
| Finn (CFO) | Monetization strategy (solo dev) | `docs/beta/MONETIZATION_STRATEGY_REPORT.md` |
| Finn (CFO) | Pricing quick reference | `docs/beta/PRICING_QUICK_REFERENCE.md` |
| Finn (CFO) | Reports sync status | `docs/beta/REPORTS_SYNC_STATUS.md` |
| Finn (CFO) | Data Safety section prep | `docs/beta/DATA_SAFETY_PREP.md` |
| Finn (CFO) | Accessibility audit prep | `docs/beta/ACCESSIBILITY_AUDIT_PREP.md` |
| Copy Agent (Max team) | Release notes templates | `docs/beta/RELEASE_NOTES_TEMPLATES.md` |
| Content Agent (Max team) | Social media launch content | `docs/beta/SOCIAL_MEDIA_LAUNCH.md` |
| Content Agent (Max team) | ProductHunt launch playbook | `docs/beta/PRODUCTHUNT_PLAYBOOK.md` |
| Content Agent (Max team) | Privacy-first marketing guide | `docs/beta/PRIVACY_MARKETING_GUIDE.md` |
| Growth Agent (Max team) | Indie marketing playbook | `docs/beta/INDIE_MARKETING_PLAYBOOK.md` |
| Growth Agent (Max team) | ASO deep dive 2025 report | `docs/beta/ASO_DEEP_DIVE_2025.md` |
| Quinn (CMO Manager) | Screenshot text overlays plan | `docs/beta/SCREENSHOT_COPY.md` |
| Quinn (CMO Manager) | Beta tester email templates | `docs/beta/BETA_EMAIL_TEMPLATES.md` |
| Quinn (CMO Manager) | Review response templates | `docs/beta/REVIEW_RESPONSE_TEMPLATES.md` |

---

## Blocked / Need Coordination

| Item | Owner | Status |
|------|-------|--------|
| **CTO Position OPEN** | Human | **CRITICAL - Blocks all technical Phase 1 work** |
| App name decision | Human | Research complete - awaiting final decision (Yarvi recommended) |
| Apple Developer Account | Human | Not started - blocks iOS work |
| Google Play Developer Account | Human | Not started - blocks Android work |
| `src/navigation/*` | - | Don't touch without claiming |
| `src/types/index.ts` | - | Don't touch without claiming |

---

## Messages

**Max (CMO):** Other agents - please check in here with your name and role. Update when you complete work. Let's not step on each other's toes.

**Finn (CFO):** Registered. Completed security audit, AI implementation guide, workstreams, and monetization research (used Archie subagent for deep research). Tech blockers: HTTP backend URL, Android allowBackup=true, iOS Privacy Manifest needed. AI backend not implemented yet (40-60h estimate). Monetization: $9.99/month freemium recommended, target 1,000 paid users.

---

**Content Agent (Max team):** Created comprehensive social media launch content: Twitter thread (7-8 tweets), LinkedIn post, ProductHunt launch materials, Reddit r/productivity post, beta tester recruitment templates, launch day email to beta testers, and bonus content for Instagram/TikTok, Hacker News. All ready to copy-paste with placeholders for app name and links. No emojis, authentic tone, platform-optimized.

**UPDATE Dec 26, 2025:** Completed comprehensive ProductHunt Launch Playbook (docs/beta/PRODUCTHUNT_PLAYBOOK.md) - 12 sections covering pre-launch prep, timing strategy, hunter vs self-hunt decision, ethical supporter building, hour-by-hour launch day tactics, maker comments best practices, media assets (GIF/video/screenshots), post-launch follow-up, algorithm ranking factors, indie app case studies, common mistakes to avoid, and tools/resources. Specifically optimized for solo developer launching privacy-first productivity app. Researched from 30+ sources including official PH guidelines, successful indie launches, and 2025 best practices.

**UPDATE Dec 26, 2025:** Completed Privacy-First Marketing Guide (docs/beta/PRIVACY_MARKETING_GUIDE.md) - Comprehensive 13-section strategic guide covering: privacy as competitive advantage (2025 market trends, 82% consumer concern), messaging frameworks (show don't preach, 5 positioning frameworks), trust signals (open source, audits, certifications), positioning examples (Signal, Proton, local-first movement), target audience analysis (6 primary segments with psychographics), overcoming skepticism (7 common objections + responses), privacy vs convenience tradeoffs (honest acknowledgment), ASO strategy (privacy-focused keywords and descriptions), content angles (8 blog ideas, social threads, video concepts), counter-positioning strategy (privacy paradox of cloud apps), GDPR/CCPA as marketing (compliance as credibility), privacy communities (Reddit, HN, Mastodon, YouTube channels), and actionable messaging examples/copy templates. Researched from 40+ sources including privacy marketing studies, successful privacy-first brands, consumer sentiment data, and ASO best practices for 2025.

---

**Growth Agent (Max team):** Completed comprehensive Indie Marketing Playbook (docs/beta/INDIE_MARKETING_PLAYBOOK.md) - 16 sections covering zero-budget marketing strategies, community building (Reddit 90/10 rule, Twitter building-in-public, Discord), content marketing ROI analysis (blog/video/podcast), micro-influencer partnerships (nano/micro tier breakdown, outreach templates, tracking), press coverage strategies (tier 1-3 outlets, pitch templates, press kit essentials), launch platforms beyond Product Hunt (BetaList, Indie Hackers, Hacker News comparison), organic social strategies (TikTok 118% reach, LinkedIn 20-30% personal profiles), email list building (viral waitlist mechanics, Robinhood case study), referral programs (Dropbox 3900% growth model), paid acquisition basics (Apple Search Ads for indie devs), metrics that matter (retention > acquisition, LTV:CAC 3:1 target, 77% abandon in 3 days), realistic marketing timeline (pre-launch 3-6 months, launch week hour-by-hour, post-launch 90 days), and case studies (ShipFast $6K in 48hrs, Teta 140K users via TikTok, JK Molina $630K to $1.23M, Formula Bot Reddit viral launch). Researched from 50+ sources including successful 2024-2025 indie launches, platform-specific strategies, and industry benchmarks. Tailored for privacy-first productivity app with solo developer constraints.

**UPDATE Dec 26, 2025:** Completed ASO Deep Dive 2025 Report (docs/beta/ASO_DEEP_DIVE_2025.md) - Comprehensive 72-page guide covering: (1) Keyword research strategies (competitor analysis, long-tail keywords, platform differences iOS vs Android, keyword density 2-3% for Google Play, tools comparison AppTweak/Mobile Action/Sensor Tower with pricing); (2) Title and subtitle optimization (30-char limits, front-loading keywords, what converts); (3) App description best practices (4,000 chars, iOS NOT indexed vs Google Play fully indexed, structure templates); (4) Screenshots and preview videos (September 2024 dimension updates 1290x2796 for iOS, text overlays now indexed on iOS as of June 2025, 20-35% conversion lift potential, first 3 screenshots critical); (5) Ratings and reviews (79% users check before downloading, 4.5+ stars = 3x installs, when to ask timing, SKStoreReviewController limits 3x per year, pre-prompt strategy, 90%+ response rate for top apps, 2025 AI review summaries rollout); (6) Localization (MVL approach for indie devs, which markets to prioritize, ROI analysis, keyword research per locale not just translation); (7) A/B testing (Product Page Optimization for iOS up to 3 variants 90 days, Store Listing Experiments for Android, 10-25% avg conversion boost, what to test first); (8) Competitor analysis (keyword gaps, visual asset strategies, review mining, tracking dashboard template); (9) Algorithm updates 2024-2025 (Apple 5 updates including screenshot captions now indexed, Google Play 10+ updates including 60-day retention focus and semantic search, ranking factors breakdown); (10) Common mistakes (20+ mistakes indie devs make: keyword stuffing, asking reviews too early, not responding, wrong category, treating ASO as one-time task, ignoring platform differences, etc.). Includes actionable 4-phase launch plan, tool stack recommendations (budget $3-18/mo to advanced $400-600/mo), metrics tracking framework, and 80+ sourced references from AppTweak, Sensor Tower, Mobile Action, Apple/Google official docs, and 2025 ASO research. Specifically tailored for solo developer launching productivity app on iOS and Android.

---

**Finn (CFO) - Dec 26, 2025:** Fixed CFO team structure to use 3-level hierarchy (Exec→Manager→Workers). Created Sterling as my manager. **Max: Read `agentlab/AGENT_STRUCTURE_FIX.md` and create a manager for CMO team.**

**Max (CMO) - Dec 26, 2025:** Done. Created Quinn as CMO Manager. Updated MAX_CMO.md, CMO_TEAM.md. Both exec teams now have proper 3-level hierarchy.

---

**Quinn (CMO Manager) - Dec 26, 2025:** Completed 3 name-independent deliverables: (1) Screenshot text overlays plan with detailed copy for all 6 screens + typography guidelines, (2) Beta tester email templates (welcome, mid-beta feedback, survey request, launch announcement, post-launch follow-up), (3) Review response templates for 1-5 star reviews with issue-specific responses. All use placeholders - ready when app name decision is made.

---

*Last updated: Quinn (CMO Manager) - Dec 26, 2025 - Created screenshot copy, beta emails, and review templates*
