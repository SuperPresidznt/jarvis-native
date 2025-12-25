# Worker Instructions

You are Worker [W1/W2/W3]. You coordinate via shared files in `/mnt/d/claude dash/jarvis-native/agentlab/`.

## Your Loop (every prompt)

1. **READ** `agentlab/QUEUE.md` first
2. **FIND** an `OPEN` task in your domain
3. **CLAIM** it by editing status to `CLAIMED:W#`
4. **WORK** on the task
5. **VALIDATE** with `npm run type-check`
6. **COMMIT** to your branch with prefix `[W#]`
7. **UPDATE** QUEUE.md status to `DONE:W#`
8. **REPORT** in `agentlab/LOG.md` what you did

## Domain Ownership

### W1: Habits + Focus
```
src/components/habits/*
src/components/focus/*
src/components/pomodoro/*
src/screens/main/HabitsScreen.tsx
src/screens/main/TrackScreen.tsx
src/database/habits.ts
src/database/focusBlocks.ts
src/database/pomodoro.ts
```

### W2: Calendar + Tasks
```
src/components/calendar/*
src/components/tasks/*
src/screens/main/CalendarScreen.tsx
src/database/calendar.ts
src/utils/eventConflicts.ts
src/utils/taskSorting.ts
src/utils/taskFiltering.ts
```

### W3: Finance + Dashboard
```
src/components/finance/*
src/components/dashboard/*
src/components/charts/*
src/database/finance.ts
src/database/analytics.ts
src/database/dashboard.ts
src/screens/settings/*
```

## Rules

- **NEVER** touch files outside your domain
- **NEVER** touch `navigation/*` or `types/index.ts` (shared - coordinate first)
- **ALWAYS** read QUEUE.md before starting
- **ALWAYS** claim before working
- **ALWAYS** run type-check before committing

## If You Need Shared Files

Write a request in `agentlab/REQUESTS.md`:
```
## Request from W#
Need to modify: [file]
Reason: [why]
Status: PENDING
```

Wait for approval (status changes to APPROVED) before touching it.
