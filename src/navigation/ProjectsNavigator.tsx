/**
 * Projects Navigator
 * Stack navigation for projects list and detail screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProjectsStackParamList } from '../types';
import ProjectsScreen from '../screens/main/ProjectsScreen';
import ProjectDetailScreen from '../screens/main/ProjectDetailScreen';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export default function ProjectsNavigator() {
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
      }}
    >
      <Stack.Screen
        name="ProjectsList"
        component={ProjectsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{
          title: 'Project Details',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
