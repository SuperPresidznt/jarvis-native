/**
 * Chart Configuration
 * Shared configuration for all charts using react-native-chart-kit
 */

import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { colors } from '../../theme';

/**
 * Base chart configuration
 * Applied to all charts for consistent theming
 */
export const baseChartConfig: AbstractChartConfig = {
  backgroundColor: colors.background.secondary,
  backgroundGradientFrom: colors.background.secondary,
  backgroundGradientTo: colors.background.secondary,

  // Label colors
  color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // text.tertiary
  labelColor: (opacity = 1) => `rgba(229, 231, 235, ${opacity})`, // text.secondary

  // Data colors
  fillShadowGradientFrom: colors.primary.main,
  fillShadowGradientTo: colors.primary.main,
  fillShadowGradientFromOpacity: 0.4,
  fillShadowGradientToOpacity: 0.1,

  // Style
  strokeWidth: 2,
  barPercentage: 0.6,
  useShadowColorFromDataset: false,

  // Decorators
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: colors.primary.main,
    fill: colors.background.secondary,
  },

  propsForBackgroundLines: {
    strokeDasharray: '', // solid lines
    stroke: colors.border.subtle,
    strokeWidth: 1,
  },

  propsForLabels: {
    fontSize: 11,
    fontFamily: 'System',
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
  baseChartConfig,
  chartColors,
  getCategoryColor,
  getChartDimensions,
  formatChartCurrency,
  formatChartDate,
};
