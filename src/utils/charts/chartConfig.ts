/**
 * Chart Configuration
 * Shared configuration for all charts using Victory Native
 */

import { colors } from '../../theme';

/**
 * Base chart theme for Victory Native
 * Applied to all charts for consistent theming
 */
export const chartTheme = {
  background: colors.background.secondary,
  text: colors.text.tertiary,
  axis: {
    style: {
      axis: {
        stroke: colors.border.subtle,
        strokeWidth: 1,
      },
      tickLabels: {
        fill: colors.text.tertiary,
        fontSize: 11,
        fontFamily: 'System',
      },
      grid: {
        stroke: colors.border.subtle,
        strokeWidth: 1,
        strokeDasharray: '',
      },
    },
  },
  line: {
    stroke: colors.primary.main,
    strokeWidth: 2,
  },
  bar: {
    fill: colors.primary.main,
  },
  scatter: {
    fill: colors.background.secondary,
    stroke: colors.primary.main,
    strokeWidth: 2,
    size: 4,
  },
};

/**
 * Chart color palette
 * Used for multi-series charts, pie charts, etc.
 */
export const chartColors = {
  primary: colors.primary.main,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,

  // Extended palette for categories
  categories: [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#84CC16', // lime
  ],
};

/**
 * Get color by index for category charts
 */
export function getCategoryColor(index: number): string {
  return chartColors.categories[index % chartColors.categories.length];
}

/**
 * Chart dimensions helper
 */
export function getChartDimensions(width: number, height?: number) {
  return {
    width: width - 32, // Account for padding
    height: height || 220,
  };
}

/**
 * Format currency for chart labels
 */
export function formatChartCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format date for chart labels
 */
export function formatChartDate(date: string | Date, format: 'short' | 'month' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'month') {
    return d.toLocaleDateString('en-US', { month: 'short' });
  }

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default {
  chartTheme,
  chartColors,
  getCategoryColor,
  getChartDimensions,
  formatChartCurrency,
  formatChartDate,
};
