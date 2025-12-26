/**
 * Jarvis Mobile - Main App Entry Point
 * Offline-first React Native personal assistant
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainerRef } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from './src/navigation/RootNavigator';
import { initDatabase } from './src/database';
import { useThemeStore } from './src/store/themeStore';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { getColors, spacing, typography } from './src/theme';
import * as notificationService from './src/services/notifications';
import { toastConfig } from './src/components/ui/UndoToast';
import { RootStackParamList } from './src/types';
import { initSentry, SentryErrorBoundary } from './src/services/sentry';
import * as performance from './src/utils/performance';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const getResolvedMode = useThemeStore((state) => state.getResolvedMode);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Start measuring app startup time
        performance.markStart('app-initialization', 'app-startup');
        console.log('[App] Initializing...');

        // Initialize Sentry error tracking (production only)
        initSentry();

        // Load theme preference
        performance.markStart('theme-load', 'app-startup');
        await loadTheme();
        performance.markEnd('theme-load', 'app-startup');
        console.log('[App] Theme loaded');

        // Initialize database
        await initDatabase();
        console.log('[App] Database initialized');

        // NOTE: Sample data seeding is DISABLED for production use
        // Users start with a clean, empty database
        // To enable demo data, uncomment the lines below:
        //
        // const shouldSeed = await needsSeeding();
        // if (shouldSeed) {
        //   console.log('[App] Seeding database with sample data...');
        //   await seedDatabase();
        //   console.log('[App] Database seeded successfully');
        // }

        // End measuring app startup time
        performance.markEnd('app-initialization', 'app-startup');
        setIsReady(true);
      } catch (error) {
        console.error('[App] Failed to initialize:', error);
        performance.markEnd('app-initialization', 'app-startup', { error: true });
        setInitError(error instanceof Error ? error.message : 'Failed to initialize app');
        setIsReady(true); // Still show app, but with error state
      }
    }

    prepare();
  }, [loadTheme]);

  // Set up notification tap handler
  useEffect(() => {
    const unsubscribe = notificationService.addNotificationResponseListener((data) => {
      console.log('[App] Notification tapped:', data);

      // Handle habit reminders
      if (data.type === 'habit' && navigationRef.current) {
        // Navigate to Habits tab
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigationRef.current as any).navigate('Main', {
          screen: 'Habits',
        });
      }

      // Handle event reminders
      if (data.type === 'event' && navigationRef.current) {
        // Navigate to Calendar tab
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigationRef.current as any).navigate('Main', {
          screen: 'Calendar',
        });
      }
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    const colors = getColors(getResolvedMode());
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Initializing Jarvis...</Text>
      </View>
    );
  }

  if (initError) {
    const colors = getColors(getResolvedMode());
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Initialization Error</Text>
        <Text style={[styles.errorMessage, { color: colors.text.secondary }]}>{initError}</Text>
      </View>
    );
  }

  const resolvedMode = getResolvedMode();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PaperProvider>
              <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
              <RootNavigator navigationRef={navigationRef} />
              <Toast config={toastConfig} />
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.base,
    fontSize: typography.size.base,
  },
  errorText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.size.sm,
    textAlign: 'center',
    paddingHorizontal: spacing['2xl'],
  },
});

// Wrap app with Sentry error boundary for crash reporting
export default SentryErrorBoundary(App);
