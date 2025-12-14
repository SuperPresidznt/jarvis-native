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
import { LineChart } from 'react-native-chart-kit';
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

  useEffect(() => {
    if (visible) {
      loadData();
    }
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

  // Chart configuration
  const chartConfig = {
    backgroundColor: colors.background.secondary,
    backgroundGradientFrom: colors.background.secondary,
    backgroundGradientTo: colors.background.secondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => colors.text.tertiary,
    style: {
      borderRadius: borderRadius.lg,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: colors.primary.main,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: colors.border.subtle,
    },
  };

  const getYAxisSuffix = () => {
    if (dataType === 'spending') {
      return '';
    }
    return '';
  };

  const formatValue = (value: number) => {
    if (dataType === 'spending') {
      return `$${(value / 100).toFixed(0)}`;
    }
    return value.toString();
  };

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
                <LineChart
                  data={{
                    labels: trendData.labels.filter((_, i) => i % 3 === 0), // Show every 3rd label
                    datasets: [
                      {
                        data: trendData.data,
                        color: (opacity = 1) => colors.primary.main,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={Math.max(chartWidth, 600)} // Ensure minimum width for scrolling
                  height={300}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  yAxisSuffix={getYAxisSuffix()}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withDots={true}
                  withShadow={false}
                  fromZero
                />
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
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
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
