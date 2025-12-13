/**
 * Dashboard Database Operations
 * Provides offline dashboard metrics from existing data
 */

import {
  executeQuery,
  executeQuerySingle,
} from './index';
import { getAssets, getLiabilities, getFinanceSummary } from './finance';
import { getTasks } from './tasks';
import { getHabits } from './habits';

export interface TodayMetrics {
  starts: number;
  studyMinutes: number;
  cash: number | null;
  currency: string;
}

export interface MacroGoal {
  id: string;
  title: string;
  description?: string;
}

/**
 * Get today's metrics
 * Calculates metrics from existing data
 */
export async function getTodayMetrics(): Promise<TodayMetrics> {
  try {
    // For now, provide placeholder data until starts tracking is implemented
    // Get latest asset value as "cash on hand"
    const assets = await getAssets();
    const cashAsset = assets.find(a => a.type.toLowerCase().includes('cash') || a.type.toLowerCase().includes('checking'));

    return {
      starts: 0, // TODO: Implement starts tracking
      studyMinutes: 0, // TODO: Implement study time tracking
      cash: cashAsset ? cashAsset.value * 100 : null, // Convert to cents
      currency: cashAsset?.currency || 'USD',
    };
  } catch (error) {
    console.error('[Dashboard] Error getting today metrics:', error);
    return {
      starts: 0,
      studyMinutes: 0,
      cash: null,
      currency: 'USD',
    };
  }
}

/**
 * Get macro goals
 * For now returns empty array - can be implemented later
 */
export async function getMacroGoals(): Promise<MacroGoal[]> {
  // TODO: Implement macro goals table and CRUD
  return [];
}

export default {
  getTodayMetrics,
  getMacroGoals,
};
