/**
 * Task Sorting Utilities
 * Provides intelligent task sorting based on priority, due date, and status
 */

import { PRIORITY_ORDER, type Priority } from '../constants/priorities';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';

export interface SortableTask {
  id: string;
  status: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  createdAt: string;
}

/**
 * Check if a task is overdue
 */
export function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate) return false;
  if (status === 'completed' || status === 'cancelled') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

/**
 * Get priority order value (0 = highest priority)
 */
function getPriorityValue(priority?: Priority): number {
  if (!priority) return PRIORITY_ORDER.medium;
  return PRIORITY_ORDER[priority];
}

/**
 * Sort tasks intelligently by:
 * 1. Status (active tasks before completed)
 * 2. Overdue status (overdue tasks first)
 * 3. Priority (urgent > high > medium > low)
 * 4. Due date (soonest first)
 * 5. Created date (newest first)
 */
export function sortTasks<T extends SortableTask>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // 1. Completed/cancelled tasks go last
    const aCompleted = a.status === 'completed' || a.status === 'cancelled';
    const bCompleted = b.status === 'completed' || b.status === 'cancelled';

    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    // 2. Overdue tasks first (only for active tasks)
    if (!aCompleted && !bCompleted) {
      const aOverdue = isOverdue(a.dueDate, a.status);
      const bOverdue = isOverdue(b.dueDate, b.status);

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
    }

    // 3. Priority (urgent > high > medium > low)
    const aPriority = getPriorityValue(a.priority);
    const bPriority = getPriorityValue(b.priority);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // 4. Due date (soonest first, null values last)
    if (a.dueDate && b.dueDate) {
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      if (aTime !== bTime) return aTime - bTime;
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // 5. Created date (newest first)
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });
}

/**
 * Sort tasks within a specific status group
 * (for Kanban columns)
 */
export function sortTasksByPriority<T extends SortableTask>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // 1. Overdue tasks first
    const aOverdue = isOverdue(a.dueDate, a.status);
    const bOverdue = isOverdue(b.dueDate, b.status);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // 2. Priority
    const aPriority = getPriorityValue(a.priority);
    const bPriority = getPriorityValue(b.priority);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // 3. Due date
    if (a.dueDate && b.dueDate) {
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      if (aTime !== bTime) return aTime - bTime;
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // 4. Created date (newest first)
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });
}

/**
 * Sort tasks by due date (earliest first, null dates last)
 */
export function sortByDueDate<T extends SortableTask>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // Null dates go last
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();
    return aTime - bTime;
  });
}

/**
 * Sort tasks by creation date (newest first)
 */
export function sortByCreated<T extends SortableTask>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime; // Newest first
  });
}

/**
 * Sort tasks alphabetically by title (case-insensitive)
 */
export function sortAlphabetically<T extends SortableTask>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // Extract title from SortableTask (we need to add id as a temporary key)
    const aTitle = (a as any).title || a.id;
    const bTitle = (b as any).title || b.id;
    return aTitle.localeCompare(bTitle, undefined, { sensitivity: 'base' });
  });
}

/**
 * Apply sorting based on sort field
 */
export function applySorting<T extends SortableTask>(
  tasks: T[],
  sortBy: 'priority' | 'dueDate' | 'created' | 'alphabetical'
): T[] {
  switch (sortBy) {
    case 'priority':
      return sortTasks(tasks);
    case 'dueDate':
      return sortByDueDate(tasks);
    case 'created':
      return sortByCreated(tasks);
    case 'alphabetical':
      return sortAlphabetically(tasks);
    default:
      return tasks;
  }
}

export default {
  sortTasks,
  sortTasksByPriority,
  sortByDueDate,
  sortByCreated,
  sortAlphabetically,
  applySorting,
  isOverdue,
};
