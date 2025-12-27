/**
 * More Navigator
 * Stack navigation for secondary features: Finance, AI Chat, Settings
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { typography } from '../theme';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Screens
import MoreScreen from '../screens/main/MoreScreen';
import FinanceScreen from '../screens/main/FinanceScreen';
import AIChatScreen from '../screens/main/AIChatScreen';
import GoalsScreen from '../screens/main/GoalsScreen';
import SettingsNavigator from './SettingsNavigator';

export type MoreStackParamList = {
  MoreMenu: undefined;
  Finance: undefined;
  AIChat: undefined | { conversationId?: string };
  Goals: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          fontSize: typography.size.lg,
          fontWeight: typography.weight.semibold,
          color: colors.text.primary,
        },
        headerTintColor: colors.primary.main,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MoreMenu"
        options={{ headerShown: false }}
      >
        {() => (
          <ErrorBoundary>
            <MoreScreen />
          </ErrorBoundary>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Finance"
        options={{
          title: 'Finance',
          headerShown: false, // Finance has its own header
        }}
      >
        {() => (
          <ErrorBoundary>
            <FinanceScreen />
          </ErrorBoundary>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="AIChat"
        options={{
          title: 'AI Assistant',
          headerShown: false, // AIChat may have its own header
        }}
      >
        {() => (
          <ErrorBoundary>
            <AIChatScreen />
          </ErrorBoundary>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Goals"
        options={{
          title: 'Goals',
          headerShown: false, // GoalsScreen has its own header
        }}
      >
        {() => (
          <ErrorBoundary>
            <GoalsScreen />
          </ErrorBoundary>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Settings"
        options={{
          headerShown: false, // SettingsNavigator has its own headers
        }}
      >
        {() => (
          <ErrorBoundary>
            <SettingsNavigator />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
