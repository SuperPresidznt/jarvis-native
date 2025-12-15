/**
 * Focus Timer Hook
 * Manages timer state, controls, and persistence for focus blocks
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { FocusBlock } from '../database/focusBlocks';
import { getElapsedTime, getRemainingTime } from '../utils/focusAnalytics';

const TIMER_STATE_KEY = '@focus_timer_state';

interface TimerState {
  focusBlockId: string;
  startTime: string;
  pausedAt?: string;
  pausedDuration: number; // Total paused time in milliseconds
  isRunning: boolean;
}

interface UseFocusTimerReturn {
  elapsedSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number; // 0-1
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * Hook for managing focus timer with pause/resume and background persistence
 */
export function useFocusTimer(focusBlock: FocusBlock | null): UseFocusTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedDuration, setPausedDuration] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const pausedAtRef = useRef<Date | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const durationSeconds = (focusBlock?.durationMinutes || 0) * 60;
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const progress = durationSeconds > 0 ? Math.min(1, elapsedSeconds / durationSeconds) : 0;

  /**
   * Save timer state to AsyncStorage
   */
  const saveTimerState = useCallback(async (state: TimerState | null) => {
    try {
      if (state) {
        await AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
      } else {
        await AsyncStorage.removeItem(TIMER_STATE_KEY);
      }
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }, []);

  /**
   * Load timer state from AsyncStorage
   */
  const loadTimerState = useCallback(async (): Promise<TimerState | null> => {
    try {
      const json = await AsyncStorage.getItem(TIMER_STATE_KEY);
      if (!json) return null;
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to load timer state:', error);
      return null;
    }
  }, []);

  /**
   * Calculate elapsed time considering pauses
   */
  const calculateElapsed = useCallback(() => {
    if (!startTimeRef.current) return 0;

    const now = Date.now();
    const startTime = startTimeRef.current.getTime();
    let totalElapsed = now - startTime;

    // Subtract paused duration
    totalElapsed -= pausedDuration;

    // If currently paused, don't add time since pause started
    if (pausedAtRef.current) {
      const pauseDuration = now - pausedAtRef.current.getTime();
      totalElapsed -= pauseDuration;
    }

    return Math.floor(totalElapsed / 1000);
  }, [pausedDuration]);

  /**
   * Start the timer
   */
  const start = useCallback(async () => {
    if (!focusBlock || isRunning) return;

    const now = new Date();
    startTimeRef.current = new Date(focusBlock.startTime || now.toISOString());
    pausedAtRef.current = null;
    setPausedDuration(0);
    setIsRunning(true);
    setIsPaused(false);

    // Save state
    await saveTimerState({
      focusBlockId: focusBlock.id,
      startTime: startTimeRef.current.toISOString(),
      pausedDuration: 0,
      isRunning: true,
    });
  }, [focusBlock, isRunning, saveTimerState]);

  /**
   * Pause the timer
   */
  const pause = useCallback(async () => {
    if (!isRunning || isPaused || !focusBlock) return;

    pausedAtRef.current = new Date();
    setIsPaused(true);

    // Save state
    await saveTimerState({
      focusBlockId: focusBlock.id,
      startTime: startTimeRef.current!.toISOString(),
      pausedAt: pausedAtRef.current.toISOString(),
      pausedDuration,
      isRunning: true,
    });
  }, [isRunning, isPaused, focusBlock, pausedDuration, saveTimerState]);

  /**
   * Resume the timer
   */
  const resume = useCallback(async () => {
    if (!isPaused || !pausedAtRef.current || !focusBlock) return;

    const now = Date.now();
    const pauseStart = pausedAtRef.current.getTime();
    const thisPauseDuration = now - pauseStart;

    setPausedDuration((prev) => prev + thisPauseDuration);
    pausedAtRef.current = null;
    setIsPaused(false);

    // Save state
    await saveTimerState({
      focusBlockId: focusBlock.id,
      startTime: startTimeRef.current!.toISOString(),
      pausedDuration: pausedDuration + thisPauseDuration,
      isRunning: true,
    });
  }, [isPaused, focusBlock, pausedDuration, saveTimerState]);

  /**
   * Stop the timer
   */
  const stop = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    pausedAtRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setPausedDuration(0);
    setElapsedSeconds(0);

    await saveTimerState(null);
  }, [saveTimerState]);

  /**
   * Reset the timer
   */
  const reset = useCallback(async () => {
    if (!focusBlock) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    pausedAtRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setPausedDuration(0);
    setElapsedSeconds(0);

    await saveTimerState(null);
  }, [focusBlock, saveTimerState]);

  /**
   * Restore timer state on mount or focus block change
   */
  useEffect(() => {
    if (!focusBlock || focusBlock.status !== 'in_progress') {
      stop();
      return;
    }

    const restoreState = async () => {
      const savedState = await loadTimerState();

      if (savedState && savedState.focusBlockId === focusBlock.id && savedState.isRunning) {
        // Restore timer state
        startTimeRef.current = new Date(savedState.startTime);
        setPausedDuration(savedState.pausedDuration);

        if (savedState.pausedAt) {
          // Timer was paused
          pausedAtRef.current = new Date(savedState.pausedAt);
          setIsPaused(true);
        } else {
          pausedAtRef.current = null;
          setIsPaused(false);
        }

        setIsRunning(true);
        setElapsedSeconds(calculateElapsed());
      } else if (focusBlock.startTime) {
        // Fresh start from focus block start time
        await start();
      }
    };

    restoreState();
  }, [focusBlock?.id, focusBlock?.status]);

  /**
   * Timer interval - update elapsed time every second
   */
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = calculateElapsed();
      setElapsedSeconds(elapsed);

      // Auto-complete when time is up
      if (elapsed >= durationSeconds && durationSeconds > 0) {
        stop();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, calculateElapsed, durationSeconds, stop]);

  /**
   * Handle app state changes (background/foreground)
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isRunning
      ) {
        // App came to foreground - recalculate elapsed time
        setElapsedSeconds(calculateElapsed());
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, calculateElapsed]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    elapsedSeconds,
    remainingSeconds,
    isRunning,
    isPaused,
    progress,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
