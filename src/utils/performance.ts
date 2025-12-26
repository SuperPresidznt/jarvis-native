/**
 * Performance Monitoring Utilities
 * Provides tools for measuring screen load times, database query times, and component render times
 */

import { Platform } from 'react-native';

/**
 * Performance mark types for different measurement categories
 */
export type PerformanceMarkType =
  | 'app-startup'
  | 'database-init'
  | 'screen-load'
  | 'database-query'
  | 'component-render';

/**
 * Performance measurement result
 */
export interface PerformanceMeasurement {
  name: string;
  type: PerformanceMarkType;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * In-memory storage for performance marks
 */
const performanceMarks = new Map<string, number>();

/**
 * In-memory storage for completed measurements
 */
const performanceMeasurements: PerformanceMeasurement[] = [];

/**
 * Maximum number of measurements to keep in memory
 */
const MAX_MEASUREMENTS = 1000;

/**
 * Whether performance logging is enabled
 * Only enabled in development mode by default
 */
let performanceLoggingEnabled = __DEV__;

/**
 * Enable or disable performance logging
 */
export function setPerformanceLogging(enabled: boolean): void {
  performanceLoggingEnabled = enabled;
}

/**
 * Check if performance logging is enabled
 */
export function isPerformanceLoggingEnabled(): boolean {
  return performanceLoggingEnabled;
}

/**
 * Create a performance mark at the start of an operation
 */
export function markStart(name: string, type: PerformanceMarkType, metadata?: Record<string, unknown>): void {
  if (!performanceLoggingEnabled) return;

  const markName = `${type}:${name}:start`;
  performanceMarks.set(markName, Date.now());

  if (__DEV__ && metadata) {
    console.log(`[Performance] Mark Start: ${name} (${type})`, metadata);
  }
}

/**
 * Create a performance mark at the end of an operation and calculate duration
 */
export function markEnd(name: string, type: PerformanceMarkType, metadata?: Record<string, unknown>): PerformanceMeasurement | null {
  if (!performanceLoggingEnabled) return null;

  const startMarkName = `${type}:${name}:start`;
  const startTime = performanceMarks.get(startMarkName);

  if (!startTime) {
    console.warn(`[Performance] No start mark found for: ${name} (${type})`);
    return null;
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  const measurement: PerformanceMeasurement = {
    name,
    type,
    duration,
    timestamp: endTime,
    metadata,
  };

  // Store measurement
  performanceMeasurements.push(measurement);

  // Keep only recent measurements
  if (performanceMeasurements.length > MAX_MEASUREMENTS) {
    performanceMeasurements.shift();
  }

  // Clean up the start mark
  performanceMarks.delete(startMarkName);

  // Log in development
  if (__DEV__) {
    const metadataStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
    console.log(`[Performance] ${type} | ${name}: ${duration}ms${metadataStr}`);
  }

  return measurement;
}

/**
 * Measure the execution time of a synchronous function
 */
export function measure<T>(
  name: string,
  type: PerformanceMarkType,
  fn: () => T,
  metadata?: Record<string, unknown>
): T {
  markStart(name, type, metadata);
  try {
    const result = fn();
    markEnd(name, type, metadata);
    return result;
  } catch (error) {
    markEnd(name, type, { ...metadata, error: true });
    throw error;
  }
}

/**
 * Measure the execution time of an async function
 */
export async function measureAsync<T>(
  name: string,
  type: PerformanceMarkType,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  markStart(name, type, metadata);
  try {
    const result = await fn();
    markEnd(name, type, metadata);
    return result;
  } catch (error) {
    markEnd(name, type, { ...metadata, error: true });
    throw error;
  }
}

/**
 * Get all performance measurements
 */
export function getAllMeasurements(): PerformanceMeasurement[] {
  return [...performanceMeasurements];
}

/**
 * Get measurements filtered by type
 */
export function getMeasurementsByType(type: PerformanceMarkType): PerformanceMeasurement[] {
  return performanceMeasurements.filter(m => m.type === type);
}

/**
 * Get measurements for a specific operation name
 */
export function getMeasurementsByName(name: string): PerformanceMeasurement[] {
  return performanceMeasurements.filter(m => m.name === name);
}

/**
 * Calculate statistics for a set of measurements
 */
export interface PerformanceStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
}

/**
 * Calculate performance statistics from measurements
 */
export function calculateStats(measurements: PerformanceMeasurement[]): PerformanceStats | null {
  if (measurements.length === 0) return null;

  const durations = measurements.map(m => m.duration).sort((a, b) => a - b);
  const sum = durations.reduce((acc, d) => acc + d, 0);

  const percentile = (p: number) => {
    const index = Math.ceil((p / 100) * durations.length) - 1;
    return durations[Math.max(0, index)];
  };

  return {
    count: durations.length,
    min: durations[0],
    max: durations[durations.length - 1],
    avg: sum / durations.length,
    median: percentile(50),
    p95: percentile(95),
    p99: percentile(99),
  };
}

/**
 * Get statistics for a specific operation type
 */
export function getStatsByType(type: PerformanceMarkType): PerformanceStats | null {
  const measurements = getMeasurementsByType(type);
  return calculateStats(measurements);
}

/**
 * Get statistics for a specific operation name
 */
export function getStatsByName(name: string): PerformanceStats | null {
  const measurements = getMeasurementsByName(name);
  return calculateStats(measurements);
}

/**
 * Clear all performance measurements
 */
export function clearMeasurements(): void {
  performanceMeasurements.length = 0;
  performanceMarks.clear();
  if (__DEV__) {
    console.log('[Performance] Cleared all measurements');
  }
}

/**
 * Generate a performance report
 */
export function generateReport(): string {
  const lines: string[] = [];
  lines.push('=== Performance Report ===');
  lines.push(`Platform: ${Platform.OS} ${Platform.Version}`);
  lines.push(`Total Measurements: ${performanceMeasurements.length}`);
  lines.push('');

  const types: PerformanceMarkType[] = [
    'app-startup',
    'database-init',
    'screen-load',
    'database-query',
    'component-render',
  ];

  for (const type of types) {
    const stats = getStatsByType(type);
    if (!stats) continue;

    lines.push(`--- ${type.toUpperCase()} ---`);
    lines.push(`Count: ${stats.count}`);
    lines.push(`Min: ${stats.min.toFixed(2)}ms`);
    lines.push(`Max: ${stats.max.toFixed(2)}ms`);
    lines.push(`Avg: ${stats.avg.toFixed(2)}ms`);
    lines.push(`Median: ${stats.median.toFixed(2)}ms`);
    lines.push(`P95: ${stats.p95.toFixed(2)}ms`);
    lines.push(`P99: ${stats.p99.toFixed(2)}ms`);
    lines.push('');
  }

  // List slowest operations
  const slowest = [...performanceMeasurements]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  if (slowest.length > 0) {
    lines.push('--- TOP 10 SLOWEST OPERATIONS ---');
    slowest.forEach((m, i) => {
      lines.push(`${i + 1}. ${m.name} (${m.type}): ${m.duration.toFixed(2)}ms`);
    });
  }

  return lines.join('\n');
}

/**
 * Log performance report to console
 */
export function logReport(): void {
  console.log(generateReport());
}

/**
 * React Hook for measuring component render performance
 * Usage:
 *   const renderMetrics = useRenderMetrics('MyComponent');
 */
export function useRenderMetrics(componentName: string) {
  // This would typically use React's useEffect to track renders
  // For now, we'll provide a manual API
  return {
    markRenderStart: () => markStart(componentName, 'component-render'),
    markRenderEnd: () => markEnd(componentName, 'component-render'),
  };
}

/**
 * Higher-order function to wrap database queries with performance tracking
 */
export function withQueryTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  queryName: string,
  queryFn: T
): T {
  return (async (...args: unknown[]) => {
    return measureAsync(queryName, 'database-query', () => queryFn(...args));
  }) as T;
}

/**
 * Export performance data as JSON for external analysis
 */
export function exportMeasurementsJSON(): string {
  return JSON.stringify({
    platform: Platform.OS,
    version: Platform.Version,
    timestamp: Date.now(),
    measurements: performanceMeasurements,
  }, null, 2);
}

export default {
  setPerformanceLogging,
  isPerformanceLoggingEnabled,
  markStart,
  markEnd,
  measure,
  measureAsync,
  getAllMeasurements,
  getMeasurementsByType,
  getMeasurementsByName,
  calculateStats,
  getStatsByType,
  getStatsByName,
  clearMeasurements,
  generateReport,
  logReport,
  useRenderMetrics,
  withQueryTracking,
  exportMeasurementsJSON,
};
