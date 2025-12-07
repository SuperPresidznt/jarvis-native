/**
 * HabitHeatmap Component
 * Visual calendar heatmap for habit completion history
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

interface HabitHeatmapProps {
  habitId: string;
  completions: string[]; // Array of ISO date strings
  weeks?: number;
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({
  habitId,
  completions,
  weeks = 12,
}) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - weeks * 7);

  const days: { date: Date; completed: boolean }[] = [];
  const current = new Date(startDate);

  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    days.push({
      date: new Date(current),
      completed: completions.includes(dateStr),
    });
    current.setDate(current.getDate() + 1);
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Group days by week
  const weekGroups: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weekGroups.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Week day labels */}
          <View style={styles.weekDaysRow}>
            <View style={styles.weekDayLabelSpacer} />
            {weekDays.map((day, i) => (
              <Text key={i} variant="labelSmall" style={styles.weekDayLabel}>
                {day}
              </Text>
            ))}
          </View>

          {/* Heatmap grid */}
          <View style={styles.grid}>
            {weekGroups.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((day, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.dayCell,
                      day.completed && styles.dayCellCompleted,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDayLabelSpacer: {
    width: 24,
  },
  weekDayLabel: {
    width: 16,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 2,
  },
  weekColumn: {
    gap: 2,
  },
  dayCell: {
    width: 16,
    height: 16,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  dayCellCompleted: {
    backgroundColor: '#10B981',
  },
});
