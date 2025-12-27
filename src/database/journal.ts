/**
 * Journal Database Operations
 * CRUD operations for journal/notes entries linked to calendar dates
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
} from './index';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface JournalEntryRow {
  id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to JournalEntry object
 */
function rowToEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get journal entry for a specific date
 */
export async function getEntryByDate(date: string): Promise<JournalEntry | null> {
  const sql = 'SELECT * FROM journal_entries WHERE date = ?';
  const row = await executeQuerySingle<JournalEntryRow>(sql, [date]);
  return row ? rowToEntry(row) : null;
}

/**
 * Get all journal entries
 */
export async function getAllEntries(): Promise<JournalEntry[]> {
  const sql = 'SELECT * FROM journal_entries ORDER BY date DESC';
  const rows = await executeQuery<JournalEntryRow>(sql);
  return rows.map(rowToEntry);
}

/**
 * Get journal entries for a date range
 */
export async function getEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<JournalEntry[]> {
  const sql = `
    SELECT * FROM journal_entries
    WHERE date >= ? AND date <= ?
    ORDER BY date DESC
  `;
  const rows = await executeQuery<JournalEntryRow>(sql, [startDate, endDate]);
  return rows.map(rowToEntry);
}

/**
 * Create or update journal entry for a date
 * Uses upsert pattern - creates if not exists, updates if exists
 */
export async function saveEntry(date: string, content: string): Promise<JournalEntry> {
  const now = getCurrentTimestamp();
  const existing = await getEntryByDate(date);

  if (existing) {
    // Update existing entry
    const sql = `
      UPDATE journal_entries
      SET content = ?, updated_at = ?
      WHERE date = ?
    `;
    await executeWrite(sql, [content, now, date]);
    return {
      ...existing,
      content,
      updatedAt: now,
    };
  } else {
    // Create new entry
    const id = generateId();
    const sql = `
      INSERT INTO journal_entries (id, date, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    await executeWrite(sql, [id, date, content, now, now]);
    return {
      id,
      date,
      content,
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Delete journal entry for a date
 */
export async function deleteEntry(date: string): Promise<void> {
  const sql = 'DELETE FROM journal_entries WHERE date = ?';
  await executeWrite(sql, [date]);
}

/**
 * Get dates that have journal entries (for calendar marking)
 */
export async function getDatesWithEntries(): Promise<string[]> {
  const sql = 'SELECT date FROM journal_entries ORDER BY date DESC';
  const rows = await executeQuery<{ date: string }>(sql);
  return rows.map(row => row.date);
}

/**
 * Search journal entries by content
 */
export async function searchEntries(query: string): Promise<JournalEntry[]> {
  const sql = `
    SELECT * FROM journal_entries
    WHERE content LIKE ?
    ORDER BY date DESC
    LIMIT 50
  `;
  const searchParam = `%${query}%`;
  const rows = await executeQuery<JournalEntryRow>(sql, [searchParam]);
  return rows.map(rowToEntry);
}

export default {
  getEntryByDate,
  getAllEntries,
  getEntriesByDateRange,
  saveEntry,
  deleteEntry,
  getDatesWithEntries,
  searchEntries,
};
