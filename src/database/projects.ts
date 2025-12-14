/**
 * Projects Database Operations
 * CRUD operations for projects with offline-first support
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
} from './index';

export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
}

interface ProjectRow {
  id: string;
  name: string;
  description?: string;
  color?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  synced: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

/**
 * Convert database row to Project object
 */
function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    synced: row.synced === 1,
  };
}

/**
 * Get all projects
 */
export async function getProjects(includeArchived: boolean = false): Promise<Project[]> {
  let sql = 'SELECT * FROM projects';

  if (!includeArchived) {
    sql += " WHERE status != 'archived'";
  }

  sql += ' ORDER BY created_at DESC';

  const rows = await executeQuery<ProjectRow>(sql);
  return rows.map(rowToProject);
}

/**
 * Get active projects only
 */
export async function getActiveProjects(): Promise<Project[]> {
  const sql = "SELECT * FROM projects WHERE status = 'active' ORDER BY name ASC";
  const rows = await executeQuery<ProjectRow>(sql);
  return rows.map(rowToProject);
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  const sql = 'SELECT * FROM projects WHERE id = ?';
  const row = await executeQuerySingle<ProjectRow>(sql, [id]);
  return row ? rowToProject(row) : null;
}

/**
 * Get project with task statistics
 */
export async function getProjectWithStats(id: string): Promise<Project | null> {
  const project = await getProject(id);
  if (!project) return null;

  // Get task statistics for this project
  const statsSql = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo
    FROM tasks
    WHERE project_id = ?
  `;

  const stats = await executeQuerySingle<any>(statsSql, [id]);

  return {
    ...project,
    taskStats: {
      total: stats?.total || 0,
      completed: stats?.completed || 0,
      inProgress: stats?.in_progress || 0,
      todo: stats?.todo || 0,
    },
  };
}

/**
 * Get all projects with their task statistics
 */
export async function getProjectsWithStats(includeArchived: boolean = false): Promise<Project[]> {
  const projects = await getProjects(includeArchived);

  // Get stats for all projects in one query
  const statsSql = `
    SELECT
      project_id,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo
    FROM tasks
    WHERE project_id IS NOT NULL
    GROUP BY project_id
  `;

  const statsRows = await executeQuery<any>(statsSql);

  // Create a map of project_id to stats
  const statsMap = new Map();
  statsRows.forEach((row) => {
    statsMap.set(row.project_id, {
      total: row.total || 0,
      completed: row.completed || 0,
      inProgress: row.in_progress || 0,
      todo: row.todo || 0,
    });
  });

  // Attach stats to each project
  return projects.map((project) => ({
    ...project,
    taskStats: statsMap.get(project.id) || {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
    },
  }));
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  const id = generateId();
  const now = getCurrentTimestamp();

  const sql = `
    INSERT INTO projects (
      id, name, description, color, status, created_at, updated_at, synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `;

  const params = [
    id,
    data.name,
    data.description || null,
    data.color || null,
    data.status || 'active',
    now,
    now,
  ];

  await executeWrite(sql, params);

  const project = await getProject(id);
  if (!project) {
    throw new Error('Failed to create project');
  }

  return project;
}

/**
 * Update a project
 */
export async function updateProject(id: string, data: UpdateProjectData): Promise<Project> {
  const now = getCurrentTimestamp();

  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    params.push(data.name);
  }

  if (data.description !== undefined) {
    updates.push('description = ?');
    params.push(data.description || null);
  }

  if (data.color !== undefined) {
    updates.push('color = ?');
    params.push(data.color || null);
  }

  if (data.status !== undefined) {
    updates.push('status = ?');
    params.push(data.status);
  }

  updates.push('updated_at = ?');
  params.push(now);

  updates.push('synced = 0');

  params.push(id);

  const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
  await executeWrite(sql, params);

  const project = await getProject(id);
  if (!project) {
    throw new Error('Project not found after update');
  }

  return project;
}

/**
 * Archive a project (soft delete)
 */
export async function archiveProject(id: string): Promise<void> {
  await updateProject(id, { status: 'archived' });
}

/**
 * Unarchive a project
 */
export async function unarchiveProject(id: string): Promise<void> {
  await updateProject(id, { status: 'active' });
}

/**
 * Delete a project (hard delete)
 * Note: This will set all associated tasks' project_id to NULL due to ON DELETE SET NULL
 */
export async function deleteProject(id: string): Promise<void> {
  const sql = 'DELETE FROM projects WHERE id = ?';
  await executeWrite(sql, [id]);
}

/**
 * Search projects by name
 */
export async function searchProjects(query: string, includeArchived: boolean = false): Promise<Project[]> {
  let sql = 'SELECT * FROM projects WHERE name LIKE ?';

  if (!includeArchived) {
    sql += " AND status != 'archived'";
  }

  sql += ' ORDER BY name ASC LIMIT 20';

  const searchParam = `%${query}%`;
  const rows = await executeQuery<ProjectRow>(sql, [searchParam]);
  return rows.map(rowToProject);
}

/**
 * Get project count by status
 */
export async function getProjectCounts(): Promise<{
  total: number;
  active: number;
  archived: number;
  completed: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM projects
  `;

  const result = await executeQuerySingle<any>(sql);
  return {
    total: result?.total || 0,
    active: result?.active || 0,
    archived: result?.archived || 0,
    completed: result?.completed || 0,
  };
}

export default {
  getProjects,
  getActiveProjects,
  getProject,
  getProjectWithStats,
  getProjectsWithStats,
  createProject,
  updateProject,
  archiveProject,
  unarchiveProject,
  deleteProject,
  searchProjects,
  getProjectCounts,
};
