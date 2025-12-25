/**
 * Unified Timer Hook
 * Handles both Focus blocks and Pomodoro sessions with a single timer
 * Replaces useFocusTimer and usePomodoroTimer
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import * as focusSessionsDB from '../database/focusSessions';
import { FocusSession, PomodoroSettings } from '../database/focusSessions';
import { getPhaseDuration, getNextPhase, getBreakDuration } from '../utils/pomodoroHelpers';

const TIMER_STATE_KEY = '@unified_timer_state';

export type TimerMode = 'focus' | 'pomodoro';
export type PomodoroPhase = 'work' | 'short_break' | 'long_break';

interface TimerState {
  sessionId: string;
  mode: TimerMode;
  startTime: string;
  pausedAt?: string;
  pausedDuration: number;
  isRunning: boolean;
  // Pomodoro-specific
  pomodoroPhase?: PomodoroPhase;
  sessionNumber?: number;
}

interface UseUnifiedTimerReturn {
  elapsedSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  mode: TimerMode;
  // Pomodoro-specific
  pomodoroPhase?: PomodoroPhase;
  sessionNumber?: number;
  settings?: PomodoroSettings;
  // Actions
  startFocus: (durationMinutes: number) => Promise<void>;
  startPomodoro: (taskId?: string) => Promise<void>;
  startBreak: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  complete: () => Promise<void>;
  skip: () => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * Unified hook for managing both Focus and Pomodoro timers
 */
export function useUnifiedTimer(session: FocusSession | null): UseUnifiedTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase | undefined>();
  const [sessionNumber, setSessionNumber] = useState<number | undefined>();
  const [settings, setSettings] = useState<PomodoroSettings | undefined>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const pausedAtRef = useRef<Date | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const durationSeconds = (session?.durationMinutes || 0) * 60;
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const progress = durationSeconds > 0 ? Math.min(1, elapsedSeconds / durationSeconds) : 0;

  // Load pomodoro settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const pomodoroSettings = await focusSessionsDB.getPomodoroSettings();
        setSettings(pomodoroSettings);
      } catch (error) {
        console.error('Error loading pomodoro settings:', error);
      }
    };
    loadSettings();
  }, []);

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

    totalElapsed -= pausedDuration;

    if (pausedAtRef.current) {
      const pauseElapsed = now - pausedAtRef.current.getTime();
      totalElapsed -= pauseElapsed;
    }

    return Math.floor(totalElapsed / 1000);
  }, [pausedDuration]);

  /**
   * Start a regular focus session
   */
  const startFocus = useCallback(
    async (_durationMinutes: number) => {
      if (!session || isRunning) return;

      const now = new Date();
      startTimeRef.current = new Date(session.startTime || now.toISOString());
      pausedAtRef.current = null;
      setPausedDuration(0);
      setIsRunning(true);
      setIsPaused(false);
      setMode('focus');
      setPomodoroPhase(undefined);
      setSessionNumber(undefined);

      await saveTimerState({
        sessionId: session.id,
        mode: 'focus',
        startTime: startTimeRef.current.toISOString(),
        pausedDuration: 0,
        isRunning: true,
      });
    },
    [session, isRunning, saveTimerState]
  );

  /**
   * Start a pomodoro work session
   */
  const startPomodoro = useCallback(
    async (taskId?: string) => {
      if (!session || !settings || isRunning) return;

      const currentSessionNumber = session.sessionNumber || 1;
      const duration = getPhaseDuration('work', settings);
      const breakMinutes = getBreakDuration(currentSessionNumber, settings);

      const now = new Date();
      startTimeRef.current = new Date(session.startTime || now.toISOString());
      pausedAtRef.current = null;
      setPausedDuration(0);
      setIsRunning(true);
      setIsPaused(false);
      setMode('pomodoro');
      setPomodoroPhase('work');
      setSessionNumber(currentSessionNumber);

      // Update session in database
      await focusSessionsDB.updateFocusSession(session.id, {
        isPomodoro: true,
        sessionNumber: currentSessionNumber,
        breakMinutes,
      });

      await saveTimerState({
        sessionId: session.id,
        mode: 'pomodoro',
        startTime: startTimeRef.current.toISOString(),
        pausedDuration: 0,
        isRunning: true,
        pomodoroPhase: 'work',
        sessionNumber: currentSessionNumber,
      });
    },
    [session, settings, isRunning, saveTimerState]
  );

  /**
   * Start a pomodoro break
   */
  const startBreak = useCallback(async () => {
    if (!session || !settings || mode !== 'pomodoro') return;

    const currentSessionNumber = session.sessionNumber || 1;
    const nextPhase = getNextPhase(currentSessionNumber, settings);
    const duration = getPhaseDuration(nextPhase, settings);

    const now = new Date();
    startTimeRef.current = now;
    pausedAtRef.current = null;
    setPausedDuration(0);
    setIsRunning(true);
    setIsPaused(false);
    setPomodoroPhase(nextPhase);

    await saveTimerState({
      sessionId: session.id,
      mode: 'pomodoro',
      startTime: startTimeRef.current.toISOString(),
      pausedDuration: 0,
      isRunning: true,
      pomodoroPhase: nextPhase,
      sessionNumber: currentSessionNumber,
    });
  }, [session, settings, mode, saveTimerState]);

  /**
   * Pause the timer
   */
  const pause = useCallback(async () => {
    if (!isRunning || isPaused || !session) return;

    pausedAtRef.current = new Date();
    setIsPaused(true);

    await saveTimerState({
      sessionId: session.id,
      mode,
      startTime: startTimeRef.current!.toISOString(),
      pausedAt: pausedAtRef.current.toISOString(),
      pausedDuration,
      isRunning: true,
      pomodoroPhase,
      sessionNumber,
    });
  }, [isRunning, isPaused, session, mode, pausedDuration, pomodoroPhase, sessionNumber, saveTimerState]);

  /**
   * Resume the timer
   */
  const resume = useCallback(async () => {
    if (!isPaused || !pausedAtRef.current || !session) return;

    const now = Date.now();
    const pauseStart = pausedAtRef.current.getTime();
    const thisPauseDuration = now - pauseStart;

    setPausedDuration((prev) => prev + thisPauseDuration);
    pausedAtRef.current = null;
    setIsPaused(false);

    await saveTimerState({
      sessionId: session.id,
      mode,
      startTime: startTimeRef.current!.toISOString(),
      pausedDuration: pausedDuration + thisPauseDuration,
      isRunning: true,
      pomodoroPhase,
      sessionNumber,
    });
  }, [isPaused, session, mode, pausedDuration, pomodoroPhase, sessionNumber, saveTimerState]);

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
    setPomodoroPhase(undefined);
    setSessionNumber(undefined);

    await saveTimerState(null);
  }, [saveTimerState]);

  /**
   * Complete current session
   */
  const complete = useCallback(async () => {
    if (!session) return;

    const actualMinutes = Math.ceil(elapsedSeconds / 60);

    if (mode === 'pomodoro' && pomodoroPhase === 'work') {
      await focusSessionsDB.completeFocusSession(session.id, actualMinutes);

      // Auto-start break if enabled
      if (settings?.autoStartBreaks) {
        await startBreak();
        return;
      }
    } else {
      await focusSessionsDB.completeFocusSession(session.id, actualMinutes);
    }

    await stop();
  }, [session, mode, pomodoroPhase, elapsedSeconds, settings, startBreak, stop]);

  /**
   * Skip current phase
   */
  const skip = useCallback(async () => {
    if (!session) return;

    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') {
        // Skip work to break
        await startBreak();
      } else {
        // Skip break to next work session
        const nextSession = pomodoroPhase === 'long_break' ? 1 : (sessionNumber || 1) + 1;

        await focusSessionsDB.updateFocusSession(session.id, {
          sessionNumber: nextSession,
        });

        await stop();
      }
    } else {
      await stop();
    }
  }, [session, mode, pomodoroPhase, sessionNumber, startBreak, stop]);

  /**
   * Reset the timer
   */
  const reset = useCallback(async () => {
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
    setPomodoroPhase(undefined);
    setSessionNumber(undefined);

    await saveTimerState(null);
  }, [saveTimerState]);

  /**
   * Restore timer state on mount or session change
   */
  useEffect(() => {
    if (!session || session.status !== 'in_progress') {
      stop();
      return;
    }

    const restoreState = async () => {
      const savedState = await loadTimerState();

      if (savedState && savedState.sessionId === session.id && savedState.isRunning) {
        startTimeRef.current = new Date(savedState.startTime);
        setPausedDuration(savedState.pausedDuration);
        setMode(savedState.mode);

        if (savedState.mode === 'pomodoro') {
          setPomodoroPhase(savedState.pomodoroPhase);
          setSessionNumber(savedState.sessionNumber);
        }

        if (savedState.pausedAt) {
          pausedAtRef.current = new Date(savedState.pausedAt);
          setIsPaused(true);
        } else {
          pausedAtRef.current = null;
          setIsPaused(false);
        }

        setIsRunning(true);
        setElapsedSeconds(calculateElapsed());
      } else if (session.startTime) {
        // Determine mode from session
        const sessionMode: TimerMode = session.isPomodoro ? 'pomodoro' : 'focus';
        setMode(sessionMode);

        if (session.isPomodoro) {
          setPomodoroPhase('work');
          setSessionNumber(session.sessionNumber || 1);
          await startPomodoro(session.taskId);
        } else {
          await startFocus(session.durationMinutes);
        }
      }
    };

    restoreState();
  }, [session?.id, session?.status]);

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
        complete();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, calculateElapsed, durationSeconds, complete]);

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
    mode,
    pomodoroPhase,
    sessionNumber,
    settings,
    startFocus,
    startPomodoro,
    startBreak,
    pause,
    resume,
    stop,
    complete,
    skip,
    reset,
  };
}
