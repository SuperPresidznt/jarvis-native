/**
 * Main Navigator
 * Simplified 5-tab navigation: Home, Tasks, Focus, Track, More
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useBadgeCounts } from '../hooks/useBadgeCounts';
import {
  typography,
  shadows,
} from '../theme';

// Icons
import { IconButton, Badge } from 'react-native-paper';

// Error Boundary
import { ErrorBoundary } from '../components/ErrorBoundary';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import TasksScreen from '../screens/main/TasksScreen';
import FocusScreen from '../screens/main/FocusScreen';
import TrackScreen from '../screens/main/TrackScreen';
import MoreNavigator from './MoreNavigator';
import { HIT_SLOP } from '../constants/ui';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab bar icon component
interface TabIconProps {
  icon: string;
  focused: boolean;
  colors: ReturnType<typeof import('../theme').getColors>;
  badgeCount?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, colors, badgeCount }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <IconButton
      icon={icon}
      iconColor={focused ? colors.primary.main : colors.text.tertiary}
      size={22}
      style={styles.iconButton}
    
                hitSlop={HIT_SLOP}/>
    {badgeCount !== undefined && badgeCount > 0 && (
      <Badge
        size={18}
        style={[
          styles.badge,
          { backgroundColor: colors.error }
        ]}
      >
        {badgeCount > 99 ? '99+' : badgeCount}
      </Badge>
    )}
    {focused && <View style={[styles.focusIndicator, { backgroundColor: colors.primary.main }]} />}
  </View>
);

export default function MainNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { counts } = useBadgeCounts();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.subtle,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 0),
          ...shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: typography.size.xs,
          fontWeight: typography.weight.medium,
          marginTop: -4,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.subtle,
        },
        headerTitleStyle: {
          fontSize: typography.size.lg,
          fontWeight: typography.weight.semibold,
          color: colors.text.primary,
        },
        headerTintColor: colors.text.primary,
      }}
    >
      {/* Home - Dashboard */}
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="view-dashboard" focused={focused} colors={colors} />
          ),
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      >
        {() => (
          <ErrorBoundary>
            <DashboardScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>

      {/* Tasks */}
      <Tab.Screen
        name="Tasks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="checkbox-marked-circle-outline"
              focused={focused}
              colors={colors}
              badgeCount={counts.tasks}
            />
          ),
          tabBarLabel: 'Tasks',
          headerShown: false,
        }}
      >
        {() => (
          <ErrorBoundary>
            <TasksScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>

      {/* Focus */}
      <Tab.Screen
        name="Focus"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="timer-outline"
              focused={focused}
              colors={colors}
            />
          ),
          tabBarLabel: 'Focus',
          headerShown: false,
        }}
      >
        {() => (
          <ErrorBoundary>
            <FocusScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>

      {/* Track - Habits + Calendar */}
      <Tab.Screen
        name="Track"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="chart-line"
              focused={focused}
              colors={colors}
              badgeCount={(counts.habits || 0) + (counts.calendar || 0)}
            />
          ),
          tabBarLabel: 'Track',
          headerShown: false,
        }}
      >
        {() => (
          <ErrorBoundary>
            <TrackScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>

      {/* More - Finance, AI, Settings */}
      <Tab.Screen
        name="More"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="dots-horizontal" focused={focused} colors={colors} />
          ),
          tabBarLabel: 'More',
          headerShown: false,
        }}
      >
        {() => (
          <ErrorBoundary>
            <MoreNavigator />
          </ErrorBoundary>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainerFocused: {
    // Optional: add slight background when focused
  },
  iconButton: {
    margin: 0,
    padding: 0,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    fontSize: 10,
    fontWeight: '600',
  },
  focusIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    // backgroundColor is set inline via colors prop
  },
});
