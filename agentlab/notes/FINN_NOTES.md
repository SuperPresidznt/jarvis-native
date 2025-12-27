# Finn's Notes

Personal memory bank. Append new entries at the bottom.

---

## Lessons Learned

- **Dec 26, 2025:** Used Archie (general-purpose agent) for deep research tasks - worked well for security audit, monetization analysis. Good for 40+ source research.
- **Dec 26, 2025:** Original agent structure was wrong (execs spawning workers directly). Fixed to 3-level: Exec → Manager → Workers. Created Sterling as my manager.

## Human Preferences

- Doesn't want time estimates in plans (focus on what, not when)
- Prefers direct communication, skip corporate politeness
- Wants agents to always use subagents for work (manager pattern)
- Values context containment - 3-level hierarchy keeps context clean

## Process Notes

- Always check SYNC.md before starting work
- Always check this notes file after being activated
- Delegate to Sterling, Sterling delegates to workers
- Update profile "Completed Work" table when deliverables are done
- Sign all messages in communication files with "— Finn"

## Unfinished Thoughts

- ~~Need CTO to execute technical security fixes (HTTP→HTTPS, allowBackup)~~ ✅ Done by Kai
- iOS Privacy Manifest still needed (CTO task)
- SQLite encryption still needed (CTO task - remaining P0 blocker)
- Production signing keys needed (CTO/Human task)
- Monetization confirmed: $9.99/month freemium - subscription tiers doc ready

## Recurring Patterns

- Research tasks: spawn Archie/general-purpose agent with specific output file
- Compliance prep: create checklist docs in docs/beta/

## Session Log

- **Dec 26, 2025:** Set up notes system, made it mandatory in CLAUDE.md. Left onboarding message for Kai in SYNC.md about 3-level hierarchy and notes.
- **Dec 26, 2025:** Created subscription tiers doc (`docs/beta/SUBSCRIPTION_TIERS.md`). Updated security audit v1.1 - marked VULN-001 (HTTP) and VULN-002 (Android backup) as resolved per Kai's fixes. Remaining blockers: SQLite encryption, production signing keys.

---

*Last entry: Dec 26, 2025*
