/**
 * Dialog Utilities
 * Provides consistent confirmation and alert dialogs
 */

import { Alert, Platform } from 'react-native';
import { haptic } from './haptics';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Show a confirmation dialog for destructive actions
 * Automatically triggers haptic feedback
 *
 * @example
 * ```typescript
 * confirmDestructive({
 *   title: 'Delete Task',
 *   message: 'Are you sure you want to delete this task? This action cannot be undone.',
 *   confirmText: 'Delete',
 *   onConfirm: async () => {
 *     await deleteTask(taskId);
 *   }
 * });
 * ```
 */
export function confirmDestructive(options: ConfirmOptions): void {
  const {
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  } = options;

  // Trigger warning haptic
  haptic.warning();

  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: () => {
          haptic.light();
          onCancel?.();
        },
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: async () => {
          haptic.heavy();
          await onConfirm();
        },
      },
    ],
    { cancelable: true }
  );
}

/**
 * Show a confirmation dialog for non-destructive actions
 *
 * @example
 * ```typescript
 * confirm({
 *   title: 'Complete Task',
 *   message: 'Mark this task as complete?',
 *   confirmText: 'Complete',
 *   onConfirm: async () => {
 *     await completeTask(taskId);
 *   }
 * });
 * ```
 */
export function confirm(options: ConfirmOptions): void {
  const {
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  } = options;

  // Trigger light haptic
  haptic.light();

  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: () => {
          haptic.light();
          onCancel?.();
        },
      },
      {
        text: confirmText,
        onPress: async () => {
          haptic.medium();
          await onConfirm();
        },
      },
    ],
    { cancelable: true }
  );
}

/**
 * Show a success alert
 */
export function alertSuccess(title: string, message?: string): void {
  haptic.success();
  Alert.alert(title, message, [{ text: 'OK', onPress: () => haptic.light() }]);
}

/**
 * Show an error alert
 */
export function alertError(title: string, message?: string): void {
  haptic.error();
  Alert.alert(title, message, [{ text: 'OK', onPress: () => haptic.light() }]);
}

/**
 * Show a warning alert
 */
export function alertWarning(title: string, message?: string): void {
  haptic.warning();
  Alert.alert(title, message, [{ text: 'OK', onPress: () => haptic.light() }]);
}

/**
 * Semantic confirmation helpers for common actions
 */
export const confirmations = {
  /**
   * Confirm task deletion
   */
  deleteTask: (taskTitle: string, onConfirm: () => void | Promise<void>) => {
    confirmDestructive({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm,
    });
  },

  /**
   * Confirm project deletion
   */
  deleteProject: (projectName: string, onConfirm: () => void | Promise<void>) => {
    confirmDestructive({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${projectName}" and all its tasks? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm,
    });
  },

  /**
   * Confirm habit deletion
   */
  deleteHabit: (habitName: string, onConfirm: () => void | Promise<void>) => {
    confirmDestructive({
      title: 'Delete Habit',
      message: `Are you sure you want to delete "${habitName}" and all its logs? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm,
    });
  },

  /**
   * Confirm bulk deletion
   */
  deleteBulk: (count: number, itemType: string, onConfirm: () => void | Promise<void>) => {
    confirmDestructive({
      title: `Delete ${count} ${itemType}${count > 1 ? 's' : ''}`,
      message: `Are you sure you want to delete ${count} ${itemType}${count > 1 ? 's' : ''}? This action cannot be undone.`,
      confirmText: 'Delete All',
      onConfirm,
    });
  },

  /**
   * Confirm data clear
   */
  clearData: (dataType: string, onConfirm: () => void | Promise<void>) => {
    confirmDestructive({
      title: `Clear ${dataType}`,
      message: `Are you sure you want to clear all ${dataType}? This action cannot be undone.`,
      confirmText: 'Clear',
      onConfirm,
    });
  },

  /**
   * Confirm leaving unsaved changes
   */
  unsavedChanges: (onConfirm: () => void | Promise<void>, onCancel?: () => void) => {
    confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      confirmText: 'Leave',
      cancelText: 'Stay',
      destructive: true,
      onConfirm,
      onCancel,
    });
  },

  /**
   * Confirm logout
   */
  logout: (onConfirm: () => void | Promise<void>) => {
    confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      onConfirm,
    });
  },
};
