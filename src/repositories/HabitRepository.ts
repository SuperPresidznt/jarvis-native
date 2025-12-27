/**
 * Habit Repository
 * Wraps database operations for habits with a clean interface
 */

import type { IRepository } from './IRepository';
import * as habitDb from '../database/habits';
import type {
  Habit,
  HabitLog,
  HabitWithStats,
  HabitInsights,
  CreateHabitData,
  UpdateHabitData,
} from '../database/habits';

/**
 * Habit statistics
 */
export interface HabitStats {
  totalDays: number;
  completedDays: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Habit repository interface
 */
export interface IHabitRepository extends IRepository<Habit, CreateHabitData, UpdateHabitData> {
  // Habit log operations
  logCompletion(
    habitId: string,
    date: string,
    completed: boolean,
    notes?: string
  ): Promise<HabitLog>;
  getLog(habitId: string, date: string): Promise<HabitLog | null>;
  getLogs(habitId: string, startDate: string, endDate: string): Promise<HabitLog[]>;
  updateLogNotes(habitId: string, date: string, notes: string | null): Promise<HabitLog>;
  deleteLog(habitId: string, date: string): Promise<void>;

  // Stats and insights
  getStats(habitId: string): Promise<HabitStats>;
  getInsights(habitId: string): Promise<HabitInsights>;
  isCompletedToday(habitId: string): Promise<boolean>;
  getNotLoggedToday(): Promise<Habit[]>;

  // Optimized queries
  getAllWithStats(): Promise<HabitWithStats[]>;
  getTodayIncompleteCount(): Promise<number>;

  // Analytics
  getCompletionTimes(habitId: string, days?: number): Promise<Date[]>;
  getCompletionDates(habitId: string, days?: number): Promise<string[]>;
}

/**
 * Habit Repository Implementation
 */
class HabitRepositoryImpl implements IHabitRepository {
  async getAll(): Promise<Habit[]> {
    return habitDb.getHabits();
  }

  async getById(id: string): Promise<Habit | null> {
    return habitDb.getHabit(id);
  }

  async create(data: CreateHabitData): Promise<Habit> {
    return habitDb.createHabit(data);
  }

  async update(id: string, data: UpdateHabitData): Promise<Habit> {
    return habitDb.updateHabit(id, data);
  }

  async delete(id: string): Promise<void> {
    return habitDb.deleteHabit(id);
  }

  // Habit log operations
  async logCompletion(
    habitId: string,
    date: string,
    completed: boolean,
    notes?: string
  ): Promise<HabitLog> {
    return habitDb.logHabitCompletion(habitId, date, completed, notes);
  }

  async getLog(habitId: string, date: string): Promise<HabitLog | null> {
    return habitDb.getHabitLog(habitId, date);
  }

  async getLogs(habitId: string, startDate: string, endDate: string): Promise<HabitLog[]> {
    return habitDb.getHabitLogs(habitId, startDate, endDate);
  }

  async updateLogNotes(habitId: string, date: string, notes: string | null): Promise<HabitLog> {
    return habitDb.updateHabitLogNotes(habitId, date, notes);
  }

  async deleteLog(habitId: string, date: string): Promise<void> {
    return habitDb.deleteHabitLog(habitId, date);
  }

  // Stats and insights
  async getStats(habitId: string): Promise<HabitStats> {
    return habitDb.getHabitStats(habitId);
  }

  async getInsights(habitId: string): Promise<HabitInsights> {
    return habitDb.getHabitInsights(habitId);
  }

  async isCompletedToday(habitId: string): Promise<boolean> {
    return habitDb.isHabitCompletedToday(habitId);
  }

  async getNotLoggedToday(): Promise<Habit[]> {
    return habitDb.getHabitsNotLoggedToday();
  }

  // Optimized queries
  async getAllWithStats(): Promise<HabitWithStats[]> {
    return habitDb.getHabitsWithStats();
  }

  async getTodayIncompleteCount(): Promise<number> {
    return habitDb.getTodayIncompleteHabitsCount();
  }

  // Analytics
  async getCompletionTimes(habitId: string, days: number = 90): Promise<Date[]> {
    return habitDb.getHabitCompletionTimes(habitId, days);
  }

  async getCompletionDates(habitId: string, days: number = 30): Promise<string[]> {
    return habitDb.getHabitCompletionDates(habitId, days);
  }
}

// Singleton instance
export const HabitRepository: IHabitRepository = new HabitRepositoryImpl();

// Re-export types for convenience
export type {
  Habit,
  HabitLog,
  HabitWithStats,
  HabitInsights,
  CreateHabitData,
  UpdateHabitData,
  HabitCadence,
} from '../database/habits';
