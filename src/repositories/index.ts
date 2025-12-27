/**
 * Repository Layer
 *
 * This abstraction layer provides a clean interface over the database operations.
 * Benefits:
 * - Decouples business logic from database implementation
 * - Enables easy testing with mock repositories
 * - Future-proofs for backend swaps (SQLite -> API, etc.)
 * - Provides a consistent API across all entities
 *
 * Usage:
 * ```typescript
 * import { TaskRepository, HabitRepository } from '@/repositories';
 *
 * // Get all tasks
 * const tasks = await TaskRepository.getAll();
 *
 * // Create a new habit
 * const habit = await HabitRepository.create({ name: 'Exercise' });
 * ```
 */

// Base interface
export * from './IRepository';

// Entity repositories
export { TaskRepository } from './TaskRepository';
export type {
  ITaskRepository,
  TaskStats,
  TaskLatencyStats,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskPriority,
} from './TaskRepository';

export { HabitRepository } from './HabitRepository';
export type {
  IHabitRepository,
  HabitStats,
  Habit,
  HabitLog,
  HabitWithStats,
  HabitInsights,
  CreateHabitData,
  UpdateHabitData,
  HabitCadence,
} from './HabitRepository';

export { ProjectRepository } from './ProjectRepository';
export type {
  IProjectRepository,
  ProjectCounts,
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectStatus,
} from './ProjectRepository';

export { TransactionRepository } from './TransactionRepository';
export type {
  ITransactionRepository,
  CreateTransactionData,
  UpdateTransactionData,
  CreateAssetData,
  UpdateAssetData,
  CreateLiabilityData,
  UpdateLiabilityData,
  Transaction,
  Asset,
  Liability,
  FinanceSummary,
  TransactionType,
} from './TransactionRepository';

export { CalendarRepository } from './CalendarRepository';
export type {
  ICalendarRepository,
  CalendarEvent,
  CreateEventData,
  UpdateEventData,
  EventConflict,
} from './CalendarRepository';

export { GoalRepository } from './GoalRepository';
export type {
  IGoalRepository,
  Goal,
  GoalMilestone,
  GoalWithMilestones,
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  GoalStatus,
} from './GoalRepository';
