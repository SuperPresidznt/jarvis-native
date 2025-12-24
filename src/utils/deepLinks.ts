/**
 * Deep Link Generation Utilities
 * Functions to generate deep links for sharing entities
 */

import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

const SCHEME = 'jarvis://';

/**
 * Generate a deep link for a task
 */
export function generateTaskLink(taskId: string): string {
  return `${SCHEME}tasks/task/${taskId}`;
}

/**
 * Generate a deep link for a habit
 */
export function generateHabitLink(habitId: string): string {
  return `${SCHEME}habits/habit/${habitId}`;
}

/**
 * Generate a deep link for a calendar event
 */
export function generateEventLink(eventId: string): string {
  return `${SCHEME}calendar/event/${eventId}`;
}

/**
 * Generate a deep link for a project
 */
export function generateProjectLink(projectId: string): string {
  return `${SCHEME}projects/project/${projectId}`;
}

/**
 * Generate a deep link for an AI conversation
 */
export function generateConversationLink(conversationId: string): string {
  return `${SCHEME}ai/chat/${conversationId}`;
}

/**
 * Copy a link to the clipboard and show confirmation
 */
export async function copyLinkToClipboard(link: string, entityName?: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(link);
    Alert.alert(
      'Link Copied',
      entityName
        ? `Link to "${entityName}" copied to clipboard`
        : 'Link copied to clipboard',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('Failed to copy link:', error);
    Alert.alert(
      'Error',
      'Failed to copy link to clipboard',
      [{ text: 'OK' }]
    );
  }
}

/**
 * Copy a task link to the clipboard
 */
export async function copyTaskLink(taskId: string, taskTitle?: string): Promise<void> {
  const link = generateTaskLink(taskId);
  await copyLinkToClipboard(link, taskTitle);
}

/**
 * Copy a habit link to the clipboard
 */
export async function copyHabitLink(habitId: string, habitName?: string): Promise<void> {
  const link = generateHabitLink(habitId);
  await copyLinkToClipboard(link, habitName);
}

/**
 * Copy an event link to the clipboard
 */
export async function copyEventLink(eventId: string, eventTitle?: string): Promise<void> {
  const link = generateEventLink(eventId);
  await copyLinkToClipboard(link, eventTitle);
}

/**
 * Copy a project link to the clipboard
 */
export async function copyProjectLink(projectId: string, projectName?: string): Promise<void> {
  const link = generateProjectLink(projectId);
  await copyLinkToClipboard(link, projectName);
}

/**
 * Copy a conversation link to the clipboard
 */
export async function copyConversationLink(conversationId: string, conversationTitle?: string): Promise<void> {
  const link = generateConversationLink(conversationId);
  await copyLinkToClipboard(link, conversationTitle);
}

/**
 * Parse a deep link URL and extract entity information
 */
export function parseDeepLink(url: string): {
  type: 'task' | 'habit' | 'event' | 'project' | 'conversation' | 'unknown';
  id?: string;
} {
  try {
    // Remove the scheme
    const path = url.replace(SCHEME, '').replace('https://jarvis.app/', '');

    // Parse the path
    const segments = path.split('/').filter(Boolean);

    if (segments.length < 2) {
      return { type: 'unknown' };
    }

    const [category, entityType, id] = segments;

    if (category === 'tasks' && entityType === 'task' && id) {
      return { type: 'task', id };
    }

    if (category === 'habits' && entityType === 'habit' && id) {
      return { type: 'habit', id };
    }

    if (category === 'calendar' && entityType === 'event' && id) {
      return { type: 'event', id };
    }

    if (category === 'projects' && entityType === 'project' && id) {
      return { type: 'project', id };
    }

    if (category === 'ai' && entityType === 'chat' && id) {
      return { type: 'conversation', id };
    }

    return { type: 'unknown' };
  } catch (error) {
    console.error('Failed to parse deep link:', error);
    return { type: 'unknown' };
  }
}
