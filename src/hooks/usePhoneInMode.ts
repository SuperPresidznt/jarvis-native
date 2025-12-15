/**
 * Phone-In Mode Hook
 * Manages DND (Do Not Disturb) mode and full-screen focus mode
 */

import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface UsePhoneInModeReturn {
  isEnabled: boolean;
  isDndActive: boolean;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  triggerBreakNotification: () => Promise<void>;
  triggerCompletionHaptic: () => Promise<void>;
}

/**
 * Hook for managing phone-in mode (DND + full-screen focus)
 */
export function usePhoneInMode(): UsePhoneInModeReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDndActive, setIsDndActive] = useState(false);

  /**
   * Enable phone-in mode (DND + notifications)
   */
  const enable = useCallback(async () => {
    try {
      // Request notification permissions if not already granted
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted for phone-in mode');
        // Still enable mode without notifications
      }

      // Enable phone-in mode
      setIsEnabled(true);

      // Note: React Native/Expo doesn't have direct DND API access
      // DND must be managed by the user or through native modules
      // We'll simulate DND by showing a full-screen modal that blocks interaction
      setIsDndActive(true);

      // Trigger haptic feedback on enable
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('[PhoneInMode] Enabled');
    } catch (error) {
      console.error('Failed to enable phone-in mode:', error);
      throw error;
    }
  }, []);

  /**
   * Disable phone-in mode
   */
  const disable = useCallback(async () => {
    try {
      setIsEnabled(false);
      setIsDndActive(false);

      // Trigger haptic feedback on disable
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log('[PhoneInMode] Disabled');
    } catch (error) {
      console.error('Failed to disable phone-in mode:', error);
      throw error;
    }
  }, []);

  /**
   * Trigger break notification (after 25 minutes by default)
   */
  const triggerBreakNotification = useCallback(async () => {
    try {
      // Check if notifications are enabled
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Cannot trigger break notification - permissions not granted');
        // Still trigger haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      // Schedule immediate notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for a Break',
          body: 'Take a 5-minute break to recharge.',
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Immediate
      });

      // Trigger haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      console.log('[PhoneInMode] Break notification triggered');
    } catch (error) {
      console.error('Failed to trigger break notification:', error);
    }
  }, []);

  /**
   * Trigger completion haptic feedback
   */
  const triggerCompletionHaptic = useCallback(async () => {
    try {
      // Triple haptic pattern for completion
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log('[PhoneInMode] Completion haptic triggered');
    } catch (error) {
      console.error('Failed to trigger completion haptic:', error);
    }
  }, []);

  /**
   * Auto-disable on unmount (safety)
   */
  useEffect(() => {
    return () => {
      if (isEnabled) {
        disable();
      }
    };
  }, []);

  return {
    isEnabled,
    isDndActive,
    enable,
    disable,
    triggerBreakNotification,
    triggerCompletionHaptic,
  };
}
