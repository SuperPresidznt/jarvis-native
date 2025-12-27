/**
 * Projects Navigator
 * Stack navigation for projects list and detail screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProjectsStackParamList } from '../types';
import ProjectsScreen from '../screens/main/ProjectsScreen';
import ProjectDetailScreen from '../screens/main/ProjectDetailScreen';
import { useTheme } from '../hooks/useTheme';
import { typography } from '../theme';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export default function ProjectsNavigator() {
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
        name="ProjectsList"
        component={ProjectsScreen}
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{
          title: 'Project Details',
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
