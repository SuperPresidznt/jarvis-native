/**
 * Analytics Database Operations
 * Queries for trend data and analytics across all data types
 */

import { executeQuery } from './index';
import { getLastNDays, fillMissingDates } from '../utils/chartUtils';

/**
 * Get task completion trend for the last N days
 * @param days - Number of days to include (default: 7)
 * @returns Array of daily completion counts
 */
export async function getTaskCompletionTrend(days: number = 7): Promise<number[]> {
  try {
    const dates = getLastNDays(days);
    const oldestDate = dates[0];

    const sql = `
      SELECT DATE(completed_at) as date, COUNT(*) as count
      FROM tasks
      WHERE status = 'completed'
        AND completed_at IS NOT NULL
        AND DATE(completed_at) >= ?
      GROUP BY DATE(completed_at)
      ORDER BY date ASC
    `;

    const results = await executeQuery<{ date: string; count: number }>(sql, [oldestDate]);

    // Convert results to map for easier lookup
    const dataMap = new Map<string, number>();
    results.forEach(row => {
      dataMap.set(row.date, row.count);
    });

    // Fill in missing dates with zeros
    return fillMissingDates(dataMap, days);
  } catch (error) {
    console.error('[Analytics] Error getting task completion trend:', error);
    return Array(days).fill(0);
  }
}

/**
 * Get habit completion trend for the last N days
 * @param days - Number of days to include (default: 7)
 * @returns Array of daily completion counts
 */
export async function getHabitCompletionTrend(days: number = 7): Promise<number[]> {
  try {
    const dates = getLastNDays(days);
    const oldestDate = dates[0];

    const sql = `
      SELECT date, COUNT(*) as count
      FROM habit_logs
      WHERE completed = 1
        AND date >= ?
      GROUP BY date
      ORDER BY date ASC
    `;

    const results = await executeQuery<{ date: string; count: number }>(sql, [oldestDate]);

    // Convert results to map for easier lookup
    const dataMap = new Map<string, number>();
    results.forEach(row => {
      dataMap.set(row.date, row.count);
    });

    // Fill in missing dates with zeros
    return fillMissingDates(dataMap, days);
  } catch (error) {
    console.error('[Analytics] Error getting habit completion trend:', error);
    return Array(days).fill(0);
  }
}

/**
 * Get calendar event trend for the last N days
 * @param days - Number of days to include (default: 7)
 * @returns Array of daily event counts
 */
export async function getCalendarEventTrend(days: number = 7): Promise<number[]> {
  try {
    const dates = getLastNDays(days);
    const oldestDate = dates[0];

    const sql = `
      SELECT DATE(start_time) as date, COUNT(*) as count
      FROM calendar_events
      WHERE DATE(start_time) >= ?
      GROUP BY DATE(start_time)
      ORDER BY date ASC
    `;

    const results = await executeQuery<{ date: string; count: number }>(sql, [oldestDate]);

    // Convert results to map for easier lookup
    const dataMap = new Map<string, number>();
    results.forEach(row => {
      dataMap.set(row.date, row.count);
    });

    // Fill in missing dates with zeros
    return fillMissingDates(dataMap, days);
  } catch (error) {
    console.error('[Analytics] Error getting calendar event trend:', error);
    return Array(days).fill(0);
  }
}

/**
 * Get finance spending trend for the last N days (expenses only)
 * @param days - Number of days to include (default: 7)
 * @returns Array of daily expense amounts (in cents)
 */
export async function getFinanceSpendingTrend(days: number = 7): Promise<number[]> {
  try {
    const dates = getLastNDays(days);
    const oldestDate = dates[0];

    const sql = `
      SELECT date, SUM(amount) as total
      FROM finance_transactions
      WHERE type = 'expense'
        AND date >= ?
      GROUP BY date
      ORDER BY date ASC
    `;

    const results = await executeQuery<{ date: string; total: number }>(sql, [oldestDate]);

    // Convert results to map for easier lookup
    const dataMap = new Map<string, number>();
    results.forEach(row => {
      dataMap.set(row.date, row.total || 0);
    });

    // Fill in missing dates with zeros
    return fillMissingDates(dataMap, days);
  } catch (error) {
    console.error('[Analytics] Error getting finance spending trend:', error);
    return Array(days).fill(0);
  }
}

/**
 * Get finance transaction count trend for the last N days (all types)
 * @param days - Number of days to include (default: 7)
 * @returns Array of daily transaction counts
 */
export async function getFinanceTransactionTrend(days: number = 7): Promise<number[]> {
  try {
    const dates = getLastNDays(days);
    const oldestDate = dates[0];

    const sql = `
      SELECT date, COUNT(*) as count
      FROM finance_transactions
      WHERE date >= ?
      GROUP BY date
      ORDER BY date ASC
    `;

    const results = await executeQuery<{ date: string; count: number }>(sql, [oldestDate]);

    // Convert results to map for easier lookup
    const dataMap = new Map<string, number>();
    results.forEach(row => {
      dataMap.set(row.date, row.count);
    });

    // Fill in missing dates with zeros
    return fillMissingDates(dataMap, days);
  } catch (error) {
    console.error('[Analytics] Error getting finance transaction trend:', error);
    return Array(days).fill(0);
  }
}

/**
 * Extended trend data for detailed chart view
 * Includes 30 days of data instead of 7
 */
export interface ExtendedTrendData {
  labels: string[];
  data: number[];
}

/**
 * Get extended task completion trend (30 days)
 * @returns Trend data with labels and values
 */
export async function getExtendedTaskCompletionTrend(): Promise<ExtendedTrendData> {
  const data = await getTaskCompletionTrend(30);
  const labels = getLastNDays(30).map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  return { labels, data };
}

/**
 * Get extended habit completion trend (30 days)
 * @returns Trend data with labels and values
 */
export async function getExtendedHabitCompletionTrend(): Promise<ExtendedTrendData> {
  const data = await getHabitCompletionTrend(30);
  const labels = getLastNDays(30).map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  return { labels, data };
}

/**
 * Get extended calendar event trend (30 days)
 * @returns Trend data with labels and values
 */
export async function getExtendedCalendarEventTrend(): Promise<ExtendedTrendData> {
  const data = await getCalendarEventTrend(30);
  const labels = getLastNDays(30).map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  return { labels, data };
}

/**
 * Get extended finance spending trend (30 days)
 * @returns Trend data with labels and values
 */
export async function getExtendedFinanceSpendingTrend(): Promise<ExtendedTrendData> {
  const data = await getFinanceSpendingTrend(30);
  const labels = getLastNDays(30).map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  return { labels, data };
}

/**
 * Get dashboard sparkline data for all metrics
 * @returns Object containing trend data for all dashboard metrics
 */
export interface DashboardTrendData {
  tasks: number[];
  habits: number[];
  events: number[];
  spending: number[];
}

export async function getDashboardTrendData(days: number = 7): Promise<DashboardTrendData> {
  try {
    const [tasks, habits, events, spending] = await Promise.all([
      getTaskCompletionTrend(days),
      getHabitCompletionTrend(days),
      getCalendarEventTrend(days),
      getFinanceSpendingTrend(days),
    ]);

    return {
      tasks,
      habits,
      events,
      spending,
    };
  } catch (error) {
    console.error('[Analytics] Error getting dashboard trend data:', error);
    return {
      tasks: Array(days).fill(0),
      habits: Array(days).fill(0),
      events: Array(days).fill(0),
      spending: Array(days).fill(0),
    };
  }
}
