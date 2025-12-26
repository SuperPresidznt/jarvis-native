/**
 * Sentry Error Tracking Service
 * Centralized Sentry configuration and initialization
 *
 * Only enabled in production (when __DEV__ is false)
 * Requires EXPO_PUBLIC_SENTRY_DSN environment variable
 */

import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';

/**
 * Initialize Sentry error tracking
 * Call this early in the app lifecycle (App.tsx)
 */
export function initSentry(): void {
  // Only enable Sentry in production builds
  if (__DEV__) {
    console.log('[Sentry] Skipping initialization in development mode');
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('[Sentry] DSN not configured. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: __DEV__ ? 'development' : 'production',
      enabled: !__DEV__,

      // Performance monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring

      // Enable native crash handling
      enableNative: true,
      enableNativeCrashHandling: true,

      // Enable automatic session tracking
      enableAutoSessionTracking: true,

      // Session timeout (default: 30 seconds)
      sessionTrackingIntervalMillis: 30000,

      // Release and version tracking
      release: APP_CONFIG.VERSION,
      dist: Platform.OS === 'ios' ? 'ios' : 'android',

      // Filter events before sending
      beforeSend(event) {
        // Don't send events in development mode
        if (__DEV__) {
          return null;
        }

        // Filter out any sensitive data if needed
        // Example: Remove PII from event context

        return event;
      },

      // Breadcrumbs configuration
      maxBreadcrumbs: 50,

      // Debug mode (logs to console)
      debug: false,

      // Attach stack trace to messages
      attachStacktrace: true,
    });

    console.log('[Sentry] Initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}

/**
 * Set user context for error reports
 */
export function setSentryUser(userId: string, userInfo?: { email?: string; username?: string }): void {
  if (__DEV__) return;

  Sentry.setUser({
    id: userId,
    ...userInfo,
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearSentryUser(): void {
  if (__DEV__) return;

  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging context
 */
export function addSentryBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  if (__DEV__) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  if (__DEV__) {
    console.error('[Sentry] Exception:', error, context);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void {
  if (__DEV__) {
    console.log(`[Sentry] Message (${level}):`, message, context);
    return;
  }

  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set custom context for error reports
 */
export function setSentryContext(key: string, context: Record<string, any>): void {
  if (__DEV__) return;

  Sentry.setContext(key, context);
}

/**
 * Set a tag for error reports
 */
export function setSentryTag(key: string, value: string): void {
  if (__DEV__) return;

  Sentry.setTag(key, value);
}

/**
 * Wrap the root component with Sentry error boundary
 * This should wrap the entire app to catch unhandled errors
 */
export const SentryErrorBoundary = Sentry.wrap;

// Re-export Sentry for advanced usage
export { Sentry };
