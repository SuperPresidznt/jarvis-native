/**
 * Task Filter Store
 * Manages task filtering and sorting preferences with AsyncStorage persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type SortField = 'priority' | 'dueDate' | 'createdAt' | 'updatedAt' | 'title' | 'status' | 'sortOrder' | 'order';
export type SortDirection = 'asc' | 'desc';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskFilters {
  search?: string;
  priorities?: TaskPriority[];
  statuses?: TaskStatus[];
  projects?: string[];
  tags?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

const STORAGE_KEY = '@jarvis:taskFilters';

const defaultFilters: TaskFilters = {
  sortField: 'dueDate',
  sortDirection: 'asc',
};

let currentFilters: TaskFilters = { ...defaultFilters };
let listeners: Array<(filters: TaskFilters) => void> = [];

/**
 * Load filters from AsyncStorage
 */
export async function loadFilters(): Promise<TaskFilters> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      currentFilters = { ...defaultFilters, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('[TaskFilterStore] Error loading filters:', error);
  }
  return currentFilters;
}

/**
 * Save filters to AsyncStorage
 */
async function saveFilters(filters: TaskFilters): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('[TaskFilterStore] Error saving filters:', error);
  }
}

/**
 * Get current filters
 */
export function getFilters(): TaskFilters {
  return { ...currentFilters };
}

/**
 * Update filters
 */
export async function updateFilters(updates: Partial<TaskFilters>): Promise<TaskFilters> {
  currentFilters = { ...currentFilters, ...updates };
  await saveFilters(currentFilters);
  notifyListeners();
  return currentFilters;
}

/**
 * Clear all filters (keep sort)
 */
export async function clearFilters(): Promise<TaskFilters> {
  const { sortField, sortDirection } = currentFilters;
  currentFilters = {
    sortField,
    sortDirection,
  };
  await saveFilters(currentFilters);
  notifyListeners();
  return currentFilters;
}

/**
 * Reset to default filters
 */
export async function resetFilters(): Promise<TaskFilters> {
  currentFilters = { ...defaultFilters };
  await saveFilters(currentFilters);
  notifyListeners();
  return currentFilters;
}

/**
 * Subscribe to filter changes
 */
export function subscribe(listener: (filters: TaskFilters) => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/**
 * Notify all listeners of filter changes
 */
function notifyListeners(): void {
  listeners.forEach((listener) => listener(currentFilters));
}

/**
 * Check if any filters are active (excluding sort)
 */
export function hasActiveFilters(filters: TaskFilters): boolean {
  return !!(
    filters.search ||
    filters.priorities?.length ||
    filters.statuses?.length ||
    filters.projects?.length ||
    filters.tags?.length ||
    filters.dueDateFrom ||
    filters.dueDateTo
  );
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: TaskFilters): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.priorities?.length) count++;
  if (filters.statuses?.length) count++;
  if (filters.projects?.length) count++;
  if (filters.tags?.length) count++;
  if (filters.dueDateFrom || filters.dueDateTo) count++;
  return count;
}

export default {
  loadFilters,
  getFilters,
  updateFilters,
  clearFilters,
  resetFilters,
  subscribe,
  hasActiveFilters,
  countActiveFilters,
};
