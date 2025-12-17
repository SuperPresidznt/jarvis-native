/**
 * Phone-In Mode Hook
 * Manages DND (Do Not Disturb) mode and full-screen focus mode
 *
 * TEMPORARILY DISABLED: expo-notifications/expo-haptics break release builds
 */

import { useState, useEffect, useCallback } from 'react';
// TEMPORARILY DISABLED
// import * as Notifications from 'expo-notifications';
// import * as Haptics from 'expo-haptics';
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
 * TEMPORARILY DISABLED
 */
export function usePhoneInMode(): UsePhoneInModeReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDndActive, setIsDndActive] = useState(false);

  /**
   * Enable phone-in mode (DND + notifications)
   * TEMPORARILY DISABLED
   */
  const enable = useCallback(async () => {
    try {
      // TEMPORARILY DISABLED
      setIsEnabled(true);
      setIsDndActive(true);
      console.log('[PhoneInMode] Enabled (DISABLED MODE)');
    } catch (error) {
      console.error('Failed to enable phone-in mode:', error);
      throw error;
    }
  }, []);

  /**
   * Disable phone-in mode
   * TEMPORARILY DISABLED
   */
  const disable = useCallback(async () => {
    try {
      setIsEnabled(false);
      setIsDndActive(false);
      console.log('[PhoneInMode] Disabled (DISABLED MODE)');
    } catch (error) {
      console.error('Failed to disable phone-in mode:', error);
      throw error;
    }
  }, []);

  /**
   * Trigger break notification (after 25 minutes by default)
   * TEMPORARILY DISABLED
   */
  const triggerBreakNotification = useCallback(async () => {
    console.log('[PhoneInMode] Break notification triggered (DISABLED)');
  }, []);

  /**
   * Trigger completion haptic feedback
   * TEMPORARILY DISABLED
   */
  const triggerCompletionHaptic = useCallback(async () => {
    console.log('[PhoneInMode] Completion haptic triggered (DISABLED)');
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
