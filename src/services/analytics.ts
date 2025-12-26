/**
 * Analytics Service
 * Lightweight analytics tracking for beta app
 *
 * Tracks key events and user actions to understand app usage.
 * In development: logs to console
 * In production: POSTs to analytics endpoint (if configured)
 *
 * This is a simple implementation designed to be swapped out later
 * for a full analytics SDK (e.g., Mixpanel, Amplitude) as needed.
 */

import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';

// Event types for type safety
export type AnalyticsEvent =
  // Lifecycle events
  | 'app_open'
  | 'screen_view'
  | 'feature_used'
  // Core action events
  | 'task_created'
  | 'task_completed'
  | 'habit_logged'
  | 'focus_session_completed'
  | 'transaction_created';

// Event properties for additional context
export interface EventProperties {
  // Common properties
  screen_name?: string;
  feature_name?: string;

  // Task properties
  task_id?: string;
  task_priority?: string;
  task_status?: string;

  // Habit properties
  habit_id?: string;
  habit_type?: string;

  // Focus session properties
  focus_duration_minutes?: number;
  focus_completed?: boolean;

  // Transaction properties
  transaction_type?: 'income' | 'expense';
  transaction_amount?: number;
  transaction_category?: string;

  // Generic custom properties
  [key: string]: string | number | boolean | undefined;
}

// User properties for context
interface UserProperties {
  user_id?: string;
  platform: string;
  app_version: string;
  timezone: string;
}

// Analytics payload
interface AnalyticsPayload {
  event: AnalyticsEvent;
  properties: EventProperties;
  user: UserProperties;
  timestamp: string;
}

class AnalyticsService {
  private endpoint: string | null;
  private userId: string | null = null;
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    // Get analytics endpoint from environment (optional)
    this.endpoint = process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT || null;

    // Generate session ID for this app session
    this.sessionId = this.generateSessionId();

    // Enable analytics in both dev and production
    // In dev, we log to console; in prod, we send to endpoint
    this.isEnabled = true;

    if (__DEV__) {
      console.log('[Analytics] Initialized in development mode (console logging)');
    } else if (this.endpoint) {
      console.log('[Analytics] Initialized with endpoint:', this.endpoint);
    } else {
      console.log('[Analytics] Initialized without endpoint (console logging only)');
    }
  }

  /**
   * Set the current user ID for analytics context
   */
  setUserId(userId: string): void {
    this.userId = userId;
    if (__DEV__) {
      console.log('[Analytics] User ID set:', userId);
    }
  }

  /**
   * Clear user ID (e.g., on logout)
   */
  clearUserId(): void {
    this.userId = null;
    if (__DEV__) {
      console.log('[Analytics] User ID cleared');
    }
  }

  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent, properties: EventProperties = {}): void {
    if (!this.isEnabled) return;

    const payload: AnalyticsPayload = {
      event,
      properties: {
        ...properties,
        session_id: this.sessionId,
      },
      user: this.getUserProperties(),
      timestamp: new Date().toISOString(),
    };

    // In development, just log to console
    if (__DEV__) {
      console.log('[Analytics]', event, properties);
      return;
    }

    // In production, send to endpoint if configured
    if (this.endpoint) {
      this.sendToEndpoint(payload);
    } else {
      // Fallback: log to console even in production if no endpoint
      console.log('[Analytics]', event, properties);
    }
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string, properties: EventProperties = {}): void {
    this.track('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  trackFeature(featureName: string, properties: EventProperties = {}): void {
    this.track('feature_used', {
      feature_name: featureName,
      ...properties,
    });
  }

  /**
   * Track task creation
   */
  trackTaskCreated(taskId: string, priority?: string, properties: EventProperties = {}): void {
    this.track('task_created', {
      task_id: taskId,
      task_priority: priority,
      ...properties,
    });
  }

  /**
   * Track task completion
   */
  trackTaskCompleted(taskId: string, properties: EventProperties = {}): void {
    this.track('task_completed', {
      task_id: taskId,
      task_status: 'completed',
      ...properties,
    });
  }

  /**
   * Track habit logged
   */
  trackHabitLogged(habitId: string, habitType?: string, properties: EventProperties = {}): void {
    this.track('habit_logged', {
      habit_id: habitId,
      habit_type: habitType,
      ...properties,
    });
  }

  /**
   * Track focus session completed
   */
  trackFocusSessionCompleted(
    durationMinutes: number,
    completed: boolean,
    properties: EventProperties = {}
  ): void {
    this.track('focus_session_completed', {
      focus_duration_minutes: durationMinutes,
      focus_completed: completed,
      ...properties,
    });
  }

  /**
   * Track transaction created
   */
  trackTransactionCreated(
    type: 'income' | 'expense',
    amount: number,
    category: string,
    properties: EventProperties = {}
  ): void {
    this.track('transaction_created', {
      transaction_type: type,
      transaction_amount: amount,
      transaction_category: category,
      ...properties,
    });
  }

  /**
   * Get user properties for analytics context
   */
  private getUserProperties(): UserProperties {
    return {
      user_id: this.userId || undefined,
      platform: Platform.OS,
      app_version: APP_CONFIG.VERSION,
      timezone: APP_CONFIG.DEFAULT_TIMEZONE,
    };
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Send analytics payload to endpoint
   */
  private async sendToEndpoint(payload: AnalyticsPayload): Promise<void> {
    if (!this.endpoint) return;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('[Analytics] Failed to send event:', response.status);
      }
    } catch (error) {
      // Silently fail - don't let analytics errors break the app
      console.warn('[Analytics] Error sending event:', error);
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
export default analytics;
