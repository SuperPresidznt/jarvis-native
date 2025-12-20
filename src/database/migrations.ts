/**
 * Database Migrations
 * Version-based migrations for schema changes
 */

import { executeWrite } from './index';

export interface Migration {
  version: number;
  name: string;
  up: () => Promise<void>;
}

/**
 * Migration 1: Add sort_order to tasks table
 */
const migration_001_add_task_sort_order: Migration = {
  version: 1,
  name: 'add_task_sort_order',
  up: async () => {
    // Add sort_order column to tasks table
    await executeWrite(
      'ALTER TABLE tasks ADD COLUMN sort_order INTEGER DEFAULT 0',
      []
    );

    // Initialize sort_order for existing tasks based on created_at
    await executeWrite(
      `UPDATE tasks
       SET sort_order = (
         SELECT COUNT(*)
         FROM tasks t2
         WHERE t2.created_at <= tasks.created_at
       )`,
      []
    );
  },
};

/**
 * All migrations in order
 */
export const MIGRATIONS: Migration[] = [
  migration_001_add_task_sort_order,
];

/**
 * Run pending migrations
 */
export async function runMigrations(currentVersion: number): Promise<number> {
  let appliedVersion = currentVersion;

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      console.log(`Running migration ${migration.version}: ${migration.name}`);
      await migration.up();
      appliedVersion = migration.version;
    }
  }

  return appliedVersion;
}
