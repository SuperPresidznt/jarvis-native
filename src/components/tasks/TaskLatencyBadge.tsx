/**
 * Task Latency Badge Component
 * Small badge showing task age or completion latency
 * Displays on task cards to provide latency context
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Task } from '../../database/tasks';
import {
  formatTaskLatencyLabel,
  calculateTaskLatency,
  calculateTaskAge,
  getLatencyColor,
  isStaleTask,
} from '../../utils/taskLatency';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface TaskLatencyBadgeProps {
  task: Task;
  compact?: boolean;
  showIcon?: boolean;
  staleThreshold?: number;
}

export const TaskLatencyBadge: React.FC<TaskLatencyBadgeProps> = ({
  task,
  compact = false,
  showIcon = true,
  staleThreshold = 7,
}) => {
  const label = formatTaskLatencyLabel(task);

  // If no label (shouldn't happen), don't render
  if (!label) return null;

  const isCompleted = task.status === 'completed';
  const isStale = isStaleTask(task, staleThreshold);

  // Get appropriate color based on latency/age
  let badgeColor: string;
  if (isCompleted) {
    const latency = calculateTaskLatency(task);
    badgeColor = latency ? getLatencyColor(latency) : colors.success;
  } else {
    const age = calculateTaskAge(task);
    badgeColor = getLatencyColor(age);
  }

  // Icon based on status
  const iconName = isCompleted
    ? 'check-circle'
    : isStale
    ? 'alert-circle'
    : 'clock-outline';

  return (
    <View
      style={[
        styles.badge,
        compact && styles.badgeCompact,
        { borderColor: badgeColor },
        isStale && styles.badgeStale,
      ]}
    >
      {showIcon && !compact && (
        <Icon
          name={iconName}
          size={12}
          color={badgeColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          compact && styles.textCompact,
          { color: badgeColor },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeCompact: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeStale: {
    backgroundColor: `${colors.error}15`,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.2,
  },
  textCompact: {
    fontSize: 10,
  },
});

export default TaskLatencyBadge;
