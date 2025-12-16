/**
 * Notification Manager Service
 * Central service for scheduling and managing all notification types
 */

import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { requestPermissions, cancelNotification as cancelExpoNotification } from './notifications';
import { logNotification, updateNotificationAction } from '../database/notifications';
import { updateTask } from '../database/tasks';
import { updateHabit } from '../database/habits';
import { logHabitCompletion } from '../database/habits';
import type { Task } from '../database/tasks';
import type { Habit } from '../database/habits';
import type { RecurringAlarm } from '../database/alarms';
import type { NotificationAction } from '../database/notifications';

/**
 * Register notification categories with actions
 */
export async function registerNotificationCategories(): Promise<void> {
  try {
    await Notifications.setNotificationCategoryAsync('TASK_REMINDER', [
      {
        identifier: 'COMPLETE',
        buttonTitle: 'Mark Complete',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'SNOOZE',
        buttonTitle: 'Snooze 30m',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'OPEN',
        buttonTitle: 'Open',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('HABIT_REMINDER', [
      {
        identifier: 'COMPLETE',
        buttonTitle: 'Mark Done',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'SKIP',
        buttonTitle: 'Skip Today',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'OPEN',
        buttonTitle: 'Open',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('CALENDAR_REMINDER', [
      {
        identifier: 'OPEN',
        buttonTitle: 'View',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'DISMISS',
        buttonTitle: 'Dismiss',
        options: { opensAppToForeground: false },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('ALARM', [
      {
        identifier: 'DISMISS',
        buttonTitle: 'Dismiss',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'SNOOZE',
        buttonTitle: 'Snooze 10m',
        options: { opensAppToForeground: false },
      },
    ]);

    console.log('[NotificationManager] Categories registered');
  } catch (error) {
    console.error('[NotificationManager] Error registering categories:', error);
  }
}

/**
 * Create notification channels for Android
 */
export async function createNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync('tasks', {
      name: 'Task Reminders',
      description: 'Notifications for task deadlines and reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Habit Reminders',
      description: 'Daily reminders for your habits',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('calendar', {
      name: 'Calendar Events',
      description: 'Notifications for upcoming calendar events',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F59E0B',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('alarms', {
      name: 'Alarms',
      description: 'Recurring daily alarms',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#EF4444',
      sound: 'default',
    });

    console.log('[NotificationManager] Channels created');
  } catch (error) {
    console.error('[NotificationManager] Error creating channels:', error);
  }
}

/**
 * Schedule a task reminder
 */
export async function scheduleTaskReminder(task: Task): Promise<string | null> {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('[NotificationManager] Permission not granted for task reminder');
    return null;
  }

  // Cancel existing notification if any
  if (task.notificationId) {
    await cancelNotification(task.notificationId);
  }

  let triggerDate: Date | null = null;

  // Specific time reminder
  if (task.reminderTime) {
    triggerDate = new Date(task.reminderTime);
  }
  // Relative reminder (X minutes before due date)
  else if (task.reminderMinutes && task.dueDate) {
    const dueDate = new Date(task.dueDate);
    triggerDate = new Date(dueDate.getTime() - task.reminderMinutes * 60 * 1000);
  }

  if (!triggerDate || triggerDate <= new Date()) {
    console.log('[NotificationManager] Trigger date is in the past, skipping');
    return null;
  }

  const trigger: any = {
    date: triggerDate,
  };

  if (Platform.OS === 'android') {
    trigger.channelId = 'tasks';
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Task Reminder: ${task.title}`,
        body: task.description || 'You have a task due soon',
        data: {
          type: 'task',
          taskId: task.id,
          action: 'open',
        },
        categoryIdentifier: 'TASK_REMINDER',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    // Log to history
    await logNotification({
      notificationType: 'task',
      referenceId: task.id,
      title: `Task Reminder: ${task.title}`,
      body: task.description || 'You have a task due soon',
      scheduledTime: triggerDate.toISOString(),
    });

    // Update task with notification ID
    await updateTask(task.id, { notificationId });

    console.log('[NotificationManager] Scheduled task reminder:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('[NotificationManager] Error scheduling task reminder:', error);
    return null;
  }
}

/**
 * Schedule a habit reminder
 */
export async function scheduleHabitReminder(habit: Habit): Promise<string | null> {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('[NotificationManager] Permission not granted for habit reminder');
    return null;
  }

  if (!habit.reminderTime) {
    return null;
  }

  // Cancel existing notification if any
  if (habit.notificationId) {
    await cancelNotification(habit.notificationId);
  }

  // Parse reminder time (format: "HH:MM")
  const [hours, minutes] = habit.reminderTime.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error('[NotificationManager] Invalid reminder time format');
    return null;
  }

  const trigger: any = {
    hour: hours,
    minute: minutes,
    repeats: true,
  };

  if (Platform.OS === 'android') {
    trigger.channelId = 'habits';
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Time to complete: ${habit.name}`,
        data: {
          type: 'habit',
          habitId: habit.id,
          habitName: habit.name,
        },
        categoryIdentifier: 'HABIT_REMINDER',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    // Log to history
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);
    if (nextTrigger <= new Date()) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }

    await logNotification({
      notificationType: 'habit',
      referenceId: habit.id,
      title: 'Habit Reminder',
      body: `Time to complete: ${habit.name}`,
      scheduledTime: nextTrigger.toISOString(),
    });

    // Update habit with notification ID
    await updateHabit(habit.id, { notificationId });

    console.log('[NotificationManager] Scheduled habit reminder:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('[NotificationManager] Error scheduling habit reminder:', error);
    return null;
  }
}

/**
 * Schedule a calendar event reminder
 */
export async function scheduleCalendarReminder(
  eventId: string,
  title: string,
  startTime: string,
  reminderMinutes: number
): Promise<string | null> {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('[NotificationManager] Permission not granted for calendar reminder');
    return null;
  }

  const startDate = new Date(startTime);
  const triggerDate = new Date(startDate.getTime() - reminderMinutes * 60 * 1000);

  if (triggerDate <= new Date()) {
    console.log('[NotificationManager] Calendar trigger date is in the past, skipping');
    return null;
  }

  const trigger: any = {
    date: triggerDate,
  };

  if (Platform.OS === 'android') {
    trigger.channelId = 'calendar';
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Event Reminder',
        body: `${title} starts in ${reminderMinutes} minutes`,
        data: {
          type: 'calendar',
          eventId,
          eventTitle: title,
        },
        categoryIdentifier: 'CALENDAR_REMINDER',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    // Log to history
    await logNotification({
      notificationType: 'calendar',
      referenceId: eventId,
      title: 'Event Reminder',
      body: `${title} starts in ${reminderMinutes} minutes`,
      scheduledTime: triggerDate.toISOString(),
    });

    console.log('[NotificationManager] Scheduled calendar reminder:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('[NotificationManager] Error scheduling calendar reminder:', error);
    return null;
  }
}

/**
 * Schedule a recurring alarm
 */
export async function scheduleRecurringAlarm(alarm: RecurringAlarm): Promise<string | null> {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('[NotificationManager] Permission not granted for alarm');
    return null;
  }

  if (!alarm.isEnabled) {
    return null;
  }

  // Cancel existing notification if any
  if (alarm.notificationId) {
    await cancelNotification(alarm.notificationId);
  }

  // Parse alarm time (format: "HH:MM")
  const [hours, minutes] = alarm.time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error('[NotificationManager] Invalid alarm time format');
    return null;
  }

  const trigger: any = {
    hour: hours,
    minute: minutes,
    repeats: true,
  };

  if (Platform.OS === 'android') {
    trigger.channelId = 'alarms';
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.title,
        body: alarm.description || 'Daily alarm',
        data: {
          type: 'alarm',
          alarmId: alarm.id,
          alarmType: alarm.alarmType,
        },
        categoryIdentifier: 'ALARM',
        sound: true,
        priority: alarm.alarmType === 'urgent'
          ? Notifications.AndroidNotificationPriority.MAX
          : Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    // Log to history
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);
    if (nextTrigger <= new Date()) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }

    await logNotification({
      notificationType: 'alarm',
      referenceId: alarm.id,
      title: alarm.title,
      body: alarm.description || 'Daily alarm',
      scheduledTime: nextTrigger.toISOString(),
    });

    console.log('[NotificationManager] Scheduled recurring alarm:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('[NotificationManager] Error scheduling recurring alarm:', error);
    return null;
  }
}

/**
 * Snooze a task reminder
 */
export async function snoozeTaskReminder(taskId: string, minutes: number = 30): Promise<void> {
  try {
    const { getTask } = await import('../database/tasks');
    const task = await getTask(taskId);

    if (!task) {
      console.error('[NotificationManager] Task not found for snooze');
      return;
    }

    // Cancel existing reminder
    if (task.notificationId) {
      await cancelNotification(task.notificationId);
    }

    // Calculate snooze time
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);

    // Schedule new reminder
    const trigger: any = {
      date: snoozeUntil,
    };

    if (Platform.OS === 'android') {
      trigger.channelId = 'tasks';
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Snoozed: ${task.title}`,
        body: task.description || 'Reminder',
        data: {
          type: 'task',
          taskId: task.id,
        },
        categoryIdentifier: 'TASK_REMINDER',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    // Update task
    await updateTask(taskId, {
      notificationId,
      snoozeUntil: snoozeUntil.toISOString(),
    });

    console.log('[NotificationManager] Snoozed task reminder:', notificationId);
  } catch (error) {
    console.error('[NotificationManager] Error snoozing task reminder:', error);
  }
}

/**
 * Cancel a notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await cancelExpoNotification(notificationId);
  } catch (error) {
    console.error('[NotificationManager] Error cancelling notification:', error);
  }
}

/**
 * Handle notification response with actions
 */
export async function handleNotificationResponse(response: Notifications.NotificationResponse): Promise<void> {
  const { notification, actionIdentifier } = response;
  const data = notification.request.content.data;

  console.log('[NotificationManager] Notification response:', actionIdentifier, data);

  try {
    // Log action to history
    if (data.type && data.taskId || data.habitId || data.eventId || data.alarmId) {
      const referenceId = data.taskId || data.habitId || data.eventId || data.alarmId;
      // We would need to find the history entry and update it
      // For now, just log the action
      console.log('[NotificationManager] Action taken:', actionIdentifier, 'for', referenceId);
    }

    // Handle task actions
    if (data.type === 'task' && typeof data.taskId === 'string') {
      if (actionIdentifier === 'COMPLETE') {
        const { updateTask } = await import('../database/tasks');
        await updateTask(data.taskId as string, {
          status: 'completed',
          completedAt: new Date().toISOString(),
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (actionIdentifier === 'SNOOZE') {
        await snoozeTaskReminder(data.taskId as string, 30);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
    // Handle habit actions
    else if (data.type === 'habit' && typeof data.habitId === 'string') {
      if (actionIdentifier === 'COMPLETE') {
        const today = new Date().toISOString().split('T')[0];
        await logHabitCompletion(data.habitId as string, today, true);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (actionIdentifier === 'SKIP') {
        const today = new Date().toISOString().split('T')[0];
        await logHabitCompletion(data.habitId as string, today, false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
    // Handle alarm actions
    else if (data.type === 'alarm') {
      if (actionIdentifier === 'SNOOZE') {
        // For alarms, we snooze for 10 minutes
        const snoozeDate = new Date(Date.now() + 10 * 60 * 1000);

        const trigger: any = {
          date: snoozeDate,
        };

        if (Platform.OS === 'android') {
          trigger.channelId = 'alarms';
        }

        const originalContent = notification.request.content;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: originalContent.title,
            body: originalContent.body,
            data: originalContent.data,
            sound: true,
            categoryIdentifier: originalContent.categoryIdentifier || undefined,
          },
          trigger,
        });

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  } catch (error) {
    console.error('[NotificationManager] Error handling notification response:', error);
  }
}

/**
 * Check notification permissions status
 */
export async function checkPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export default {
  registerNotificationCategories,
  createNotificationChannels,
  scheduleTaskReminder,
  scheduleHabitReminder,
  scheduleCalendarReminder,
  scheduleRecurringAlarm,
  snoozeTaskReminder,
  cancelNotification,
  handleNotificationResponse,
  checkPermissions,
};
