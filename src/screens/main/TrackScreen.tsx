/**
 * Track Screen
 * Combined Habits and Calendar with segmented toggle
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useBadgeCounts } from '../../hooks/useBadgeCounts';
import { typography, spacing } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Import the existing screens as components
import HabitsScreen from './HabitsScreen';
import CalendarScreen from './CalendarScreen';

type TrackView = 'habits' | 'calendar';

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { counts } = useBadgeCounts();
  const [activeView, setActiveView] = useState<TrackView>('habits');

  const handleViewChange = useCallback((value: string) => {
    setActiveView(value as TrackView);
  }, []);

  // Badge text for habits
  const habitsBadge = counts.habits > 0 ? ` (${counts.habits})` : '';
  const calendarBadge = counts.calendar > 0 ? ` (${counts.calendar})` : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.subtle,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Track
        </Text>

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <SegmentedButtons
            value={activeView}
            onValueChange={handleViewChange}
            buttons={[
              {
                value: 'habits',
                label: `Habits${habitsBadge}`,
                icon: 'chart-line',
              },
              {
                value: 'calendar',
                label: `Calendar${calendarBadge}`,
                icon: 'calendar',
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      </View>

      {/* Content - render the appropriate screen */}
      <View style={styles.content}>
        <ErrorBoundary>
          {activeView === 'habits' ? (
            <HabitsScreen embedded />
          ) : (
            <CalendarScreen embedded />
          )}
        </ErrorBoundary>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
  },
  toggleContainer: {
    marginBottom: spacing.xs,
  },
  segmentedButtons: {
    // Styled by react-native-paper
  },
  content: {
    flex: 1,
  },
});
