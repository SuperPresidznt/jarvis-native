/**
 * useNotifications Hook
 * Manages notification state, permissions, and handlers
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerNotificationCategories,
  createNotificationChannels,
  handleNotificationResponse,
  checkPermissions as checkNotificationPermissions,
} from '../services/notificationManager';
import { requestPermissions } from '../services/notifications';

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

export interface UseNotificationsResult {
  permissionStatus: NotificationPermissionStatus | null;
  isLoading: boolean;
  requestPermissions: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  hasPermission: boolean;
}

/**
 * Hook to manage notification permissions and setup
 */
export function useNotifications(): UseNotificationsResult {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const receivedListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const initialized = useRef<boolean>(false);

  /**
   * Check current permission status
   */
  const checkPermissions = useCallback(async () => {
    try {
      const result = await Notifications.getPermissionsAsync();
      const status = result.status;
      const granted = result.granted;
      const canAskAgain = result.canAskAgain ?? true;

      setPermissionStatus({
        granted,
        canAskAgain,
        status,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('[useNotifications] Error checking permissions:', error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Request notification permissions
   */
  const requestNotificationPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await requestPermissions();

      await checkPermissions();

      if (granted) {
        // Register categories and channels after permission granted
        await registerNotificationCategories();
        await createNotificationChannels();
      }

      return granted;
    } catch (error) {
      console.error('[useNotifications] Error requesting permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkPermissions]);

  /**
   * Setup notification handlers
   */
  const setupNotificationHandlers = useCallback(() => {
    if (initialized.current) return;

    // Handle notification responses (when user taps on notification or action)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        console.log('[useNotifications] Notification response received:', response);
        await handleNotificationResponse(response);
      }
    );

    // Handle notifications received while app is foregrounded
    receivedListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[useNotifications] Notification received:', notification);
    });

    initialized.current = true;

    console.log('[useNotifications] Notification handlers registered');
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    const initialize = async () => {
      await checkPermissions();

      // If we have permission, register categories and channels
      if (permissionStatus?.granted) {
        await registerNotificationCategories();
        await createNotificationChannels();
      }

      setupNotificationHandlers();
    };

    initialize();

    // Cleanup
    return () => {
      responseListener.current?.remove();
      receivedListener.current?.remove();
    };
  }, [checkPermissions, setupNotificationHandlers, permissionStatus?.granted]);

  return {
    permissionStatus,
    isLoading,
    requestPermissions: requestNotificationPermissions,
    checkPermissions,
    hasPermission: permissionStatus?.granted ?? false,
  };
}

/**
 * Hook to manage notification action handlers
 * This is a simpler hook that just registers the action listener
 */
export function useNotificationActions() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        await handleNotificationResponse(response);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

export default useNotifications;
