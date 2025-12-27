/**
 * Goals Database Operations
 * CRUD operations for goals and goal milestones
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
  executeTransaction,
} from './index';
import {
  createGoalSchema,
  updateGoalSchema,
  createMilestoneSchema,
  validateOrThrow,
} from '../validation';

// ============================================================================
// Types
// ============================================================================

export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[];
  progress: number; // 0-100 percentage
  completedCount: number;
  totalCount: number;
}

export interface CreateGoalInput {
  name: string;
  description?: string;
  targetDate?: string;
}

export interface UpdateGoalInput {
  name?: string;
  description?: string;
  targetDate?: string;
  status?: GoalStatus;
}

export interface CreateMilestoneInput {
  goalId: string;
  title: string;
  sortOrder?: number;
}

// Database row types (snake_case from SQLite)
interface GoalRow {
  id: string;
  name: string;
  description: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  synced: number;
}

interface MilestoneRow {
  id: string;
  goal_id: string;
  title: string;
  completed: number;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Row Converters
// ============================================================================

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    targetDate: row.target_date ?? undefined,
    status: row.status as GoalStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    synced: row.synced === 1,
  };
}

function rowToMilestone(row: MilestoneRow): GoalMilestone {
  return {
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    completed: row.completed === 1,
    completedAt: row.completed_at ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// Goal CRUD Operations
// ============================================================================

/**
 * Create a new goal
 */
export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  // Validate input
  const validated = validateOrThrow(createGoalSchema, input);

  const id = generateId();
  const now = getCurrentTimestamp();

  const sql = `
    INSERT INTO goals (id, name, description, target_date, status, created_at, updated_at, synced)
    VALUES (?, ?, ?, ?, 'active', ?, ?, 0)
  `;

  await executeWrite(sql, [
    id,
    validated.name,
    validated.description ?? null,
    validated.targetDate ?? null,
    now,
    now,
  ]);

  return {
    id,
    name: validated.name,
    description: validated.description,
    targetDate: validated.targetDate,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    synced: false,
  };
}

/**
 * Get a single goal by ID
 */
export async function getGoal(id: string): Promise<Goal | null> {
  const sql = 'SELECT * FROM goals WHERE id = ?';
  const row = await executeQuerySingle<GoalRow>(sql, [id]);
  return row ? rowToGoal(row) : null;
}

/**
 * Get all goals (optionally filtered by status)
 */
export async function getAllGoals(status?: GoalStatus): Promise<Goal[]> {
  let sql = 'SELECT * FROM goals';
  const params: string[] = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = await executeQuery<GoalRow>(sql, params);
  return rows.map(rowToGoal);
}

/**
 * Update a goal
 */
export async function updateGoal(id: string, input: UpdateGoalInput): Promise<Goal | null> {
  // Validate input
  const validated = validateOrThrow(updateGoalSchema, input);

  const now = getCurrentTimestamp();
  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (validated.name !== undefined) {
    updates.push('name = ?');
    params.push(validated.name);
  }
  if (validated.description !== undefined) {
    updates.push('description = ?');
    params.push(validated.description ?? null);
  }
  if (validated.targetDate !== undefined) {
    updates.push('target_date = ?');
    params.push(validated.targetDate ?? null);
  }
  if (validated.status !== undefined) {
    updates.push('status = ?');
    params.push(validated.status);
  }

  if (updates.length === 0) {
    return getGoal(id);
  }

  updates.push('updated_at = ?');
  params.push(now);
  params.push(id);

  const sql = `UPDATE goals SET ${updates.join(', ')} WHERE id = ?`;
  await executeWrite(sql, params);

  return getGoal(id);
}

/**
 * Delete a goal (cascades to milestones)
 */
export async function deleteGoal(id: string): Promise<void> {
  const sql = 'DELETE FROM goals WHERE id = ?';
  await executeWrite(sql, [id]);
}

// ============================================================================
// Milestone CRUD Operations
// ============================================================================

/**
 * Create a new milestone
 */
export async function createMilestone(input: CreateMilestoneInput): Promise<GoalMilestone> {
  // Validate input
  const validated = validateOrThrow(createMilestoneSchema, input);

  const id = generateId();
  const now = getCurrentTimestamp();

  // Get the max sort_order for this goal
  const maxOrderResult = await executeQuerySingle<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM goal_milestones WHERE goal_id = ?',
    [validated.goalId]
  );
  const sortOrder = validated.sortOrder ?? ((maxOrderResult?.max_order ?? -1) + 1);

  const sql = `
    INSERT INTO goal_milestones (id, goal_id, title, completed, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, 0, ?, ?, ?)
  `;

  await executeWrite(sql, [id, validated.goalId, validated.title, sortOrder, now, now]);

  return {
    id,
    goalId: validated.goalId,
    title: validated.title,
    completed: false,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get all milestones for a goal
 */
export async function getMilestones(goalId: string): Promise<GoalMilestone[]> {
  const sql = 'SELECT * FROM goal_milestones WHERE goal_id = ? ORDER BY sort_order ASC';
  const rows = await executeQuery<MilestoneRow>(sql, [goalId]);
  return rows.map(rowToMilestone);
}

/**
 * Toggle milestone completion
 */
export async function toggleMilestone(id: string): Promise<GoalMilestone | null> {
  const now = getCurrentTimestamp();

  // Get current state
  const current = await executeQuerySingle<MilestoneRow>(
    'SELECT * FROM goal_milestones WHERE id = ?',
    [id]
  );

  if (!current) return null;

  const newCompleted = current.completed === 0 ? 1 : 0;
  const completedAt = newCompleted === 1 ? now : null;

  const sql = `
    UPDATE goal_milestones
    SET completed = ?, completed_at = ?, updated_at = ?
    WHERE id = ?
  `;

  await executeWrite(sql, [newCompleted, completedAt, now, id]);

  return {
    id: current.id,
    goalId: current.goal_id,
    title: current.title,
    completed: newCompleted === 1,
    completedAt: completedAt ?? undefined,
    sortOrder: current.sort_order,
    createdAt: current.created_at,
    updatedAt: now,
  };
}

/**
 * Update a milestone title
 */
export async function updateMilestone(id: string, title: string): Promise<GoalMilestone | null> {
  const now = getCurrentTimestamp();

  const sql = `
    UPDATE goal_milestones
    SET title = ?, updated_at = ?
    WHERE id = ?
  `;

  await executeWrite(sql, [title, now, id]);

  const row = await executeQuerySingle<MilestoneRow>(
    'SELECT * FROM goal_milestones WHERE id = ?',
    [id]
  );

  return row ? rowToMilestone(row) : null;
}

/**
 * Delete a milestone
 */
export async function deleteMilestone(id: string): Promise<void> {
  const sql = 'DELETE FROM goal_milestones WHERE id = ?';
  await executeWrite(sql, [id]);
}

/**
 * Reorder milestones
 */
export async function reorderMilestones(
  goalId: string,
  milestoneIds: string[]
): Promise<void> {
  const now = getCurrentTimestamp();
  const queries = milestoneIds.map((id, index) => ({
    sql: 'UPDATE goal_milestones SET sort_order = ?, updated_at = ? WHERE id = ? AND goal_id = ?',
    params: [index, now, id, goalId],
  }));

  await executeTransaction(queries);
}

// ============================================================================
// Combined Operations
// ============================================================================

/**
 * Get a goal with all its milestones and progress
 */
export async function getGoalWithMilestones(id: string): Promise<GoalWithMilestones | null> {
  const goal = await getGoal(id);
  if (!goal) return null;

  const milestones = await getMilestones(id);
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    ...goal,
    milestones,
    progress,
    completedCount,
    totalCount,
  };
}

/**
 * Get all goals with their milestones and progress
 */
export async function getAllGoalsWithMilestones(
  status?: GoalStatus
): Promise<GoalWithMilestones[]> {
  const goals = await getAllGoals(status);

  const goalsWithMilestones = await Promise.all(
    goals.map(async (goal) => {
      const milestones = await getMilestones(goal.id);
      const completedCount = milestones.filter((m) => m.completed).length;
      const totalCount = milestones.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        ...goal,
        milestones,
        progress,
        completedCount,
        totalCount,
      };
    })
  );

  return goalsWithMilestones;
}

/**
 * Mark a goal as completed (also marks all milestones as complete)
 */
export async function completeGoal(id: string): Promise<Goal | null> {
  const now = getCurrentTimestamp();

  // Mark all milestones as completed
  await executeWrite(
    `UPDATE goal_milestones
     SET completed = 1, completed_at = ?, updated_at = ?
     WHERE goal_id = ? AND completed = 0`,
    [now, now, id]
  );

  // Mark goal as completed
  return updateGoal(id, { status: 'completed' });
}

export default {
  // Goal operations
  createGoal,
  getGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
  completeGoal,

  // Milestone operations
  createMilestone,
  getMilestones,
  toggleMilestone,
  updateMilestone,
  deleteMilestone,
  reorderMilestones,

  // Combined operations
  getGoalWithMilestones,
  getAllGoalsWithMilestones,
};
