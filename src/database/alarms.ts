/**
 * Recurring Alarms Database Operations
 * CRUD operations for recurring alarms with offline-first support
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
} from './index';

export type AlarmType = 'gentle' | 'urgent';

export interface RecurringAlarm {
  id: string;
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  alarmType: AlarmType;
  isEnabled: boolean;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface AlarmRow {
  id: string;
  title: string;
  description?: string;
  time: string;
  days_of_week: string;
  alarm_type: AlarmType;
  is_enabled: number;
  notification_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAlarmData {
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  alarmType?: AlarmType;
}

export interface UpdateAlarmData extends Partial<CreateAlarmData> {
  isEnabled?: boolean;
  notificationId?: string;
}

/**
 * Convert database row to RecurringAlarm object
 */
function rowToAlarm(row: AlarmRow): RecurringAlarm {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    time: row.time,
    daysOfWeek: JSON.parse(row.days_of_week),
    alarmType: row.alarm_type,
    isEnabled: row.is_enabled === 1,
    notificationId: row.notification_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get all recurring alarms
 */
export async function getAlarms(): Promise<RecurringAlarm[]> {
  const sql = 'SELECT * FROM recurring_alarms ORDER BY time ASC';
  const rows = await executeQuery<AlarmRow>(sql);
  return rows.map(rowToAlarm);
}

/**
 * Get active (enabled) recurring alarms
 */
export async function getActiveAlarms(): Promise<RecurringAlarm[]> {
  const sql = 'SELECT * FROM recurring_alarms WHERE is_enabled = 1 ORDER BY time ASC';
  const rows = await executeQuery<AlarmRow>(sql);
  return rows.map(rowToAlarm);
}

/**
 * Get a single alarm by ID
 */
export async function getAlarm(id: string): Promise<RecurringAlarm | null> {
  const sql = 'SELECT * FROM recurring_alarms WHERE id = ?';
  const row = await executeQuerySingle<AlarmRow>(sql, [id]);
  return row ? rowToAlarm(row) : null;
}

/**
 * Create a new recurring alarm
 */
export async function createAlarm(data: CreateAlarmData): Promise<RecurringAlarm> {
  const id = generateId();
  const now = getCurrentTimestamp();

  const sql = `
    INSERT INTO recurring_alarms (
      id, title, description, time, days_of_week,
      alarm_type, is_enabled, notification_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, NULL, ?, ?)
  `;

  const params = [
    id,
    data.title,
    data.description || null,
    data.time,
    JSON.stringify(data.daysOfWeek),
    data.alarmType || 'gentle',
    now,
    now,
  ];

  await executeWrite(sql, params);

  const alarm = await getAlarm(id);
  if (!alarm) {
    throw new Error('Failed to create alarm');
  }

  return alarm;
}

/**
 * Update a recurring alarm
 */
export async function updateAlarm(id: string, data: UpdateAlarmData): Promise<RecurringAlarm> {
  const now = getCurrentTimestamp();

  const updates: string[] = [];
  const params: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    params.push(data.title);
  }

  if (data.description !== undefined) {
    updates.push('description = ?');
    params.push(data.description || null);
  }

  if (data.time !== undefined) {
    updates.push('time = ?');
    params.push(data.time);
  }

  if (data.daysOfWeek !== undefined) {
    updates.push('days_of_week = ?');
    params.push(JSON.stringify(data.daysOfWeek));
  }

  if (data.alarmType !== undefined) {
    updates.push('alarm_type = ?');
    params.push(data.alarmType);
  }

  if (data.isEnabled !== undefined) {
    updates.push('is_enabled = ?');
    params.push(data.isEnabled ? 1 : 0);
  }

  if (data.notificationId !== undefined) {
    updates.push('notification_id = ?');
    params.push(data.notificationId || null);
  }

  updates.push('updated_at = ?');
  params.push(now);

  params.push(id);

  const sql = `UPDATE recurring_alarms SET ${updates.join(', ')} WHERE id = ?`;
  await executeWrite(sql, params);

  const alarm = await getAlarm(id);
  if (!alarm) {
    throw new Error('Alarm not found after update');
  }

  return alarm;
}

/**
 * Toggle alarm enabled/disabled state
 */
export async function toggleAlarm(id: string): Promise<RecurringAlarm> {
  const alarm = await getAlarm(id);
  if (!alarm) {
    throw new Error('Alarm not found');
  }

  return await updateAlarm(id, { isEnabled: !alarm.isEnabled });
}

/**
 * Delete a recurring alarm
 */
export async function deleteAlarm(id: string): Promise<void> {
  const sql = 'DELETE FROM recurring_alarms WHERE id = ?';
  await executeWrite(sql, [id]);
}

/**
 * Get alarms scheduled for a specific day of week
 */
export async function getAlarmsForDay(dayOfWeek: number): Promise<RecurringAlarm[]> {
  const sql = `
    SELECT * FROM recurring_alarms
    WHERE is_enabled = 1
    AND days_of_week LIKE ?
    ORDER BY time ASC
  `;

  const rows = await executeQuery<AlarmRow>(sql, [`%${dayOfWeek}%`]);
  return rows
    .map(rowToAlarm)
    .filter(alarm => alarm.daysOfWeek.includes(dayOfWeek));
}

/**
 * Get count of active alarms
 */
export async function getActiveAlarmsCount(): Promise<number> {
  const sql = 'SELECT COUNT(*) as count FROM recurring_alarms WHERE is_enabled = 1';
  const result = await executeQuerySingle<{ count: number }>(sql);
  return result?.count || 0;
}

export default {
  getAlarms,
  getActiveAlarms,
  getAlarm,
  createAlarm,
  updateAlarm,
  toggleAlarm,
  deleteAlarm,
  getAlarmsForDay,
  getActiveAlarmsCount,
};
