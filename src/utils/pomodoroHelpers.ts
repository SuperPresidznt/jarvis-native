/**
 * Pomodoro Helper Functions
 * Utility functions for pomodoro timer logic
 */

import { PomodoroSettings } from '../database/focusSessions';

export type PomodoroPhase = 'work' | 'short_break' | 'long_break';

/**
 * Calculate the next phase based on current session number
 */
export function getNextPhase(
  currentSessionNumber: number,
  settings: PomodoroSettings
): PomodoroPhase {
  // After work session, determine break type
  if (currentSessionNumber % settings.sessionsUntilLongBreak === 0) {
    return 'long_break';
  }
  return 'short_break';
}

/**
 * Get the duration in seconds for a given phase
 */
export function getPhaseDuration(
  phase: PomodoroPhase,
  settings: PomodoroSettings
): number {
  switch (phase) {
    case 'work':
      return settings.workDuration * 60;
    case 'short_break':
      return settings.shortBreak * 60;
    case 'long_break':
      return settings.longBreak * 60;
  }
}

/**
 * Get the break duration in minutes for a given session number
 */
export function getBreakDuration(
  sessionNumber: number,
  settings: PomodoroSettings
): number {
  const phase = getNextPhase(sessionNumber, settings);
  return phase === 'long_break' ? settings.longBreak : settings.shortBreak;
}

/**
 * Format time in mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time in human readable format (e.g., "25m", "1h 15m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(timeRemaining: number, totalDuration: number): number {
  if (totalDuration === 0) return 0;
  return ((totalDuration - timeRemaining) / totalDuration) * 100;
}

/**
 * Get phase display name
 */
export function getPhaseDisplayName(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work':
      return 'Focus Time';
    case 'short_break':
      return 'Short Break';
    case 'long_break':
      return 'Long Break';
  }
}

/**
 * Get phase icon
 */
export function getPhaseIcon(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work':
      return 'brain';
    case 'short_break':
      return 'coffee';
    case 'long_break':
      return 'spa';
  }
}

/**
 * Get phase color
 */
export function getPhaseColor(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work':
      return '#10B981'; // Primary green
    case 'short_break':
      return '#3B82F6'; // Blue
    case 'long_break':
      return '#8B5CF6'; // Purple
  }
}

/**
 * Generate session summary text
 */
export function generateSessionSummary(
  completedSessions: number,
  totalMinutes: number
): string {
  if (completedSessions === 0) {
    return 'No pomodoros completed yet today';
  }

  if (completedSessions === 1) {
    return `1 pomodoro completed (${totalMinutes}m)`;
  }

  return `${completedSessions} pomodoros completed (${formatDuration(totalMinutes)})`;
}

/**
 * Calculate next session number
 */
export function getNextSessionNumber(
  currentSessionNumber: number,
  phase: PomodoroPhase,
  settings: PomodoroSettings
): number {
  if (phase === 'long_break') {
    return 1; // Reset cycle after long break
  }
  return currentSessionNumber + 1;
}

/**
 * Determine if current session is the last before long break
 */
export function isLastBeforeLongBreak(
  sessionNumber: number,
  settings: PomodoroSettings
): boolean {
  return sessionNumber % settings.sessionsUntilLongBreak === 0;
}

/**
 * Get completion message based on session number
 */
export function getCompletionMessage(
  sessionNumber: number,
  settings: PomodoroSettings
): string {
  if (isLastBeforeLongBreak(sessionNumber, settings)) {
    return 'Great work! Time for a long break.';
  }

  const remaining = settings.sessionsUntilLongBreak - (sessionNumber % settings.sessionsUntilLongBreak);
  if (remaining === 1) {
    return 'One more session until long break!';
  }

  return `Well done! ${remaining} more sessions until long break.`;
}

/**
 * Validate settings values
 */
export function validatePomodoroSettings(settings: Partial<PomodoroSettings>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.workDuration !== undefined) {
    if (settings.workDuration < 1 || settings.workDuration > 120) {
      errors.push('Work duration must be between 1 and 120 minutes');
    }
  }

  if (settings.shortBreak !== undefined) {
    if (settings.shortBreak < 1 || settings.shortBreak > 30) {
      errors.push('Short break must be between 1 and 30 minutes');
    }
  }

  if (settings.longBreak !== undefined) {
    if (settings.longBreak < 1 || settings.longBreak > 60) {
      errors.push('Long break must be between 1 and 60 minutes');
    }
  }

  if (settings.sessionsUntilLongBreak !== undefined) {
    if (settings.sessionsUntilLongBreak < 2 || settings.sessionsUntilLongBreak > 10) {
      errors.push('Sessions until long break must be between 2 and 10');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
