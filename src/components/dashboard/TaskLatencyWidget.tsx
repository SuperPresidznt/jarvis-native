/**
 * Task Latency Widget Component
 * Dashboard card displaying task completion latency metrics
 * Shows overall average, trend, bottlenecks, and stale task count
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getCompletionLatencyStats,
  getLatencyTrendSparkline,
} from '../../database/tasks';
import { Sparkline } from '../charts/Sparkline';
import { formatLatency, generateLatencyInsight } from '../../utils/taskLatency';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';

interface TaskLatencyWidgetProps {
  onPress?: () => void;
}

export const TaskLatencyWidget: React.FC<TaskLatencyWidgetProps> = ({ onPress }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    overall: number;
    staleCount: number;
    byPriority: { priority: string; avgDays: number; count: number }[];
    byProject: { projectId: string; projectName: string; avgDays: number; count: number }[];
  } | null>(null);
  const [trendData, setTrendData] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, trendDataRaw] = await Promise.all([
        getCompletionLatencyStats(),
        getLatencyTrendSparkline(),
      ]);
      setStats(statsData);
      setTrendData(trendDataRaw);
    } catch (error) {
      console.error('[TaskLatencyWidget] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to TasksScreen with stale filter
      navigation.navigate('Tasks' as never);
    }
  };

  const getBottleneck = () => {
    if (!stats || stats.byPriority.length === 0) return null;

    // Find priority with highest latency
    const slowest = stats.byPriority[0];
    return {
      type: 'priority',
      label: `${slowest.priority} priority`,
      avgDays: slowest.avgDays,
    };
  };

  const bottleneck = getBottleneck();
  const insight = stats ? generateLatencyInsight(stats.overall, stats.staleCount) : '';

  // Determine trend direction
  const trendDirection = getTrendDirection(trendData);

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading latency data...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!stats || stats.overall === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="timer-sand" size={20} color={colors.text.secondary} />
          <Text style={styles.title}>Task Latency</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Complete some tasks to see latency analytics
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="timer-sand" size={20} color={colors.primary.main} />
          <Text style={styles.title}>Task Latency</Text>
        </View>
        {stats.staleCount > 0 && (
          <View style={styles.staleBadge}>
            <Icon name="alert-circle" size={14} color={colors.error} />
            <Text style={styles.staleBadgeText}>{stats.staleCount}</Text>
          </View>
        )}
      </View>

      {/* Main Metric */}
      <View style={styles.mainMetric}>
        <Text style={styles.mainValue}>{formatLatency(stats.overall)}</Text>
        <Text style={styles.mainLabel}>Average completion time</Text>
      </View>

      {/* Trend Sparkline */}
      {trendData.length > 0 && (
        <View style={styles.trendContainer}>
          <Sparkline
            data={trendData}
            width={120}
            height={40}
            trend={trendDirection}
            strokeWidth={2}
            smooth
          />
          <Text style={styles.trendLabel}>7-day trend</Text>
        </View>
      )}

      {/* Bottleneck Info */}
      {bottleneck && (
        <View style={styles.bottleneckContainer}>
          <Icon name="alert-octagon" size={14} color={colors.warning} />
          <Text style={styles.bottleneckText}>
            {bottleneck.label}: {formatLatency(bottleneck.avgDays)} avg
          </Text>
        </View>
      )}

      {/* Insight */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      {/* Stale Tasks CTA */}
      {stats.staleCount > 0 && (
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>
            View {stats.staleCount} stale task{stats.staleCount > 1 ? 's' : ''}
          </Text>
          <Icon name="chevron-right" size={16} color={colors.primary.main} />
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Determine trend direction from sparkline data
 */
function getTrendDirection(data: number[]): 'positive' | 'negative' | 'neutral' {
  if (data.length < 2) return 'neutral';

  const first = data[0];
  const last = data[data.length - 1];

  // Lower latency is better (positive trend)
  if (last < first * 0.9) return 'positive';
  if (last > first * 1.1) return 'negative';
  return 'neutral';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  staleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.error}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  staleBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.error,
  },
  mainMetric: {
    alignItems: 'center',
    marginVertical: spacing.base,
  },
  mainValue: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  mainLabel: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  trendContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.subtle,
  },
  trendLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  bottleneckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.warning}15`,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  bottleneckText: {
    fontSize: typography.size.sm,
    color: colors.warning,
    fontWeight: typography.weight.medium,
  },
  insightContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
  insightText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
    textAlign: 'center',
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    gap: spacing.xs,
  },
  ctaText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.primary.main,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default TaskLatencyWidget;
