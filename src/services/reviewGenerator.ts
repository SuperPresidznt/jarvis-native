/**
 * Review Generator Service
 * Automated review generation from database analytics
 */

import { executeQuery, executeQuerySingle } from '../database';
import type {
  ReviewData,
  ReviewPeriod,
  TasksReviewData,
  HabitsReviewData,
  FocusReviewData,
  PomodoroReviewData,
  FinanceReviewData,
  Insight,
} from '../types';
import { generateInsights } from '../utils/reviewInsights';

/**
 * Aggregate task statistics for a period
 */
export async function aggregateTaskStats(
  startDate: string,
  endDate: string
): Promise<TasksReviewData> {
  // Get completed tasks
  const completedResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks
     WHERE status = 'completed'
     AND completed_at >= ? AND completed_at <= ?`,
    [startDate, endDate]
  );
  const completed = completedResult?.count || 0;

  // Get created tasks
  const createdResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks
     WHERE created_at >= ? AND created_at <= ?`,
    [startDate, endDate]
  );
  const created = createdResult?.count || 0;

  // Calculate average latency (days between creation and completion)
  const latencyResult = await executeQuerySingle<{ avg_latency: number | null }>(
    `SELECT AVG(
       (julianday(completed_at) - julianday(created_at))
     ) as avg_latency
     FROM tasks
     WHERE status = 'completed'
     AND completed_at >= ? AND completed_at <= ?`,
    [startDate, endDate]
  );
  const averageLatency = latencyResult?.avg_latency || 0;

  // Calculate completion rate
  const totalTasksResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks
     WHERE created_at <= ?
     AND (status != 'completed' OR completed_at >= ?)`,
    [endDate, startDate]
  );
  const totalTasks = totalTasksResult?.count || 0;
  const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  // Group by priority
  const byPriorityRows = await executeQuery<{ priority: string; count: number }>(
    `SELECT priority, COUNT(*) as count FROM tasks
     WHERE status = 'completed'
     AND completed_at >= ? AND completed_at <= ?
     GROUP BY priority`,
    [startDate, endDate]
  );
  const byPriority: Record<string, number> = {};
  byPriorityRows.forEach((row) => {
    byPriority[row.priority] = row.count;
  });

  // Group by project
  const byProjectRows = await executeQuery<{ project_name: string; count: number }>(
    `SELECT p.name as project_name, COUNT(t.id) as count
     FROM tasks t
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.status = 'completed'
     AND t.completed_at >= ? AND t.completed_at <= ?
     GROUP BY p.name`,
    [startDate, endDate]
  );
  const byProject: Record<string, number> = {};
  byProjectRows.forEach((row) => {
    byProject[row.project_name || 'No Project'] = row.count;
  });

  return {
    completed,
    created,
    averageLatency: Math.round(averageLatency * 10) / 10,
    completionRate: Math.round(completionRate),
    byPriority,
    byProject,
  };
}

/**
 * Aggregate habit statistics for a period
 */
export async function aggregateHabitStats(
  startDate: string,
  endDate: string
): Promise<HabitsReviewData> {
  // Get total completions
  const completionsResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM habit_logs
     WHERE completed = 1
     AND date >= ? AND date <= ?`,
    [startDate, endDate]
  );
  const totalCompletions = completionsResult?.count || 0;

  // Get current streaks and calculate average
  const streaksResult = await executeQuerySingle<{ avg_streak: number | null }>(
    `SELECT AVG(current_streak) as avg_streak FROM habits`,
    []
  );
  const averageStreak = Math.round(streaksResult?.avg_streak || 0);

  // Get best streak
  const bestStreakResult = await executeQuerySingle<{ max_streak: number | null }>(
    `SELECT MAX(longest_streak) as max_streak FROM habits`,
    []
  );
  const bestStreak = bestStreakResult?.max_streak || 0;

  // Calculate completion rate
  const totalLogsResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM habit_logs
     WHERE date >= ? AND date <= ?`,
    [startDate, endDate]
  );
  const totalLogs = totalLogsResult?.count || 0;
  const completionRate = totalLogs > 0 ? (totalCompletions / totalLogs) * 100 : 0;

  // Group by habit
  const byHabitRows = await executeQuery<{
    name: string;
    completions: number;
    streak: number;
  }>(
    `SELECT h.name,
            SUM(CASE WHEN hl.completed = 1 THEN 1 ELSE 0 END) as completions,
            h.current_streak as streak
     FROM habits h
     LEFT JOIN habit_logs hl ON h.id = hl.habit_id
       AND hl.date >= ? AND hl.date <= ?
     GROUP BY h.id, h.name, h.current_streak
     ORDER BY completions DESC`,
    [startDate, endDate]
  );

  const byHabit = byHabitRows.map((row) => ({
    name: row.name,
    completions: row.completions,
    streak: row.streak,
  }));

  return {
    totalCompletions,
    averageStreak,
    bestStreak,
    completionRate: Math.round(completionRate),
    byHabit,
  };
}

/**
 * Aggregate focus session statistics for a period
 */
export async function aggregateFocusStats(
  startDate: string,
  endDate: string
): Promise<FocusReviewData> {
  // Get completed focus blocks
  const sessionsResult = await executeQuerySingle<{ count: number; total_minutes: number }>(
    `SELECT
       COUNT(*) as count,
       COALESCE(SUM(actual_minutes), 0) as total_minutes
     FROM focus_blocks
     WHERE status = 'completed'
     AND start_time >= ? AND start_time <= ?`,
    [startDate, endDate]
  );

  const totalSessions = sessionsResult?.count || 0;
  const totalMinutes = sessionsResult?.total_minutes || 0;
  const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;

  // Get most productive hours
  const hourlyRows = await executeQuery<{ hour: number; count: number }>(
    `SELECT
       CAST(strftime('%H', start_time) AS INTEGER) as hour,
       COUNT(*) as count
     FROM focus_blocks
     WHERE status = 'completed'
     AND start_time >= ? AND start_time <= ?
     GROUP BY hour
     ORDER BY count DESC
     LIMIT 3`,
    [startDate, endDate]
  );
  const mostProductiveHours = hourlyRows.map((row) => row.hour);

  // Group by task
  const byTaskRows = await executeQuery<{ task_title: string; minutes: number }>(
    `SELECT
       COALESCE(t.title, 'No Task') as task_title,
       SUM(fb.actual_minutes) as minutes
     FROM focus_blocks fb
     LEFT JOIN tasks t ON fb.task_id = t.id
     WHERE fb.status = 'completed'
     AND fb.start_time >= ? AND fb.start_time <= ?
     GROUP BY t.title
     ORDER BY minutes DESC
     LIMIT 10`,
    [startDate, endDate]
  );

  const byTask = byTaskRows.map((row) => ({
    taskName: row.task_title,
    minutes: row.minutes || 0,
  }));

  return {
    totalSessions,
    totalMinutes,
    averageSessionLength: Math.round(averageSessionLength),
    mostProductiveHours,
    byTask,
  };
}

/**
 * Aggregate pomodoro statistics for a period
 */
export async function aggregatePomodoroStats(
  startDate: string,
  endDate: string
): Promise<PomodoroReviewData> {
  // Get completed pomodoros
  const pomodorosResult = await executeQuerySingle<{
    count: number;
    total_minutes: number;
  }>(
    `SELECT
       COUNT(*) as count,
       SUM(duration_minutes) as total_minutes
     FROM pomodoro_sessions
     WHERE status = 'completed'
     AND started_at >= ? AND started_at <= ?`,
    [startDate, endDate]
  );

  const totalPomodoros = pomodorosResult?.count || 0;
  const totalMinutes = pomodorosResult?.total_minutes || 0;

  // Calculate completion rate
  const allPomodorosResult = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM pomodoro_sessions
     WHERE started_at >= ? AND started_at <= ?`,
    [startDate, endDate]
  );
  const allPomodoros = allPomodorosResult?.count || 0;
  const completionRate = allPomodoros > 0 ? (totalPomodoros / allPomodoros) * 100 : 0;

  // Calculate average per day
  const daysDiff = Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const averagePerDay = totalPomodoros / daysDiff;

  // Get most productive hours
  const hourlyRows = await executeQuery<{ hour: number; count: number }>(
    `SELECT
       CAST(strftime('%H', started_at) AS INTEGER) as hour,
       COUNT(*) as count
     FROM pomodoro_sessions
     WHERE status = 'completed'
     AND started_at >= ? AND started_at <= ?
     GROUP BY hour
     ORDER BY count DESC
     LIMIT 3`,
    [startDate, endDate]
  );
  const mostProductiveHours = hourlyRows.map((row) => row.hour);

  return {
    totalPomodoros,
    totalMinutes,
    completionRate: Math.round(completionRate),
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    mostProductiveHours,
  };
}

/**
 * Aggregate finance statistics for a period
 */
export async function aggregateFinanceStats(
  startDate: string,
  endDate: string
): Promise<FinanceReviewData> {
  // Get total income
  const incomeResult = await executeQuerySingle<{ total: number | null }>(
    `SELECT SUM(amount) as total FROM finance_transactions
     WHERE type = 'income'
     AND date >= ? AND date <= ?`,
    [startDate, endDate]
  );
  const totalIncome = incomeResult?.total || 0;

  // Get total expenses
  const expensesResult = await executeQuerySingle<{ total: number | null }>(
    `SELECT SUM(amount) as total FROM finance_transactions
     WHERE type = 'expense'
     AND date >= ? AND date <= ?`,
    [startDate, endDate]
  );
  const totalExpenses = expensesResult?.total || 0;

  const netCashFlow = totalIncome - totalExpenses;

  // Group by category
  const byCategoryRows = await executeQuery<{ category: string; total: number }>(
    `SELECT category, SUM(amount) as total
     FROM finance_transactions
     WHERE date >= ? AND date <= ?
     GROUP BY category
     ORDER BY total DESC`,
    [startDate, endDate]
  );

  const byCategory: Record<string, number> = {};
  byCategoryRows.forEach((row) => {
    byCategory[row.category || 'Uncategorized'] = row.total;
  });

  // Calculate budget adherence
  const budgetResult = await executeQuerySingle<{
    total_budget: number | null;
    total_spent: number | null;
  }>(
    `SELECT
       SUM(b.amount) as total_budget,
       (SELECT SUM(amount) FROM finance_transactions
        WHERE type = 'expense'
        AND category = b.category
        AND date >= b.start_date
        AND date <= b.end_date) as total_spent
     FROM finance_budgets b
     WHERE b.start_date <= ? AND b.end_date >= ?`,
    [endDate, startDate]
  );

  const totalBudget = budgetResult?.total_budget || 0;
  const totalSpent = budgetResult?.total_spent || 0;
  const budgetAdherence =
    totalBudget > 0 ? Math.max(0, ((totalBudget - totalSpent) / totalBudget) * 100) : 100;

  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    byCategory,
    budgetAdherence: Math.round(budgetAdherence),
  };
}

/**
 * Generate a weekly review
 */
export async function generateWeeklyReview(): Promise<ReviewData> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);

  const startDate = weekStart.toISOString();
  const endDate = weekEnd.toISOString();

  // Aggregate all data in parallel
  const [tasks, habits, focus, pomodoro, finance] = await Promise.all([
    aggregateTaskStats(startDate, endDate),
    aggregateHabitStats(startDate, endDate),
    aggregateFocusStats(startDate, endDate),
    aggregatePomodoroStats(startDate, endDate),
    aggregateFinanceStats(startDate, endDate),
  ]);

  // Generate insights
  const insights = generateInsights({
    period: { start: startDate, end: endDate, type: 'weekly' },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights: [],
  });

  return {
    period: {
      start: startDate,
      end: endDate,
      type: 'weekly',
    },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights,
  };
}

/**
 * Generate a monthly review
 */
export async function generateMonthlyReview(): Promise<ReviewData> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const startDate = monthStart.toISOString();
  const endDate = monthEnd.toISOString();

  // Aggregate all data in parallel
  const [tasks, habits, focus, pomodoro, finance] = await Promise.all([
    aggregateTaskStats(startDate, endDate),
    aggregateHabitStats(startDate, endDate),
    aggregateFocusStats(startDate, endDate),
    aggregatePomodoroStats(startDate, endDate),
    aggregateFinanceStats(startDate, endDate),
  ]);

  // Generate insights
  const insights = generateInsights({
    period: { start: startDate, end: endDate, type: 'monthly' },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights: [],
  });

  return {
    period: {
      start: startDate,
      end: endDate,
      type: 'monthly',
    },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights,
  };
}

/**
 * Generate a custom period review
 */
export async function generateCustomReview(
  startDate: string,
  endDate: string
): Promise<ReviewData> {
  // Aggregate all data in parallel
  const [tasks, habits, focus, pomodoro, finance] = await Promise.all([
    aggregateTaskStats(startDate, endDate),
    aggregateHabitStats(startDate, endDate),
    aggregateFocusStats(startDate, endDate),
    aggregatePomodoroStats(startDate, endDate),
    aggregateFinanceStats(startDate, endDate),
  ]);

  // Generate insights
  const insights = generateInsights({
    period: { start: startDate, end: endDate, type: 'custom' },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights: [],
  });

  return {
    period: {
      start: startDate,
      end: endDate,
      type: 'custom',
    },
    tasks,
    habits,
    focus,
    pomodoro,
    finance,
    insights,
  };
}
