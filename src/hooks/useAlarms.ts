/**
 * useAlarms Hook
 * Manages recurring alarms state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAlarms,
  getActiveAlarms,
  createAlarm,
  updateAlarm,
  toggleAlarm,
  deleteAlarm,
  getActiveAlarmsCount,
  type RecurringAlarm,
  type CreateAlarmData,
  type UpdateAlarmData,
} from '../database/alarms';
import {
  scheduleRecurringAlarm,
  cancelNotification,
} from '../services/notificationManager';

export interface UseAlarmsResult {
  alarms: RecurringAlarm[];
  activeAlarms: RecurringAlarm[];
  activeCount: number;
  isLoading: boolean;
  error: string | null;
  loadAlarms: () => Promise<void>;
  createNewAlarm: (data: CreateAlarmData) => Promise<RecurringAlarm>;
  editAlarm: (id: string, data: UpdateAlarmData) => Promise<RecurringAlarm>;
  toggleAlarmEnabled: (id: string) => Promise<RecurringAlarm>;
  removeAlarm: (id: string) => Promise<void>;
  refreshActiveCount: () => Promise<void>;
}

/**
 * Hook to manage recurring alarms
 */
export function useAlarms(): UseAlarmsResult {
  const [alarms, setAlarms] = useState<RecurringAlarm[]>([]);
  const [activeAlarms, setActiveAlarms] = useState<RecurringAlarm[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all alarms from database
   */
  const loadAlarms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [allAlarms, active, count] = await Promise.all([
        getAlarms(),
        getActiveAlarms(),
        getActiveAlarmsCount(),
      ]);

      setAlarms(allAlarms);
      setActiveAlarms(active);
      setActiveCount(count);
    } catch (err) {
      console.error('[useAlarms] Error loading alarms:', err);
      setError(err instanceof Error ? err.message : 'Failed to load alarms');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new alarm
   */
  const createNewAlarm = useCallback(async (data: CreateAlarmData): Promise<RecurringAlarm> => {
    try {
      setError(null);

      // Create alarm in database
      const alarm = await createAlarm(data);

      // Schedule notification
      const notificationId = await scheduleRecurringAlarm(alarm);

      // Update alarm with notification ID
      let updatedAlarm = alarm;
      if (notificationId) {
        updatedAlarm = await updateAlarm(alarm.id, { notificationId });
      }

      // Reload alarms
      await loadAlarms();

      return updatedAlarm;
    } catch (err) {
      console.error('[useAlarms] Error creating alarm:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create alarm';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [loadAlarms]);

  /**
   * Edit an existing alarm
   */
  const editAlarm = useCallback(async (id: string, data: UpdateAlarmData): Promise<RecurringAlarm> => {
    try {
      setError(null);

      // Get current alarm
      const currentAlarms = alarms.find(a => a.id === id);

      // Update alarm in database
      const alarm = await updateAlarm(id, data);

      // If time or days changed, reschedule notification
      if (data.time !== undefined || data.daysOfWeek !== undefined || data.isEnabled !== undefined) {
        // Cancel old notification
        if (currentAlarms?.notificationId) {
          await cancelNotification(currentAlarms.notificationId);
        }

        // Schedule new notification if enabled
        if (alarm.isEnabled) {
          const notificationId = await scheduleRecurringAlarm(alarm);
          if (notificationId) {
            await updateAlarm(id, { notificationId });
          }
        }
      }

      // Reload alarms
      await loadAlarms();

      return alarm;
    } catch (err) {
      console.error('[useAlarms] Error editing alarm:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to edit alarm';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [alarms, loadAlarms]);

  /**
   * Toggle alarm enabled/disabled state
   */
  const toggleAlarmEnabled = useCallback(async (id: string): Promise<RecurringAlarm> => {
    try {
      setError(null);

      const alarm = alarms.find(a => a.id === id);
      if (!alarm) {
        throw new Error('Alarm not found');
      }

      // Toggle in database
      const updatedAlarm = await toggleAlarm(id);

      // Cancel or schedule notification based on new state
      if (updatedAlarm.isEnabled) {
        // Schedule notification
        const notificationId = await scheduleRecurringAlarm(updatedAlarm);
        if (notificationId) {
          await updateAlarm(id, { notificationId });
        }
      } else {
        // Cancel notification
        if (alarm.notificationId) {
          await cancelNotification(alarm.notificationId);
        }
      }

      // Reload alarms
      await loadAlarms();

      return updatedAlarm;
    } catch (err) {
      console.error('[useAlarms] Error toggling alarm:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle alarm';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [alarms, loadAlarms]);

  /**
   * Remove an alarm
   */
  const removeAlarm = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      const alarm = alarms.find(a => a.id === id);

      // Cancel notification if exists
      if (alarm?.notificationId) {
        await cancelNotification(alarm.notificationId);
      }

      // Delete from database
      await deleteAlarm(id);

      // Reload alarms
      await loadAlarms();
    } catch (err) {
      console.error('[useAlarms] Error removing alarm:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove alarm';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [alarms, loadAlarms]);

  /**
   * Refresh active alarm count
   */
  const refreshActiveCount = useCallback(async () => {
    try {
      const count = await getActiveAlarmsCount();
      setActiveCount(count);
    } catch (err) {
      console.error('[useAlarms] Error refreshing active count:', err);
    }
  }, []);

  /**
   * Load alarms on mount
   */
  useEffect(() => {
    loadAlarms();
  }, [loadAlarms]);

  return {
    alarms,
    activeAlarms,
    activeCount,
    isLoading,
    error,
    loadAlarms,
    createNewAlarm,
    editAlarm,
    toggleAlarmEnabled,
    removeAlarm,
    refreshActiveCount,
  };
}

export default useAlarms;
