/**
 * Dashboard API Service
 * Handles dashboard metrics and start events
 */

import apiService from './api';

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

export interface StartEvent {
  id: string;
  timestamp: string;
  durationSec: number;
  context?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
}

export interface CreateStartEventData {
  durationSec: number;
  context?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
}

export const dashboardApi = {
  /**
   * Get today's metrics (starts, study time, cash)
   */
  getTodayMetrics: (): Promise<TodayMetrics> => {
    return apiService.get<TodayMetrics>('/api/metrics/today');
  },

  /**
   * Get user's active macro goals
   */
  getMacroGoals: (): Promise<MacroGoal[]> => {
    return apiService.get<MacroGoal[]>('/api/macro-goal');
  },

  /**
   * Create a new start event
   */
  createStartEvent: (data: CreateStartEventData): Promise<StartEvent> => {
    return apiService.post<StartEvent>('/api/start', data);
  },

  /**
   * Update a start event
   */
  updateStartEvent: (id: string, data: Partial<CreateStartEventData>): Promise<StartEvent> => {
    return apiService.patch<StartEvent>(`/api/start/${id}`, data);
  },
};

export default dashboardApi;
