/**
 * Project Repository
 * Wraps database operations for projects with a clean interface
 */

import type { IRepository } from './IRepository';
import * as projectDb from '../database/projects';
import type { Project, CreateProjectData, UpdateProjectData } from '../database/projects';

/**
 * Project counts by status
 */
export interface ProjectCounts {
  total: number;
  active: number;
  archived: number;
  completed: number;
}

/**
 * Project repository interface
 */
export interface IProjectRepository extends IRepository<Project, CreateProjectData, UpdateProjectData> {
  // Filtered queries
  getAll(includeArchived?: boolean): Promise<Project[]>;
  getActive(): Promise<Project[]>;
  getAllWithStats(includeArchived?: boolean): Promise<Project[]>;
  getWithStats(id: string): Promise<Project | null>;

  // Archive operations
  archive(id: string): Promise<void>;
  unarchive(id: string): Promise<void>;

  // Search
  search(query: string, includeArchived?: boolean): Promise<Project[]>;

  // Stats
  getCounts(): Promise<ProjectCounts>;
}

/**
 * Project Repository Implementation
 */
class ProjectRepositoryImpl implements IProjectRepository {
  async getAll(includeArchived: boolean = false): Promise<Project[]> {
    return projectDb.getProjects(includeArchived);
  }

  async getById(id: string): Promise<Project | null> {
    return projectDb.getProject(id);
  }

  async create(data: CreateProjectData): Promise<Project> {
    return projectDb.createProject(data);
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    return projectDb.updateProject(id, data);
  }

  async delete(id: string): Promise<void> {
    return projectDb.deleteProject(id);
  }

  async getActive(): Promise<Project[]> {
    return projectDb.getActiveProjects();
  }

  async getAllWithStats(includeArchived: boolean = false): Promise<Project[]> {
    return projectDb.getProjectsWithStats(includeArchived);
  }

  async getWithStats(id: string): Promise<Project | null> {
    return projectDb.getProjectWithStats(id);
  }

  async archive(id: string): Promise<void> {
    return projectDb.archiveProject(id);
  }

  async unarchive(id: string): Promise<void> {
    return projectDb.unarchiveProject(id);
  }

  async search(query: string, includeArchived: boolean = false): Promise<Project[]> {
    return projectDb.searchProjects(query, includeArchived);
  }

  async getCounts(): Promise<ProjectCounts> {
    return projectDb.getProjectCounts();
  }
}

// Singleton instance
export const ProjectRepository: IProjectRepository = new ProjectRepositoryImpl();

// Re-export types for convenience
export type { Project, CreateProjectData, UpdateProjectData, ProjectStatus } from '../database/projects';
