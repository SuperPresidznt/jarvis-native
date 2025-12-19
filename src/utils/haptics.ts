/**
 * Haptic Feedback Utilities
 * Provides consistent haptic feedback across the app
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger haptic feedback for selection changes
 * Used for: checkboxes, radio buttons, toggles, pickers
 */
export function hapticSelection() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.selectionAsync().catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger light haptic impact
 * Used for: button taps, card taps, minor interactions
 */
export function hapticLight() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger medium haptic impact
 * Used for: completing tasks, saving forms, confirmations
 */
export function hapticMedium() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger heavy haptic impact
 * Used for: deletions, important actions, alerts
 */
export function hapticHeavy() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger success haptic feedback
 * Used for: task completion, save success, sync success
 */
export function hapticSuccess() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger warning haptic feedback
 * Used for: validation warnings, caution states
 */
export function hapticWarning() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger error haptic feedback
 * Used for: errors, failed actions, deletions
 */
export function hapticError() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
      // Silently fail if haptics not supported
    });
  }
}

/**
 * Trigger double tap haptic pattern
 * Used for: special actions, long-press feedback
 */
export async function hapticDoubleTap() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 100);
    } catch {
      // Silently fail if haptics not supported
    }
  }
}

/**
 * Semantic haptic helpers for common actions
 */
export const haptic = {
  // Task actions
  taskComplete: hapticSuccess,
  taskDelete: hapticHeavy,
  taskCreate: hapticMedium,
  taskStatusChange: hapticSelection,

  // Habit actions
  habitComplete: hapticSuccess,
  habitStreak: hapticDoubleTap,

  // UI interactions
  buttonPress: hapticLight,
  toggleSwitch: hapticSelection,
  swipeAction: hapticMedium,
  longPress: hapticMedium,

  // Feedback
  success: hapticSuccess,
  error: hapticError,
  warning: hapticWarning,

  // Generic
  selection: hapticSelection,
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
};
