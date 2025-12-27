/**
 * Goal Repository
 * Wraps database operations for goals and milestones with a clean interface
 */

import type { IRepository } from './IRepository';
import * as goalDb from '../database/goals';
import type {
  Goal,
  GoalMilestone,
  GoalWithMilestones,
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  GoalStatus,
} from '../database/goals';

/**
 * Goal repository interface
 */
export interface IGoalRepository extends IRepository<Goal, CreateGoalInput, UpdateGoalInput> {
  // Filtered queries
  getAll(status?: GoalStatus): Promise<Goal[]>;
  getAllWithMilestones(status?: GoalStatus): Promise<GoalWithMilestones[]>;
  getWithMilestones(id: string): Promise<GoalWithMilestones | null>;

  // Goal operations
  complete(id: string): Promise<Goal | null>;

  // Milestone operations
  createMilestone(input: CreateMilestoneInput): Promise<GoalMilestone>;
  getMilestones(goalId: string): Promise<GoalMilestone[]>;
  toggleMilestone(id: string): Promise<GoalMilestone | null>;
  updateMilestone(id: string, title: string): Promise<GoalMilestone | null>;
  deleteMilestone(id: string): Promise<void>;
  reorderMilestones(goalId: string, milestoneIds: string[]): Promise<void>;
}

/**
 * Goal Repository Implementation
 */
class GoalRepositoryImpl implements IGoalRepository {
  async getAll(status?: GoalStatus): Promise<Goal[]> {
    return goalDb.getAllGoals(status);
  }

  async getById(id: string): Promise<Goal | null> {
    return goalDb.getGoal(id);
  }

  async create(data: CreateGoalInput): Promise<Goal> {
    return goalDb.createGoal(data);
  }

  async update(id: string, data: UpdateGoalInput): Promise<Goal> {
    const result = await goalDb.updateGoal(id, data);
    if (!result) {
      throw new Error('Goal not found');
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    return goalDb.deleteGoal(id);
  }

  async getAllWithMilestones(status?: GoalStatus): Promise<GoalWithMilestones[]> {
    return goalDb.getAllGoalsWithMilestones(status);
  }

  async getWithMilestones(id: string): Promise<GoalWithMilestones | null> {
    return goalDb.getGoalWithMilestones(id);
  }

  async complete(id: string): Promise<Goal | null> {
    return goalDb.completeGoal(id);
  }

  // Milestone operations
  async createMilestone(input: CreateMilestoneInput): Promise<GoalMilestone> {
    return goalDb.createMilestone(input);
  }

  async getMilestones(goalId: string): Promise<GoalMilestone[]> {
    return goalDb.getMilestones(goalId);
  }

  async toggleMilestone(id: string): Promise<GoalMilestone | null> {
    return goalDb.toggleMilestone(id);
  }

  async updateMilestone(id: string, title: string): Promise<GoalMilestone | null> {
    return goalDb.updateMilestone(id, title);
  }

  async deleteMilestone(id: string): Promise<void> {
    return goalDb.deleteMilestone(id);
  }

  async reorderMilestones(goalId: string, milestoneIds: string[]): Promise<void> {
    return goalDb.reorderMilestones(goalId, milestoneIds);
  }
}

// Singleton instance
export const GoalRepository: IGoalRepository = new GoalRepositoryImpl();

// Re-export types for convenience
export type {
  Goal,
  GoalMilestone,
  GoalWithMilestones,
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  GoalStatus,
} from '../database/goals';
