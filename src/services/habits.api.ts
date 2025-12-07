/**
 * Habits API Service
 * Handles habit tracking and completions
 */

import apiService from './api';

export type HabitCadence = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  cadence: HabitCadence;
  targetCount: number;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currentStreak?: number;
  longestStreak?: number;
  completionsToday?: number;
  completionsThisWeek?: number;
  completionsThisMonth?: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  note?: string;
  createdAt: string;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  cadence?: HabitCadence;
  targetCount?: number;
  color?: string;
  icon?: string;
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
  isActive?: boolean;
}

export interface LogHabitCompletionData {
  date?: string;
  note?: string;
}

export const habitsApi = {
  /**
   * Get all habits
   */
  getHabits: (): Promise<Habit[]> => {
    return apiService.get<Habit[]>('/api/habits');
  },

  /**
   * Get a single habit by ID
   */
  getHabit: (id: string): Promise<Habit> => {
    return apiService.get<Habit>(`/api/habits/${id}`);
  },

  /**
   * Create a new habit
   */
  createHabit: (data: CreateHabitData): Promise<Habit> => {
    return apiService.post<Habit>('/api/habits', data);
  },

  /**
   * Update a habit
   */
  updateHabit: (id: string, data: UpdateHabitData): Promise<Habit> => {
    return apiService.patch<Habit>(`/api/habits/${id}`, data);
  },

  /**
   * Delete a habit
   */
  deleteHabit: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/habits/${id}`);
  },

  /**
   * Log a habit completion
   */
  logCompletion: (habitId: string, data?: LogHabitCompletionData): Promise<HabitCompletion> => {
    return apiService.post<HabitCompletion>(`/api/habits/${habitId}/complete`, data || {});
  },

  /**
   * Get habit completions for a date range
   */
  getCompletions: (habitId: string, startDate: string, endDate: string): Promise<HabitCompletion[]> => {
    return apiService.get<HabitCompletion[]>(
      `/api/habits/${habitId}/completions?start=${startDate}&end=${endDate}`
    );
  },

  /**
   * Delete a habit completion
   */
  deleteCompletion: (habitId: string, completionId: string): Promise<void> => {
    return apiService.delete<void>(`/api/habits/${habitId}/completions/${completionId}`);
  },
};

export default habitsApi;
