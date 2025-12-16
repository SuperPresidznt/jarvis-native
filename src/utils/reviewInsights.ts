/**
 * Review Insights Generator
 * Analyze review data and generate actionable insights
 */

import type { ReviewData, Insight } from '../types';

/**
 * Analyze productivity trends and generate insights
 */
export function analyzeProductivityTrends(data: ReviewData): Insight[] {
  const insights: Insight[] = [];

  // Focus time insights
  if (data.focus.totalMinutes >= 600) {
    // 10+ hours
    insights.push({
      category: 'Focus',
      type: 'positive',
      message: `Outstanding deep work: ${Math.round(data.focus.totalMinutes / 60)} hours of focused sessions`,
      recommendation: 'Your focus discipline is impressive. Keep this momentum going!',
    });
  } else if (data.focus.totalMinutes < 120) {
    // < 2 hours
    insights.push({
      category: 'Focus',
      type: 'improvement',
      message: `Limited deep work sessions: only ${Math.round(data.focus.totalMinutes / 60)} hours`,
      recommendation: 'Try scheduling at least one 90-minute focus block per day.',
    });
  }

  // Pomodoro consistency
  if (data.pomodoro.averagePerDay >= 4) {
    insights.push({
      category: 'Pomodoro',
      type: 'positive',
      message: `Consistent pomodoro practice: ${data.pomodoro.averagePerDay.toFixed(1)} sessions per day`,
      recommendation: 'Your time management rhythm is solid.',
    });
  } else if (data.pomodoro.averagePerDay < 2) {
    insights.push({
      category: 'Pomodoro',
      type: 'improvement',
      message: 'Low pomodoro usage this period',
      recommendation: 'Try the pomodoro technique for focused, distraction-free work.',
    });
  }

  // Productivity hours
  if (data.focus.mostProductiveHours.length > 0) {
    const hours = data.focus.mostProductiveHours.map((h) => formatHour(h)).join(', ');
    insights.push({
      category: 'Focus',
      type: 'neutral',
      message: `Most productive hours: ${hours}`,
      recommendation: 'Schedule your most important work during these peak hours.',
    });
  }

  return insights;
}

/**
 * Identify areas where the user is excelling
 */
export function identifyStrongAreas(data: ReviewData): Insight[] {
  const insights: Insight[] = [];

  // Task completion excellence
  if (data.tasks.completionRate >= 80) {
    insights.push({
      category: 'Tasks',
      type: 'positive',
      message: `Excellent task completion: ${data.tasks.completionRate}% completion rate`,
      recommendation: 'Your execution is on point. Keep up the great work!',
    });
  }

  // Habit consistency
  if (data.habits.averageStreak >= 7) {
    insights.push({
      category: 'Habits',
      type: 'positive',
      message: `Great habit consistency! Average streak: ${data.habits.averageStreak} days`,
      recommendation: 'Your habits are becoming second nature.',
    });
  }

  if (data.habits.completionRate >= 80) {
    insights.push({
      category: 'Habits',
      type: 'positive',
      message: `Strong habit adherence: ${data.habits.completionRate}% completion rate`,
    });
  }

  // Financial discipline
  if (data.finance.netCashFlow > 0) {
    insights.push({
      category: 'Finance',
      type: 'positive',
      message: `Positive cash flow: +$${data.finance.netCashFlow.toFixed(2)}`,
      recommendation: 'Great financial management this period!',
    });
  }

  if (data.finance.budgetAdherence >= 80) {
    insights.push({
      category: 'Finance',
      type: 'positive',
      message: `Excellent budget adherence: ${data.finance.budgetAdherence}%`,
      recommendation: 'You are staying within your budget targets.',
    });
  }

  // Pomodoro completion
  if (data.pomodoro.completionRate >= 85) {
    insights.push({
      category: 'Pomodoro',
      type: 'positive',
      message: `High pomodoro completion: ${data.pomodoro.completionRate}%`,
      recommendation: 'You are finishing what you start.',
    });
  }

  return insights;
}

/**
 * Identify areas that need improvement
 */
export function identifyImprovementAreas(data: ReviewData): Insight[] {
  const insights: Insight[] = [];

  // Task completion issues
  if (data.tasks.completionRate < 50) {
    insights.push({
      category: 'Tasks',
      type: 'improvement',
      message: `Low task completion: ${data.tasks.completionRate}% completion rate`,
      recommendation: 'Break large tasks into smaller, manageable pieces.',
    });
  }

  // Task latency issues
  if (data.tasks.averageLatency > 7) {
    insights.push({
      category: 'Tasks',
      type: 'improvement',
      message: `High task latency: ${data.tasks.averageLatency.toFixed(1)} days average`,
      recommendation: 'Tasks are sitting too long. Set realistic due dates and review daily.',
    });
  }

  // Habit consistency issues
  if (data.habits.completionRate < 50) {
    insights.push({
      category: 'Habits',
      type: 'improvement',
      message: `Low habit completion: ${data.habits.completionRate}% completion rate`,
      recommendation: 'Start with just one or two keystone habits and build from there.',
    });
  }

  // Financial concerns
  if (data.finance.netCashFlow < 0) {
    insights.push({
      category: 'Finance',
      type: 'improvement',
      message: `Negative cash flow: -$${Math.abs(data.finance.netCashFlow).toFixed(2)}`,
      recommendation: 'Review your spending in high-cost categories and adjust budgets.',
    });
  }

  if (data.finance.budgetAdherence < 50) {
    insights.push({
      category: 'Finance',
      type: 'improvement',
      message: `Budget overspending: ${data.finance.budgetAdherence}% adherence`,
      recommendation: 'Review and adjust your budget categories to be more realistic.',
    });
  }

  // Pomodoro completion issues
  if (data.pomodoro.completionRate < 60 && data.pomodoro.totalPomodoros > 0) {
    insights.push({
      category: 'Pomodoro',
      type: 'improvement',
      message: `Low pomodoro completion: ${data.pomodoro.completionRate}%`,
      recommendation: 'Many sessions are being abandoned. Try shorter work intervals.',
    });
  }

  return insights;
}

/**
 * Generate a motivational message based on performance
 */
export function generateMotivationalMessage(data: ReviewData): Insight {
  const strongAreas = identifyStrongAreas(data).length;
  const improvementAreas = identifyImprovementAreas(data).length;

  if (strongAreas >= 3 && improvementAreas === 0) {
    return {
      category: 'Overall',
      type: 'positive',
      message: 'Outstanding performance across all areas!',
      recommendation:
        'You are crushing it! Keep this momentum and consider setting even bigger goals.',
    };
  }

  if (strongAreas > improvementAreas) {
    return {
      category: 'Overall',
      type: 'positive',
      message: 'Strong performance with room for growth',
      recommendation:
        'You are doing well! Focus on your improvement areas to level up even more.',
    };
  }

  if (improvementAreas > strongAreas) {
    return {
      category: 'Overall',
      type: 'improvement',
      message: 'Opportunities for growth identified',
      recommendation:
        'Progress takes time. Pick one area to focus on this week and build from there.',
    };
  }

  return {
    category: 'Overall',
    type: 'neutral',
    message: 'Balanced performance',
    recommendation: 'You are making steady progress. Keep pushing forward!',
  };
}

/**
 * Generate all insights from review data
 */
export function generateInsights(data: ReviewData): Insight[] {
  const insights: Insight[] = [];

  // Add productivity trends
  insights.push(...analyzeProductivityTrends(data));

  // Add strong areas
  insights.push(...identifyStrongAreas(data));

  // Add improvement areas
  insights.push(...identifyImprovementAreas(data));

  // Add motivational message
  insights.push(generateMotivationalMessage(data));

  // Sort insights: positive first, then neutral, then improvement
  const sortOrder: Record<string, number> = { positive: 1, neutral: 2, improvement: 3 };
  insights.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

  return insights;
}

/**
 * Format hour (0-23) to readable time
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}
