/**
 * Task Latency Utilities
 * Calculate and format task latency metrics for tracking completion times
 */

import type { Task } from '../database/tasks';
import { colors } from '../theme';

/**
 * Calculate task latency in days (time from creation to completion)
 * @param task Task object
 * @returns Latency in days or null if not completed
 */
export function calculateTaskLatency(task: Task): number | null {
  if (!task.completedAt) return null;

  const created = new Date(task.createdAt);
  const completed = new Date(task.completedAt);

  // Handle data corruption: completed before created
  if (completed.getTime() < created.getTime()) {
    console.warn('[taskLatency] Task completed before created:', task.id);
    return 0;
  }

  const diffMs = completed.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Round to 1 decimal place
  return Math.round(diffDays * 10) / 10;
}

/**
 * Calculate task age in days (time from creation to now for incomplete tasks)
 * @param task Task object
 * @returns Age in days (0 if completed)
 */
export function calculateTaskAge(task: Task): number {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return 0;
  }

  const created = new Date(task.createdAt);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Round to 1 decimal place
  return Math.round(diffDays * 10) / 10;
}

/**
 * Format latency/age as human-readable string
 * @param days Number of days
 * @returns Formatted string (e.g., "3 days", "2 weeks", "1 month")
 */
export function formatLatency(days: number): string {
  // Handle edge cases
  if (days < 0) return 'Just now';
  if (days < 0.1) return 'Just now';

  // Less than 1 day
  if (days < 1) {
    const hours = Math.round(days * 24);
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  // 1 day
  if (days === 1) return '1 day';

  // Less than 1 week
  if (days < 7) {
    return `${Math.round(days)} days`;
  }

  // Less than 30 days (show weeks)
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  // Less than 365 days (show months)
  if (days < 365) {
    const months = Math.round(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }

  // Over a year
  const years = Math.round(days / 365);
  return years === 1 ? '1 year' : `${years} years`;
}

/**
 * Check if a task is stale (older than threshold and not completed)
 * @param task Task object
 * @param thresholdDays Number of days to consider stale (default: 7)
 * @returns True if task is stale
 */
export function isStaleTask(task: Task, thresholdDays: number = 7): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }

  const age = calculateTaskAge(task);
  return age > thresholdDays;
}

/**
 * Get color based on latency/age (for visual indicators)
 * @param days Number of days
 * @returns Color hex string
 */
export function getLatencyColor(days: number): string {
  if (days < 3) return colors.success; // Green - fast
  if (days < 7) return colors.warning; // Yellow/Orange - normal
  return colors.error; // Red - slow/stale
}

/**
 * Get latency category for grouping/filtering
 * @param days Number of days
 * @returns Category string
 */
export function getLatencyCategory(days: number): 'fast' | 'normal' | 'slow' {
  if (days < 3) return 'fast';
  if (days < 7) return 'normal';
  return 'slow';
}

/**
 * Format task age as "Created X ago" or "Completed in X"
 * @param task Task object
 * @returns Formatted string with context
 */
export function formatTaskLatencyLabel(task: Task): string {
  if (task.status === 'completed' && task.completedAt) {
    const latency = calculateTaskLatency(task);
    if (latency === null) return '';
    if (latency === 0) return 'Completed instantly';
    return `Completed in ${formatLatency(latency)}`;
  }

  const age = calculateTaskAge(task);
  if (age === 0) return 'Created just now';
  return `Created ${formatLatency(age)} ago`;
}

/**
 * Generate insight message based on latency stats
 * @param avgLatency Average latency in days
 * @param staleTasks Number of stale tasks
 * @returns Insight message string
 */
export function generateLatencyInsight(avgLatency: number, staleTasks: number): string {
  if (staleTasks > 5) {
    return `You have ${staleTasks} stale tasks. Time to tackle them!`;
  }

  if (avgLatency < 2) {
    return 'Excellent! You complete tasks quickly.';
  }

  if (avgLatency < 5) {
    return 'Good job! Your task completion is steady.';
  }

  if (avgLatency < 10) {
    return 'Tasks take a bit longer. Consider breaking them down.';
  }

  return 'Tasks are taking too long. Review your workflow.';
}
