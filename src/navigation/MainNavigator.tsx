/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types';

// Icons from react-native-paper
import { IconButton } from 'react-native-paper';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import AIChatScreen from '../screens/main/AIChatScreen';
import TasksScreen from '../screens/main/TasksScreen';
import HabitsScreen from '../screens/main/HabitsScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import FinanceScreen from '../screens/main/FinanceScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 0),
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5EA',
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="view-dashboard" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="robot" iconColor={color} size={size} />
          ),
          tabBarLabel: 'AI',
          title: 'AI Assistant',
        }}
      />

      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="checkbox-marked-circle-outline" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Tasks',
        }}
      />

      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="chart-line" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Habits',
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="calendar" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Calendar',
        }}
      />

      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="wallet" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Finance',
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="cog" iconColor={color} size={size} />
          ),
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
