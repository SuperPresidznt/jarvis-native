/**
 * Settings Navigator
 * Stack navigation for settings and sub-screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../types';
import SettingsScreen from '../screens/main/SettingsScreen';
import StorageOverviewScreen from '../screens/settings/StorageOverviewScreen';
import DataManagementScreen from '../screens/settings/DataManagementScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import CustomColorsScreen from '../screens/settings/CustomColorsScreen';
import { useTheme } from '../hooks/useTheme';
import { typography } from '../theme';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.secondary,
        },
        headerTintColor: colors.primary.main,
        headerTitleStyle: {
          fontWeight: typography.weight.bold,
          fontSize: typography.size.lg,
          color: colors.text.primary,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="StorageOverview"
        component={StorageOverviewScreen}
        options={{
          title: 'Storage Overview',
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="DataManagement"
        component={DataManagementScreen}
        options={{
          title: 'Data Management',
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{
          title: 'Category Management',
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CustomColors"
        component={CustomColorsScreen}
        options={{
          title: 'Custom Colors',
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
