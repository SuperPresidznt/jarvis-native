/**
 * Focus Analytics Utilities
 * Calculate productivity insights and patterns from focus blocks
 */

import { FocusSession } from '../database/focusSessions';

export interface ProductiveHour {
  hour: number;
  minutes: number;
  sessions: number;
  label: string;
}

export interface FocusInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon: string;
}

export interface WeekdayStats {
  day: number;
  dayName: string;
  minutes: number;
  sessions: number;
}

/**
 * Format hour to readable label (e.g., 9 -> "9 AM", 14 -> "2 PM")
 */
export function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/**
 * Get most productive hours from hourly data
 */
export function getMostProductiveHours(
  hourlyData: Array<{ hour: number; minutes: number; sessions: number }>,
  topN: number = 3
): ProductiveHour[] {
  const sorted = [...hourlyData]
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, topN);

  return sorted.map((item) => ({
    hour: item.hour,
    minutes: item.minutes,
    sessions: item.sessions,
    label: formatHourLabel(item.hour),
  }));
}

/**
 * Calculate weekday statistics from focus blocks
 */
export function calculateWeekdayStats(blocks: FocusSession[]): WeekdayStats[] {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const stats = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    dayName: weekdays[i],
    minutes: 0,
    sessions: 0,
  }));

  blocks
    .filter((b) => b.status === 'completed' && b.startTime)
    .forEach((block) => {
      const day = new Date(block.startTime!).getDay();
      stats[day].minutes += block.actualMinutes || block.durationMinutes;
      stats[day].sessions += 1;
    });

  return stats;
}

/**
 * Get focus time for today
 */
export function getTodayFocusTime(blocks: FocusSession[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return blocks
    .filter((b) => {
      if (b.status !== 'completed' || !b.startTime) return false;
      const blockDate = new Date(b.startTime);
      blockDate.setHours(0, 0, 0, 0);
      return blockDate.getTime() === today.getTime();
    })
    .reduce((sum, b) => sum + (b.actualMinutes || b.durationMinutes), 0);
}

/**
 * Get focus time for this week
 */
export function getWeekFocusTime(blocks: FocusSession[]): number {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return blocks
    .filter((b) => {
      if (b.status !== 'completed' || !b.startTime) return false;
      const blockDate = new Date(b.startTime);
      return blockDate >= weekStart;
    })
    .reduce((sum, b) => sum + (b.actualMinutes || b.durationMinutes), 0);
}

/**
 * Get focus time for this month
 */
export function getMonthFocusTime(blocks: FocusSession[]): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return blocks
    .filter((b) => {
      if (b.status !== 'completed' || !b.startTime) return false;
      const blockDate = new Date(b.startTime);
      return blockDate >= monthStart;
    })
    .reduce((sum, b) => sum + (b.actualMinutes || b.durationMinutes), 0);
}

/**
 * Format minutes to human-readable duration
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format minutes to detailed duration string
 */
export function formatDetailedDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
}

/**
 * Generate insights from focus data
 */
export function generateInsights(
  blocks: FocusSession[],
  stats: {
    currentStreak: number;
    completionRate: number;
    avgSessionMinutes: number;
  }
): FocusInsight[] {
  const insights: FocusInsight[] = [];

  // Streak insights
  if (stats.currentStreak >= 7) {
    insights.push({
      type: 'success',
      title: `${stats.currentStreak}-Day Streak`,
      description: 'Amazing consistency! Keep the momentum going.',
      icon: 'fire',
    });
  } else if (stats.currentStreak >= 3) {
    insights.push({
      type: 'info',
      title: `${stats.currentStreak}-Day Streak`,
      description: 'Great progress! Keep building the habit.',
      icon: 'trending-up',
    });
  } else if (stats.currentStreak === 0) {
    insights.push({
      type: 'warning',
      title: 'Start a Streak',
      description: 'Complete a focus block today to begin your streak.',
      icon: 'calendar-today',
    });
  }

  // Completion rate insights
  if (stats.completionRate >= 80) {
    insights.push({
      type: 'success',
      title: 'High Completion Rate',
      description: `You complete ${stats.completionRate.toFixed(0)}% of your focus blocks.`,
      icon: 'check-circle',
    });
  } else if (stats.completionRate < 50 && blocks.length >= 5) {
    insights.push({
      type: 'warning',
      title: 'Low Completion Rate',
      description: 'Try shorter focus blocks to improve completion.',
      icon: 'alert-circle',
    });
  }

  // Session length insights
  if (stats.avgSessionMinutes >= 90) {
    insights.push({
      type: 'info',
      title: 'Deep Work Sessions',
      description: `Average ${stats.avgSessionMinutes}min sessions - excellent for flow state.`,
      icon: 'brain',
    });
  } else if (stats.avgSessionMinutes >= 45) {
    insights.push({
      type: 'success',
      title: 'Optimal Session Length',
      description: `Average ${stats.avgSessionMinutes}min - perfect for sustained focus.`,
      icon: 'timer',
    });
  } else if (stats.avgSessionMinutes < 25 && blocks.length >= 5) {
    insights.push({
      type: 'info',
      title: 'Short Focus Sessions',
      description: 'Consider trying longer 50-minute sessions for deeper work.',
      icon: 'clock',
    });
  }

  // Today's focus
  const todayMinutes = getTodayFocusTime(blocks);
  if (todayMinutes >= 120) {
    insights.push({
      type: 'success',
      title: 'Productive Day',
      description: `${formatDuration(todayMinutes)} focused today - outstanding!`,
      icon: 'trophy',
    });
  } else if (todayMinutes === 0 && blocks.length >= 3) {
    insights.push({
      type: 'info',
      title: 'Start Your Day',
      description: 'No focus time logged today. Time to dive in!',
      icon: 'sunrise',
    });
  }

  // Weekday patterns
  const weekdayStats = calculateWeekdayStats(blocks);
  const mostProductiveDay = weekdayStats.reduce((prev, curr) =>
    curr.minutes > prev.minutes ? curr : prev
  );

  if (mostProductiveDay.minutes > 0 && blocks.length >= 7) {
    insights.push({
      type: 'info',
      title: `Peak Day: ${mostProductiveDay.dayName}`,
      description: `You're most productive on ${mostProductiveDay.dayName}s.`,
      icon: 'star',
    });
  }

  return insights;
}

/**
 * Calculate 7-day trend data for sparkline
 */
export function get7DayTrend(blocks: FocusSession[]): number[] {
  const days = 7;
  const trend: number[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const dayMinutes = blocks
      .filter((b) => {
        if (b.status !== 'completed' || !b.startTime) return false;
        const blockDate = new Date(b.startTime);
        blockDate.setHours(0, 0, 0, 0);
        return blockDate.getTime() === targetDate.getTime();
      })
      .reduce((sum, b) => sum + (b.actualMinutes || b.durationMinutes), 0);

    trend.push(dayMinutes);
  }

  return trend;
}

/**
 * Get time period label for date range
 */
export function getTimePeriodLabel(days: number): string {
  if (days === 1) return 'Today';
  if (days === 7) return 'This Week';
  if (days === 30) return 'This Month';
  return `Last ${days} Days`;
}

/**
 * Check if focus block is active (in_progress and not overdue)
 */
export function isFocusSessionActive(block: FocusSession): boolean {
  if (block.status !== 'in_progress' || !block.startTime) return false;

  const startTime = new Date(block.startTime).getTime();
  const now = Date.now();
  const elapsedMinutes = (now - startTime) / (1000 * 60);

  // Consider active if not more than 50% overdue
  return elapsedMinutes <= block.durationMinutes * 1.5;
}

/**
 * Get elapsed time for active focus block
 */
export function getElapsedTime(block: FocusSession): number {
  if (block.status !== 'in_progress' || !block.startTime) return 0;

  const startTime = new Date(block.startTime).getTime();
  const now = Date.now();
  return Math.floor((now - startTime) / (1000 * 60));
}

/**
 * Get remaining time for active focus block
 */
export function getRemainingTime(block: FocusSession): number {
  const elapsed = getElapsedTime(block);
  return Math.max(0, block.durationMinutes - elapsed);
}

/**
 * Calculate focus efficiency (actual vs planned time)
 */
export function calculateEfficiency(block: FocusSession): number {
  if (block.status !== 'completed' || !block.actualMinutes) return 100;

  const efficiency = (block.actualMinutes / block.durationMinutes) * 100;
  return Math.round(efficiency);
}

export default {
  formatHourLabel,
  getMostProductiveHours,
  calculateWeekdayStats,
  getTodayFocusTime,
  getWeekFocusTime,
  getMonthFocusTime,
  formatDuration,
  formatDetailedDuration,
  generateInsights,
  get7DayTrend,
  getTimePeriodLabel,
  isFocusSessionActive,
  getElapsedTime,
  getRemainingTime,
  calculateEfficiency,
};
