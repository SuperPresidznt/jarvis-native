/**
 * DetailedChartModal Component
 * Full-screen modal showing detailed 30-day trend chart
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CartesianChart, Line } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import {
  getExtendedTaskCompletionTrend,
  getExtendedHabitCompletionTrend,
  getExtendedCalendarEventTrend,
  getExtendedFinanceSpendingTrend,
  ExtendedTrendData,
} from '../../database/analytics';
import { calculateTrendStatistics } from '../../utils/chartUtils';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

export type ChartDataType = 'tasks' | 'habits' | 'events' | 'spending';

interface DetailedChartModalProps {
  visible: boolean;
  onClose: () => void;
  dataType: ChartDataType;
  title: string;
}

export const DetailedChartModal: React.FC<DetailedChartModalProps> = ({
  visible,
  onClose,
  dataType,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendData, setTrendData] = useState<ExtendedTrendData | null>(null);
  const font = useFont(null, 11);

  useEffect(() => {
    if (visible) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, dataType]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let data: ExtendedTrendData;
      switch (dataType) {
        case 'tasks':
          data = await getExtendedTaskCompletionTrend();
          break;
        case 'habits':
          data = await getExtendedHabitCompletionTrend();
          break;
        case 'events':
          data = await getExtendedCalendarEventTrend();
          break;
        case 'spending':
          data = await getExtendedFinanceSpendingTrend();
          break;
        default:
          data = { labels: [], data: [] };
      }
      setTrendData(data);
    } catch (error) {
      console.error('[DetailedChart] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing.lg * 2;

  const statistics = trendData ? calculateTrendStatistics(trendData.data) : null;

  const formatValue = (value: number) => {
    if (dataType === 'spending') {
      return `$${(value / 100).toFixed(0)}`;
    }
    return value.toString();
  };

  // Transform data for Victory Native
  const chartData = trendData?.labels.map((label, index) => ({
    x: index,
    label,
    value: trendData.data[index] || 0,
  })) || [];

  // Calculate domain
  const allValues = trendData?.data || [0];
  const maxValue = Math.max(...allValues);
  const domainPadding = maxValue * 0.1 || 10;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>30-Day Trend</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Statistics Cards */}
          {statistics && !isLoading && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  {formatValue(Math.round(statistics.average))}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{formatValue(statistics.sum)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Peak</Text>
                <Text style={styles.statValue}>{formatValue(statistics.max)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Change</Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color:
                        statistics.percentageChange > 0
                          ? colors.success
                          : statistics.percentageChange < 0
                          ? colors.error
                          : colors.text.tertiary,
                    },
                  ]}
                >
                  {statistics.percentageChange > 0 ? '+' : ''}
                  {statistics.percentageChange.toFixed(1)}%
                </Text>
              </View>
            </View>
          )}

          {/* Chart */}
          <View style={styles.chartContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary.main} />
                <Text style={styles.loadingText}>Loading chart...</Text>
              </View>
            ) : trendData && trendData.data.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ width: Math.max(chartWidth, 600), height: 300 }}>
                  <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={['value']}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                    domain={{ y: [0, maxValue + domainPadding] }}
                    axisOptions={{
                      font,
                      tickCount: { x: 10, y: 5 },
                      formatXLabel: (value: number) => {
                        const index = Math.round(value);
                        // Show every 3rd label
                        if (index % 3 === 0 && trendData?.labels[index]) {
                          return trendData.labels[index];
                        }
                        return '';
                      },
                      formatYLabel: (value: number) => {
                        if (dataType === 'spending') {
                          return `$${Math.round(value / 100)}`;
                        }
                        return Math.round(value).toString();
                      },
                      labelColor: colors.text.tertiary,
                      lineColor: colors.border.subtle,
                    }}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points.value}
                          color={colors.primary.main}
                          strokeWidth={2}
                          curveType="natural"
                        />
                        {points.value
                          .filter((point): point is typeof point & { x: number; y: number } =>
                            point.x !== undefined && point.y !== undefined)
                          .map((point, index) => (
                            <Circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r={3}
                              color={colors.primary.main}
                            />
                          ))}
                      </>
                    )}
                  </CartesianChart>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.info}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              This chart shows your {title.toLowerCase()} over the past 30 days. Track your
              progress and identify patterns to improve your productivity.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  chartContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.info}15`,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    marginRight: spacing.sm,
    marginTop: spacing.xs / 2,
  },
  infoText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
});

export default DetailedChartModal;
