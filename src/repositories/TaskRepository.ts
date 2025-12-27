/**
 * Task Repository
 * Wraps database operations for tasks with a clean interface
 */

import * as taskDb from '../database/tasks';
import type { Task, CreateTaskData, UpdateTaskData, TaskPriority } from '../database/tasks';
import type { TaskFilters } from '../store/taskFilterStore';

/**
 * Task statistics type
 */
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  blocked: number;
}

/**
 * Task latency statistics
 */
export interface TaskLatencyStats {
  overall: number;
  staleCount: number;
  byPriority: {
    priority: TaskPriority;
    avgDays: number;
    count: number;
  }[];
  byProject: {
    projectId: string;
    projectName: string;
    avgDays: number;
    count: number;
  }[];
}

/**
 * Task repository interface
 * Combines CRUD, filtering, and stats operations
 */
export interface ITaskRepository {
  // Core CRUD operations
  getAll(filters?: TaskFilters): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(data: CreateTaskData): Promise<Task>;
  update(id: string, data: UpdateTaskData): Promise<Task>;
  delete(id: string): Promise<void>;

  // Stats
  getStats(): Promise<TaskStats>;

  // Additional task-specific methods
  getByProject(projectId: string): Promise<Task[]>;
  getUnsynced(): Promise<Task[]>;
  markSynced(id: string): Promise<void>;
  getActiveCount(): Promise<number>;
  bulkUpdate(ids: string[], data: UpdateTaskData): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
  bulkComplete(ids: string[]): Promise<void>;
  reorder(ids: string[]): Promise<void>;

  // Analytics methods
  getStaleTasks(thresholdDays?: number): Promise<Task[]>;
  getLatencyStats(): Promise<TaskLatencyStats>;
  getLatencyTrendSparkline(): Promise<number[]>;
}

/**
 * Task Repository Implementation
 * Wraps the existing database functions
 */
class TaskRepositoryImpl implements ITaskRepository {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    return taskDb.getTasks(filters);
  }

  async getById(id: string): Promise<Task | null> {
    return taskDb.getTask(id);
  }

  async create(data: CreateTaskData): Promise<Task> {
    return taskDb.createTask(data);
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    return taskDb.updateTask(id, data);
  }

  async delete(id: string): Promise<void> {
    return taskDb.deleteTask(id);
  }

  async getStats(): Promise<TaskStats> {
    return taskDb.getTaskStats();
  }

  async getByProject(projectId: string): Promise<Task[]> {
    return taskDb.getTasksByProject(projectId);
  }

  async getUnsynced(): Promise<Task[]> {
    return taskDb.getUnsyncedTasks();
  }

  async markSynced(id: string): Promise<void> {
    return taskDb.markTaskSynced(id);
  }

  async getActiveCount(): Promise<number> {
    return taskDb.getActiveTasksCount();
  }

  async bulkUpdate(ids: string[], data: UpdateTaskData): Promise<void> {
    return taskDb.bulkUpdateTasks(ids, data);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return taskDb.bulkDeleteTasks(ids);
  }

  async bulkComplete(ids: string[]): Promise<void> {
    return taskDb.bulkCompleteTasks(ids);
  }

  async reorder(ids: string[]): Promise<void> {
    return taskDb.reorderTasks(ids);
  }

  async getStaleTasks(thresholdDays: number = 7): Promise<Task[]> {
    return taskDb.getStaleTasks(thresholdDays);
  }

  async getLatencyStats(): Promise<TaskLatencyStats> {
    return taskDb.getCompletionLatencyStats();
  }

  async getLatencyTrendSparkline(): Promise<number[]> {
    return taskDb.getLatencyTrendSparkline();
  }
}

// Singleton instance
export const TaskRepository: ITaskRepository = new TaskRepositoryImpl();

// Re-export types for convenience
export type { Task, CreateTaskData, UpdateTaskData, TaskPriority } from '../database/tasks';
