/**
 * Deep Linking Configuration
 * Maps URL patterns to screens with parameters
 */

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['jarvis://', 'https://jarvis.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Dashboard: 'dashboard',
          AIChat: {
            path: 'ai',
            screens: {
              AIChatMain: 'chat',
              ConversationDetail: 'chat/:conversationId',
            },
          },
          Tasks: {
            path: 'tasks',
            screens: {
              TasksList: '',
              TaskDetail: 'task/:taskId',
            },
          },
          Projects: {
            path: 'projects',
            screens: {
              ProjectsList: '',
              ProjectDetail: 'project/:projectId',
            },
          },
          Habits: {
            path: 'habits',
            screens: {
              HabitsList: '',
              HabitDetail: 'habit/:habitId',
            },
          },
          Calendar: {
            path: 'calendar',
            screens: {
              CalendarMain: '',
              EventDetail: 'event/:eventId',
            },
          },
          Finance: 'finance',
          Focus: 'focus',
          Pomodoro: 'pomodoro',
          Settings: {
            path: 'settings',
            screens: {
              SettingsMain: '',
              StorageOverview: 'storage',
              DataManagement: 'data',
              CategoryManagement: 'categories',
            },
          },
        },
      },
      Search: 'search',
      Login: 'login',
      Register: 'register',
      Onboarding: 'onboarding',
    },
  },
};

/**
 * Get the initial URL that opened the app
 */
export async function getInitialURL(): Promise<string | null> {
  // For mobile, we need to use Linking.getInitialURL()
  // This is handled by NavigationContainer automatically
  return null;
}

/**
 * Subscribe to URL changes (deep links while app is running)
 */
export function subscribe(listener: (url: string) => void): () => void {
  // For mobile, we need to use Linking.addEventListener()
  // This is handled by NavigationContainer automatically
  return () => {
    // Cleanup
  };
}
