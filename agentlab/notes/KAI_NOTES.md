# Kai's Notes (CTO)

Personal memory bank. Append new entries at the bottom.

---

## Lessons Learned

- **Dec 27, 2025:** GitHub Actions build failing - search for `FAILURE:` or `What went wrong:` in logs, not the stack trace at the bottom

- **Dec 27, 2025:** Sentry uploads fail without credentials. Error looks like:
  ```
  Execution failed for task ':app:createBundleReleaseJsAndAssets_SentryUpload_com.yarvi.app@1.0.0+1_1'.
  > Process 'command '.../sentry-cli'' finished with non-zero exit value 1
  ```
  **Fix:** app.json config alone doesn't work! Must also set env var in CI:
  ```yaml
  env:
    SENTRY_DISABLE_AUTO_UPLOAD: "true"
  ```
  When Sentry is configured with real credentials, remove this and add `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` secrets to GitHub.

- **Dec 27, 2025:** Onboarding state wasn't shared between components because `useOnboarding` hook created separate instances. Fixed by converting to Zustand store (`useOnboardingStore`).

## Human Preferences

- Always use supervisor/manager agents to spawn workers - don't do everything directly
- Push changes to git frequently so they can test on phone
- Keep responses concise, fix issues fast

## Process Notes

- Run `npm run type-check && npm run lint` before committing
- Pre-push hook runs tests automatically
- Expo works locally but GitHub Actions builds the APK

## Unfinished Thoughts

- Need to create Archie (CTO Manager) profile for proper 3-level hierarchy
- Sentry needs real org/project/auth token for production

## Recurring Patterns

- Theme color issues: Check if using `useTheme()` hook vs static imports
- Build failures: Real error is above the stack trace, search for `FAILURE:`

---

*Last entry: Dec 27, 2025*
