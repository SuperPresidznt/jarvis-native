/**
 * Repositories Index
 * Central export point for all repository implementations
 *
 * Usage in screens:
 *   import { useTaskRepository } from '../repositories';
 *   const taskRepo = useTaskRepository();
 *   const tasks = await taskRepo.getAll();
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { ITaskRepository, Repositories } from './interfaces';
import { SQLiteTaskRepository, taskRepository } from './TaskRepository';

// Re-export interfaces
export * from './interfaces';

// Re-export implementations
export { SQLiteTaskRepository, taskRepository } from './TaskRepository';

// ============================================================================
// Repository Context
// ============================================================================

const RepositoryContext = createContext<Repositories | null>(null);

interface RepositoryProviderProps {
  children: React.ReactNode;
  repositories?: Partial<Repositories>;
}

/**
 * Repository Provider
 * Wraps the app to provide repository instances via context
 * Allows dependency injection for testing
 */
export function RepositoryProvider({
  children,
  repositories: customRepositories,
}: RepositoryProviderProps): React.JSX.Element {
  const repositories = useMemo<Repositories>(
    () => ({
      tasks: customRepositories?.tasks || new SQLiteTaskRepository(),
      // Future repositories will be added here
      habits: customRepositories?.habits || (null as any),
      finance: customRepositories?.finance || (null as any),
      calendar: customRepositories?.calendar || (null as any),
      projects: customRepositories?.projects || (null as any),
    }),
    [customRepositories]
  );

  return React.createElement(
    RepositoryContext.Provider,
    { value: repositories },
    children
  );
}

/**
 * Hook to access all repositories
 */
export function useRepositories(): Repositories {
  const context = useContext(RepositoryContext);
  if (!context) {
    // Fallback to default implementations if not in provider
    return {
      tasks: new SQLiteTaskRepository(),
      habits: null as any,
      finance: null as any,
      calendar: null as any,
      projects: null as any,
    };
  }
  return context;
}

/**
 * Hook to access task repository
 */
export function useTaskRepository(): ITaskRepository {
  const repos = useRepositories();
  return repos.tasks;
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create repositories with custom implementations
 * Useful for testing or swapping implementations
 */
export function createRepositories(
  overrides?: Partial<Repositories>
): Repositories {
  return {
    tasks: overrides?.tasks || new SQLiteTaskRepository(),
    habits: overrides?.habits || (null as any),
    finance: overrides?.finance || (null as any),
    calendar: overrides?.calendar || (null as any),
    projects: overrides?.projects || (null as any),
  };
}

export default {
  RepositoryProvider,
  useRepositories,
  useTaskRepository,
  createRepositories,
};
