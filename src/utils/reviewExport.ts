/**
 * Review Export Utilities
 * Export reviews in various formats (text, markdown, JSON)
 */

import { documentDirectory, writeAsStringAsync } from 'expo-file-system/build/legacy/FileSystem';
import * as Sharing from 'expo-sharing';
import type { ReviewData, Review } from '../types';

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format duration in minutes to readable format
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

/**
 * Export review as plain text
 */
export function exportAsText(review: Review): string {
  const { data } = review;
  const { period, tasks, habits, focus, pomodoro, finance, insights } = data;

  let text = '';
  text += `${'='.repeat(60)}\n`;
  text += `PRODUCTIVITY REVIEW\n`;
  text += `${formatDate(period.start)} - ${formatDate(period.end)}\n`;
  text += `${'='.repeat(60)}\n\n`;

  // Tasks Section
  text += `TASKS\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `  Completed: ${tasks.completed}\n`;
  text += `  Created: ${tasks.created}\n`;
  text += `  Completion Rate: ${tasks.completionRate}%\n`;
  text += `  Average Latency: ${tasks.averageLatency.toFixed(1)} days\n`;

  if (Object.keys(tasks.byPriority).length > 0) {
    text += `\n  By Priority:\n`;
    Object.entries(tasks.byPriority).forEach(([priority, count]) => {
      text += `    ${priority}: ${count}\n`;
    });
  }

  if (Object.keys(tasks.byProject).length > 0) {
    text += `\n  By Project:\n`;
    Object.entries(tasks.byProject).forEach(([project, count]) => {
      text += `    ${project}: ${count}\n`;
    });
  }
  text += `\n`;

  // Habits Section
  text += `HABITS\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `  Total Completions: ${habits.totalCompletions}\n`;
  text += `  Average Streak: ${habits.averageStreak} days\n`;
  text += `  Best Streak: ${habits.bestStreak} days\n`;
  text += `  Completion Rate: ${habits.completionRate}%\n`;

  if (habits.byHabit.length > 0) {
    text += `\n  Top Habits:\n`;
    habits.byHabit.slice(0, 5).forEach((habit) => {
      text += `    ${habit.name}: ${habit.completions} completions (${habit.streak} day streak)\n`;
    });
  }
  text += `\n`;

  // Focus Sessions Section
  text += `FOCUS SESSIONS\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `  Total Sessions: ${focus.totalSessions}\n`;
  text += `  Total Time: ${formatDuration(focus.totalMinutes)}\n`;
  text += `  Average Session: ${formatDuration(focus.averageSessionLength)}\n`;

  if (focus.mostProductiveHours.length > 0) {
    text += `  Most Productive Hours: ${focus.mostProductiveHours.join(', ')}\n`;
  }

  if (focus.byTask.length > 0) {
    text += `\n  Top Tasks:\n`;
    focus.byTask.slice(0, 5).forEach((task) => {
      text += `    ${task.taskName}: ${formatDuration(task.minutes)}\n`;
    });
  }
  text += `\n`;

  // Pomodoros Section
  text += `POMODORO SESSIONS\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `  Total Completed: ${pomodoro.totalPomodoros}\n`;
  text += `  Total Time: ${formatDuration(pomodoro.totalMinutes)}\n`;
  text += `  Completion Rate: ${pomodoro.completionRate}%\n`;
  text += `  Average Per Day: ${pomodoro.averagePerDay.toFixed(1)}\n`;

  if (pomodoro.mostProductiveHours.length > 0) {
    text += `  Most Productive Hours: ${pomodoro.mostProductiveHours.join(', ')}\n`;
  }
  text += `\n`;

  // Finance Section
  text += `FINANCES\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `  Income: ${formatCurrency(finance.totalIncome)}\n`;
  text += `  Expenses: ${formatCurrency(finance.totalExpenses)}\n`;
  text += `  Net Cash Flow: ${finance.netCashFlow >= 0 ? '+' : ''}${formatCurrency(finance.netCashFlow)}\n`;
  text += `  Budget Adherence: ${finance.budgetAdherence}%\n`;

  if (Object.keys(finance.byCategory).length > 0) {
    text += `\n  By Category:\n`;
    Object.entries(finance.byCategory)
      .slice(0, 5)
      .forEach(([category, amount]) => {
        text += `    ${category}: ${formatCurrency(amount)}\n`;
      });
  }
  text += `\n`;

  // Insights Section
  text += `INSIGHTS & RECOMMENDATIONS\n`;
  text += `${'─'.repeat(60)}\n`;
  insights.forEach((insight, i) => {
    const icon = insight.type === 'positive' ? '✓' : insight.type === 'improvement' ? '!' : '·';
    text += `  ${icon} [${insight.category}] ${insight.message}\n`;
    if (insight.recommendation) {
      text += `     → ${insight.recommendation}\n`;
    }
    if (i < insights.length - 1) text += `\n`;
  });

  text += `\n${'='.repeat(60)}\n`;
  text += `Generated on ${formatDate(new Date().toISOString())}\n`;

  return text;
}

/**
 * Export review as markdown
 */
export function exportAsMarkdown(review: Review): string {
  const { data } = review;
  const { period, tasks, habits, focus, pomodoro, finance, insights } = data;

  let md = '';
  md += `# Productivity Review\n\n`;
  md += `**Period:** ${formatDate(period.start)} - ${formatDate(period.end)}\n\n`;
  md += `---\n\n`;

  // Tasks Section
  md += `## 📋 Tasks\n\n`;
  md += `- **Completed:** ${tasks.completed}\n`;
  md += `- **Created:** ${tasks.created}\n`;
  md += `- **Completion Rate:** ${tasks.completionRate}%\n`;
  md += `- **Average Latency:** ${tasks.averageLatency.toFixed(1)} days\n\n`;

  if (Object.keys(tasks.byPriority).length > 0) {
    md += `### By Priority\n\n`;
    Object.entries(tasks.byPriority).forEach(([priority, count]) => {
      md += `- **${priority}:** ${count}\n`;
    });
    md += `\n`;
  }

  if (Object.keys(tasks.byProject).length > 0) {
    md += `### By Project\n\n`;
    Object.entries(tasks.byProject).forEach(([project, count]) => {
      md += `- **${project}:** ${count}\n`;
    });
    md += `\n`;
  }

  // Habits Section
  md += `## ✅ Habits\n\n`;
  md += `- **Total Completions:** ${habits.totalCompletions}\n`;
  md += `- **Average Streak:** ${habits.averageStreak} days\n`;
  md += `- **Best Streak:** ${habits.bestStreak} days\n`;
  md += `- **Completion Rate:** ${habits.completionRate}%\n\n`;

  if (habits.byHabit.length > 0) {
    md += `### Top Habits\n\n`;
    md += `| Habit | Completions | Streak |\n`;
    md += `|-------|-------------|--------|\n`;
    habits.byHabit.slice(0, 5).forEach((habit) => {
      md += `| ${habit.name} | ${habit.completions} | ${habit.streak} days |\n`;
    });
    md += `\n`;
  }

  // Focus Sessions Section
  md += `## 🎯 Focus Sessions\n\n`;
  md += `- **Total Sessions:** ${focus.totalSessions}\n`;
  md += `- **Total Time:** ${formatDuration(focus.totalMinutes)}\n`;
  md += `- **Average Session:** ${formatDuration(focus.averageSessionLength)}\n`;

  if (focus.mostProductiveHours.length > 0) {
    md += `- **Most Productive Hours:** ${focus.mostProductiveHours.join(', ')}\n`;
  }
  md += `\n`;

  if (focus.byTask.length > 0) {
    md += `### Top Tasks\n\n`;
    md += `| Task | Time Spent |\n`;
    md += `|------|------------|\n`;
    focus.byTask.slice(0, 5).forEach((task) => {
      md += `| ${task.taskName} | ${formatDuration(task.minutes)} |\n`;
    });
    md += `\n`;
  }

  // Pomodoros Section
  md += `## 🍅 Pomodoro Sessions\n\n`;
  md += `- **Total Completed:** ${pomodoro.totalPomodoros}\n`;
  md += `- **Total Time:** ${formatDuration(pomodoro.totalMinutes)}\n`;
  md += `- **Completion Rate:** ${pomodoro.completionRate}%\n`;
  md += `- **Average Per Day:** ${pomodoro.averagePerDay.toFixed(1)}\n`;

  if (pomodoro.mostProductiveHours.length > 0) {
    md += `- **Most Productive Hours:** ${pomodoro.mostProductiveHours.join(', ')}\n`;
  }
  md += `\n`;

  // Finance Section
  md += `## 💰 Finances\n\n`;
  md += `- **Income:** ${formatCurrency(finance.totalIncome)}\n`;
  md += `- **Expenses:** ${formatCurrency(finance.totalExpenses)}\n`;
  md += `- **Net Cash Flow:** ${finance.netCashFlow >= 0 ? '+' : ''}${formatCurrency(finance.netCashFlow)}\n`;
  md += `- **Budget Adherence:** ${finance.budgetAdherence}%\n\n`;

  if (Object.keys(finance.byCategory).length > 0) {
    md += `### Top Categories\n\n`;
    md += `| Category | Amount |\n`;
    md += `|----------|--------|\n`;
    Object.entries(finance.byCategory)
      .slice(0, 5)
      .forEach(([category, amount]) => {
        md += `| ${category} | ${formatCurrency(amount)} |\n`;
      });
    md += `\n`;
  }

  // Insights Section
  md += `## 💡 Insights & Recommendations\n\n`;
  insights.forEach((insight) => {
    const icon = insight.type === 'positive' ? '✅' : insight.type === 'improvement' ? '⚠️' : 'ℹ️';
    md += `### ${icon} ${insight.category}\n\n`;
    md += `${insight.message}\n\n`;
    if (insight.recommendation) {
      md += `> **Recommendation:** ${insight.recommendation}\n\n`;
    }
  });

  md += `---\n\n`;
  md += `*Generated on ${formatDate(new Date().toISOString())}*\n`;

  return md;
}

/**
 * Export review as JSON
 */
export function exportAsJSON(review: Review): string {
  return JSON.stringify(review, null, 2);
}

/**
 * Share review via system share sheet
 */
export async function shareReview(
  review: Review,
  format: 'text' | 'markdown' | 'json'
): Promise<void> {
  let content: string;
  let filename: string;
  let mimeType: string;

  const dateStr = formatDate(review.periodStart).replace(/\s/g, '_');

  if (format === 'text') {
    content = exportAsText(review);
    filename = `review_${dateStr}.txt`;
    mimeType = 'text/plain';
  } else if (format === 'markdown') {
    content = exportAsMarkdown(review);
    filename = `review_${dateStr}.md`;
    mimeType = 'text/markdown';
  } else {
    content = exportAsJSON(review);
    filename = `review_${dateStr}.json`;
    mimeType = 'application/json';
  }

  // Write to file system
  const fileUri = `${documentDirectory || ''}${filename}`;
  await writeAsStringAsync(fileUri, content);

  // Check if sharing is available
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  // Share
  await Sharing.shareAsync(fileUri, {
    mimeType,
    dialogTitle: 'Export Review',
    UTI: mimeType,
  });
}

/**
 * Save review to file system
 */
export async function saveReviewToFile(
  review: Review,
  format: 'text' | 'markdown' | 'json'
): Promise<string> {
  let content: string;
  let filename: string;

  const dateStr = formatDate(review.periodStart).replace(/\s/g, '_');

  if (format === 'text') {
    content = exportAsText(review);
    filename = `review_${dateStr}.txt`;
  } else if (format === 'markdown') {
    content = exportAsMarkdown(review);
    filename = `review_${dateStr}.md`;
  } else {
    content = exportAsJSON(review);
    filename = `review_${dateStr}.json`;
  }

  const fileUri = `${documentDirectory || ''}${filename}`;
  await writeAsStringAsync(fileUri, content);

  return fileUri;
}
