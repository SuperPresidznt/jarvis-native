# GitHub Actions Android Bundle Failure – Fix Guide

**Owner:** Team
**Prepared by:** Madam Claudia
**Date:** 2025-12-16

## Summary
Release builds are failing at `:app:createBundleReleaseJsAndAssets` due to a bundler syntax error:
```
SyntaxError: src/components/pomodoro/PomodoroStats.tsx: Duplicate declaration "PomodoroStats"
```
This happens because the component re-imported its own name as a runtime value instead of a type, causing a duplicate symbol during Metro bundling.

## Root Cause
- `PomodoroStats.tsx` imports `PomodoroStats` (from the DB types) as a **runtime** value, then declares `export function PomodoroStats(...)`. Bundler sees two declarations with the same name and fails.
- Error reproduced in GitHub Actions logs: `:app:createBundleReleaseJsAndAssets` step fails with exit code 1.

## Fix (already applied locally, needs commit/push)
File: `src/components/pomodoro/PomodoroStats.tsx`
```ts
- import { PomodoroStats, DayStats } from '../../database/pomodoro';
+ import type { PomodoroStats as PomodoroStatsType, DayStats } from '../../database/pomodoro';

 interface PomodoroStatsProps {
-  todayStats: PomodoroStats;
-  weeklyStats: PomodoroStats;
+  todayStats: PomodoroStatsType;
+  weeklyStats: PomodoroStatsType;
 }
```
This makes the DB types type-only, avoiding the duplicate runtime symbol.

## What the team must do
1) **Commit & push** the above change to `PomodoroStats.tsx` (already edited locally).
2) **Re-run** the GitHub Actions workflow (Build Android APK / Release).
3) Verify the build passes; the bundler error should be gone.

## Validation steps (if desired locally)
- Run TypeScript check: `npx tsc --noEmit`
- Run Metro bundle test (optional): `cd android && ./gradlew :app:bundleReleaseJsAndAssets --no-daemon --stacktrace`

## Notes
- No signing/config changes needed for this specific failure; it is purely a JS bundling issue.
- If future bundling errors appear, grab the first syntax error line from the workflow log; it will usually point to the file and line.
