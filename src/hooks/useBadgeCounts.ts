/**
 * Badge Counts Hook
 * Provides badge counts for tab bar icons with real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as tasksDB from '../database/tasks';
import * as habitsDB from '../database/habits';
import * as calendarDB from '../database/calendar';
import * as alarmsDB from '../database/alarms';

export interface BadgeCounts {
  tasks: number;
  habits: number;
  calendar: number;
  alarms: number;
}

/**
 * Hook to get and manage badge counts for all tabs
 * Updates automatically when screen focuses
 */
export function useBadgeCounts() {
  const [counts, setCounts] = useState<BadgeCounts>({
    tasks: 0,
    habits: 0,
    calendar: 0,
    alarms: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    try {
      setLoading(true);
      const [taskCount, habitCount, calendarCount, alarmsCount] = await Promise.all([
        tasksDB.getActiveTasksCount(),
        habitsDB.getTodayIncompleteHabitsCount(),
        calendarDB.getTodayEventsCount(),
        alarmsDB.getActiveAlarmsCount(),
      ]);

      setCounts({
        tasks: taskCount,
        habits: habitCount,
        calendar: calendarCount,
        alarms: alarmsCount,
      });
    } catch (error) {
      console.error('[BadgeCounts] Error loading counts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load counts on mount
  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  return {
    counts,
    loading,
    refresh: loadCounts,
  };
}

/**
 * Hook to refresh badge counts when screen focuses
 * Use this in individual screens to trigger badge updates
 */
export function useRefreshBadgesOnFocus(refreshFn: () => void | Promise<void>) {
  useFocusEffect(
    useCallback(() => {
      refreshFn();
    }, [refreshFn])
  );
}

export default useBadgeCounts;
