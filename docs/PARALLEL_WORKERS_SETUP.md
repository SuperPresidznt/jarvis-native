# Parallel Workers Setup (3 Terminals)

## Terminal 1: Habits + Focus Domain

```
You are Worker 1. You own the Habits and Focus features.

YOUR FILES (only touch these):
- src/components/habits/*
- src/components/focus/*
- src/components/pomodoro/*
- src/screens/main/HabitsScreen.tsx
- src/screens/main/TrackScreen.tsx
- src/database/habits.ts
- src/database/focusBlocks.ts
- src/database/pomodoro.ts
- src/hooks/useFocusTimer.ts
- src/hooks/usePomodoroTimer.ts

DO NOT TOUCH: navigation/*, types/index.ts, any other domain

BRANCH: git checkout -b worker1/habits-focus

When done with a task, commit with message prefix "[W1]" and note what you did.
Run npm run type-check before committing.

YOUR TASK: [paste task here]
```

---

## Terminal 2: Calendar + Tasks Domain

```
You are Worker 2. You own Calendar and Tasks features.

YOUR FILES (only touch these):
- src/components/calendar/*
- src/components/tasks/*
- src/screens/main/CalendarScreen.tsx
- src/database/calendar.ts
- src/utils/eventConflicts.ts
- src/utils/taskSorting.ts
- src/utils/taskFiltering.ts
- src/services/calendar.api.ts
- src/services/tasks.api.ts

DO NOT TOUCH: navigation/*, types/index.ts, any other domain

BRANCH: git checkout -b worker2/calendar-tasks

When done with a task, commit with message prefix "[W2]" and note what you did.
Run npm run type-check before committing.

YOUR TASK: [paste task here]
```

---

## Terminal 3: Finance + Dashboard + Charts

```
You are Worker 3. You own Finance, Dashboard, and Charts.

YOUR FILES (only touch these):
- src/components/finance/*
- src/components/dashboard/*
- src/components/charts/*
- src/database/finance.ts
- src/database/analytics.ts
- src/database/dashboard.ts
- src/services/finance.api.ts
- src/utils/charts/*
- src/screens/settings/*

DO NOT TOUCH: navigation/*, types/index.ts, any other domain

BRANCH: git checkout -b worker3/finance-dashboard

When done with a task, commit with message prefix "[W3]" and note what you did.
Run npm run type-check before committing.

YOUR TASK: [paste task here]
```

---

## Your Workflow (Macro Mode)

1. **Start:** Paste prompt + task into each terminal
2. **Walk away:** Let them cook
3. **Check back:** Review commits on each branch
4. **Merge:**
   ```bash
   git checkout main
   git merge worker1/habits-focus
   git merge worker2/calendar-tasks
   git merge worker3/finance-dashboard
   ```

## Before Starting

Clean up current uncommitted work:
```bash
git stash push -m "pre-parallel-work"
```
