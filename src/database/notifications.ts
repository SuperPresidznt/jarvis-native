/**
 * Notification History Database Operations
 * CRUD operations for notification history and management
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
} from './index';

export type NotificationType = 'task' | 'habit' | 'calendar' | 'alarm';
export type NotificationAction = 'opened' | 'dismissed' | 'completed' | 'snoozed';

export interface NotificationHistoryEntry {
  id: string;
  notificationType: NotificationType;
  referenceId?: string;
  title: string;
  body?: string;
  scheduledTime: string;
  deliveredTime?: string;
  actionTaken?: NotificationAction;
  createdAt: string;
}

interface NotificationHistoryRow {
  id: string;
  notification_type: NotificationType;
  reference_id?: string;
  title: string;
  body?: string;
  scheduled_time: string;
  delivered_time?: string;
  action_taken?: NotificationAction;
  created_at: string;
}

export interface LogNotificationData {
  notificationType: NotificationType;
  referenceId?: string;
  title: string;
  body?: string;
  scheduledTime: string;
  deliveredTime?: string;
  actionTaken?: NotificationAction;
}

/**
 * Convert database row to NotificationHistoryEntry object
 */
function rowToNotificationEntry(row: NotificationHistoryRow): NotificationHistoryEntry {
  return {
    id: row.id,
    notificationType: row.notification_type,
    referenceId: row.reference_id,
    title: row.title,
    body: row.body,
    scheduledTime: row.scheduled_time,
    deliveredTime: row.delivered_time,
    actionTaken: row.action_taken,
    createdAt: row.created_at,
  };
}

/**
 * Log a notification to history
 */
export async function logNotification(data: LogNotificationData): Promise<NotificationHistoryEntry> {
  const id = generateId();
  const now = getCurrentTimestamp();

  const sql = `
    INSERT INTO notification_history (
      id, notification_type, reference_id, title, body,
      scheduled_time, delivered_time, action_taken, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    data.notificationType,
    data.referenceId || null,
    data.title,
    data.body || null,
    data.scheduledTime,
    data.deliveredTime || null,
    data.actionTaken || null,
    now,
  ];

  await executeWrite(sql, params);

  const entry = await getNotificationHistoryEntry(id);
  if (!entry) {
    throw new Error('Failed to create notification history entry');
  }

  return entry;
}

/**
 * Get a single notification history entry by ID
 */
export async function getNotificationHistoryEntry(id: string): Promise<NotificationHistoryEntry | null> {
  const sql = 'SELECT * FROM notification_history WHERE id = ?';
  const row = await executeQuerySingle<NotificationHistoryRow>(sql, [id]);
  return row ? rowToNotificationEntry(row) : null;
}

/**
 * Get notification history with optional filters
 */
export async function getNotificationHistory(options?: {
  notificationType?: NotificationType;
  referenceId?: string;
  limit?: number;
  offset?: number;
}): Promise<NotificationHistoryEntry[]> {
  let sql = 'SELECT * FROM notification_history WHERE 1=1';
  const params: any[] = [];

  if (options?.notificationType) {
    sql += ' AND notification_type = ?';
    params.push(options.notificationType);
  }

  if (options?.referenceId) {
    sql += ' AND reference_id = ?';
    params.push(options.referenceId);
  }

  sql += ' ORDER BY created_at DESC';

  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  const rows = await executeQuery<NotificationHistoryRow>(sql, params);
  return rows.map(rowToNotificationEntry);
}

/**
 * Update notification action
 */
export async function updateNotificationAction(
  id: string,
  actionTaken: NotificationAction,
  deliveredTime?: string
): Promise<void> {
  const updates: string[] = ['action_taken = ?'];
  const params: any[] = [actionTaken];

  if (deliveredTime) {
    updates.push('delivered_time = ?');
    params.push(deliveredTime);
  }

  params.push(id);

  const sql = `UPDATE notification_history SET ${updates.join(', ')} WHERE id = ?`;
  await executeWrite(sql, params);
}

/**
 * Find notification history entry by reference
 */
export async function findNotificationByReference(
  notificationType: NotificationType,
  referenceId: string
): Promise<NotificationHistoryEntry | null> {
  const sql = `
    SELECT * FROM notification_history
    WHERE notification_type = ?
    AND reference_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const row = await executeQuerySingle<NotificationHistoryRow>(sql, [notificationType, referenceId]);
  return row ? rowToNotificationEntry(row) : null;
}

/**
 * Clear old notification history (older than specified days)
 */
export async function clearOldHistory(daysToKeep: number = 30): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const sql = 'DELETE FROM notification_history WHERE created_at < ?';
  await executeWrite(sql, [cutoffDate.toISOString()]);
}

/**
 * Get notification statistics
 */
export async function getNotificationStats(): Promise<{
  total: number;
  byType: Record<NotificationType, number>;
  byAction: Record<NotificationAction, number>;
}> {
  const totalSql = 'SELECT COUNT(*) as total FROM notification_history';
  const totalResult = await executeQuerySingle<{ total: number }>(totalSql);

  const byTypeSql = `
    SELECT notification_type, COUNT(*) as count
    FROM notification_history
    GROUP BY notification_type
  `;
  const byTypeResults = await executeQuery<{ notification_type: NotificationType; count: number }>(byTypeSql);

  const byActionSql = `
    SELECT action_taken, COUNT(*) as count
    FROM notification_history
    WHERE action_taken IS NOT NULL
    GROUP BY action_taken
  `;
  const byActionResults = await executeQuery<{ action_taken: NotificationAction; count: number }>(byActionSql);

  const byType: Record<string, number> = {};
  byTypeResults.forEach(row => {
    byType[row.notification_type] = row.count;
  });

  const byAction: Record<string, number> = {};
  byActionResults.forEach(row => {
    byAction[row.action_taken] = row.count;
  });

  return {
    total: totalResult?.total || 0,
    byType: byType as Record<NotificationType, number>,
    byAction: byAction as Record<NotificationAction, number>,
  };
}

/**
 * Get unread notification count (notifications without action taken)
 */
export async function getUnreadCount(): Promise<number> {
  const sql = `
    SELECT COUNT(*) as count
    FROM notification_history
    WHERE action_taken IS NULL
    AND scheduled_time <= ?
  `;

  const result = await executeQuerySingle<{ count: number }>(sql, [getCurrentTimestamp()]);
  return result?.count || 0;
}

/**
 * Delete all notification history
 */
export async function clearAllHistory(): Promise<void> {
  const sql = 'DELETE FROM notification_history';
  await executeWrite(sql);
}

export default {
  logNotification,
  getNotificationHistoryEntry,
  getNotificationHistory,
  updateNotificationAction,
  findNotificationByReference,
  clearOldHistory,
  getNotificationStats,
  getUnreadCount,
  clearAllHistory,
};
