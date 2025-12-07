/**
 * Tasks API Service
 * Handles task CRUD operations
 */

import apiService from './api';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  effort?: number; // 1-5 scale
  impact?: number; // 1-5 scale
  dueDate?: string;
  completedAt?: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
  priorityScore?: number | null;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  effort?: number;
  impact?: number;
  dueDate?: string;
  projectId?: string;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completedAt?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  tag?: string;
}

export const tasksApi = {
  /**
   * Get all tasks with optional filters
   */
  getTasks: (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return apiService.get<Task[]>(`/api/tasks${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single task by ID
   */
  getTask: (id: string): Promise<Task> => {
    return apiService.get<Task>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: (data: CreateTaskData): Promise<Task> => {
    return apiService.post<Task>('/api/tasks', data);
  },

  /**
   * Update a task
   */
  updateTask: (id: string, data: UpdateTaskData): Promise<Task> => {
    return apiService.patch<Task>(`/api/tasks/${id}`, data);
  },

  /**
   * Delete a task
   */
  deleteTask: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/tasks/${id}`);
  },

  /**
   * Get priority matrix data
   */
  getPriorityMatrix: (): Promise<{ [key: string]: Task[] }> => {
    return apiService.get<{ [key: string]: Task[] }>('/api/tasks/priorities');
  },
};

export default tasksApi;
