/**
 * Deep Linking Configuration
 * Maps URL patterns to screens with parameters
 */

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['yarvi://', 'https://yarvi.app'],
  config: {
    screens: {
      Main: {
        screens: {
          // Home tab
          Dashboard: 'dashboard',

          // Tasks tab
          Tasks: {
            path: 'tasks',
            parse: {
              taskId: (taskId: string) => taskId,
            },
          },

          // Focus tab
          Focus: 'focus',

          // Track tab (Habits + Calendar)
          Track: {
            path: 'track',
            parse: {
              view: (view: string) => view as 'habits' | 'calendar',
              habitId: (habitId: string) => habitId,
              eventId: (eventId: string) => eventId,
            },
          },

          // More tab (stack navigator)
          More: {
            screens: {
              MoreMenu: '',
              Finance: 'finance',
              AIChat: {
                path: 'ai',
                parse: {
                  conversationId: (id: string) => id,
                },
              },
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
export function subscribe(_listener: (url: string) => void): () => void {
  // For mobile, we need to use Linking.addEventListener()
  // This is handled by NavigationContainer automatically
  return () => {
    // Cleanup
  };
}
