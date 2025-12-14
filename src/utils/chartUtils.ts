/**
 * Chart Utilities
 * Helper functions for chart calculations, percentage changes, and data normalization
 */

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (e.g., 12.5 for 12.5% increase)
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage change as string with sign
 * @param percentageChange - Percentage change value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "+12.5%" or "-8.0%")
 */
export function formatPercentageChange(percentageChange: number, decimals: number = 1): string {
  const sign = percentageChange > 0 ? '+' : '';
  return `${sign}${percentageChange.toFixed(decimals)}%`;
}

/**
 * Determine trend direction from percentage change
 * @param percentageChange - Percentage change value
 * @returns 'positive', 'negative', or 'neutral'
 */
export function getTrendDirection(percentageChange: number): 'positive' | 'negative' | 'neutral' {
  if (percentageChange > 0) return 'positive';
  if (percentageChange < 0) return 'negative';
  return 'neutral';
}

/**
 * Normalize data array to 0-1 range for visualization
 * @param data - Array of numbers
 * @returns Normalized array
 */
export function normalizeData(data: number[]): number[] {
  if (data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  // If all values are the same, return array of 0.5
  if (range === 0) {
    return data.map(() => 0.5);
  }

  return data.map(value => (value - min) / range);
}

/**
 * Fill missing days in trend data with zeros
 * @param days - Number of days to fill
 * @returns Array of zeros
 */
export function createEmptyTrendData(days: number): number[] {
  return Array(days).fill(0);
}

/**
 * Generate SVG path from data points for sparkline
 * @param data - Array of normalized data points (0-1)
 * @param width - Chart width
 * @param height - Chart height
 * @param padding - Padding around chart
 * @returns SVG path string
 */
export function generateSparklinePath(
  data: number[],
  width: number,
  height: number,
  padding: number = 4
): string {
  if (data.length === 0) return '';

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const stepX = chartWidth / (data.length - 1 || 1);

  // Create path points (invert Y because SVG coordinates start at top)
  const points = data.map((value, index) => {
    const x = padding + index * stepX;
    const y = padding + chartHeight * (1 - value);
    return { x, y };
  });

  // Build path string
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  return path;
}

/**
 * Generate smooth SVG path using quadratic bezier curves
 * @param data - Array of normalized data points (0-1)
 * @param width - Chart width
 * @param height - Chart height
 * @param padding - Padding around chart
 * @returns SVG path string with smooth curves
 */
export function generateSmoothSparklinePath(
  data: number[],
  width: number,
  height: number,
  padding: number = 4
): string {
  if (data.length === 0) return '';
  if (data.length === 1) {
    const x = width / 2;
    const y = padding + (height - padding * 2) * (1 - data[0]);
    return `M ${x} ${y} L ${x} ${y}`;
  }

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const stepX = chartWidth / (data.length - 1);

  // Create path points (invert Y because SVG coordinates start at top)
  const points = data.map((value, index) => {
    const x = padding + index * stepX;
    const y = padding + chartHeight * (1 - value);
    return { x, y };
  });

  // Build smooth path with quadratic bezier curves
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    const controlY = (current.y + next.y) / 2;

    path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
  }

  // Complete the path to the last point
  const lastPoint = points[points.length - 1];
  const secondLastPoint = points[points.length - 2];
  const finalControlX = (secondLastPoint.x + lastPoint.x) / 2;
  const finalControlY = (secondLastPoint.y + lastPoint.y) / 2;

  path += ` Q ${finalControlX} ${finalControlY} ${lastPoint.x} ${lastPoint.y}`;

  return path;
}

/**
 * Calculate summary statistics for trend data
 * @param data - Array of numbers
 * @returns Statistics object
 */
export interface TrendStatistics {
  min: number;
  max: number;
  average: number;
  sum: number;
  change: number;
  percentageChange: number;
}

export function calculateTrendStatistics(data: number[]): TrendStatistics {
  if (data.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      sum: 0,
      change: 0,
      percentageChange: 0,
    };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const sum = data.reduce((acc, val) => acc + val, 0);
  const average = sum / data.length;
  const first = data[0];
  const last = data[data.length - 1];
  const change = last - first;
  const percentageChange = calculatePercentageChange(last, first);

  return {
    min,
    max,
    average,
    sum,
    change,
    percentageChange,
  };
}

/**
 * Get last N days as date strings (YYYY-MM-DD)
 * @param days - Number of days
 * @returns Array of date strings, oldest first
 */
export function getLastNDays(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * Fill sparse data with zeros for missing dates
 * @param dateData - Map of date -> value
 * @param days - Number of days to include
 * @returns Array of values aligned to dates
 */
export function fillMissingDates(
  dateData: Map<string, number>,
  days: number
): number[] {
  const dates = getLastNDays(days);
  return dates.map(date => dateData.get(date) || 0);
}
