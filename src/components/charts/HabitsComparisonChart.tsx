/**
 * HabitsComparisonChart Component
 * Bar chart comparing completion rates across multiple habits
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { BaseChart } from './BaseChart';
import { ChartCard } from './ChartCard';
import { getHabitComparisonData, HabitComparisonData } from '../../utils/charts/habitCharts';
import { colors, typography, spacing } from '../../theme';
import { getChartDescription, getChartDataTable } from '../../utils/chartAccessibility';

interface HabitsComparisonChartProps {
  habitIds: string[];
  onViewDetails?: () => void;
}

export const HabitsComparisonChart: React.FC<HabitsComparisonChartProps> = ({
  habitIds,
  onViewDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HabitComparisonData | null>(null);
  const font = useFont(null, 10);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitIds]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chartData = await getHabitComparisonData(habitIds);
      setData(chartData);
    } catch (err) {
      console.error('Error loading habit comparison:', err);
      setError('Failed to load comparison data');
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const isEmpty = !data || data.datasets[0].data.every((v) => v === 0);

  // Generate accessibility description
  const chartDataPoints = data?.labels.map((label, index) => ({
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  const accessibilityDescription = data
    ? getChartDescription(chartDataPoints, {
        title: 'Habit comparison for last 30 days',
        type: 'bar',
        unit: '%',
      })
    : 'No habit comparison data available';

  const dataTable = data ? getChartDataTable(chartDataPoints, { unit: '%' }) : '';

  // Transform data for Victory Native
  const chartData = data?.labels.map((label, index) => ({
    x: index,
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  return (
    <ChartCard
      title="Habit Comparison"
      subtitle="30-day completion rates"
      onAction={onViewDetails}
      actionLabel={onViewDetails ? 'Details' : undefined}
    >
      <View
        accessible={true}
        accessibilityLabel={accessibilityDescription}
        accessibilityRole="image"
        accessibilityHint="Double tap for detailed view"
      >
        <BaseChart
          isLoading={isLoading}
          error={error}
          isEmpty={isEmpty}
          emptyMessage="Select habits to compare"
          height={220}
        >
          {data && (
            <>
              <View
                accessible={false}
                importantForAccessibility="no-hide-descendants"
                style={[styles.chartWrapper, { width: screenWidth - 64, height: 220 }]}
              >
                <CartesianChart
                  data={chartData}
                  xKey="x"
                  yKeys={['value']}
                  domainPadding={{ left: 30, right: 30, top: 20, bottom: 20 }}
                  domain={{ y: [0, 100] }}
                  axisOptions={{
                    font,
                    tickCount: { x: data.labels.length, y: 5 },
                    formatXLabel: (value: number) => {
                      const index = Math.round(value);
                      const label = data.labels[index];
                      // Truncate long labels
                      if (label && label.length > 8) {
                        return label.substring(0, 7) + '...';
                      }
                      return label || '';
                    },
                    formatYLabel: (value: number) => `${Math.round(value)}%`,
                    labelColor: colors.text.tertiary,
                    lineColor: colors.border.subtle,
                  }}
                >
                  {({ points, chartBounds }) => (
                    <Bar
                      points={points.value}
                      chartBounds={chartBounds}
                      color={colors.primary.main}
                      roundedCorners={{ topLeft: 4, topRight: 4 }}
                    />
                  )}
                </CartesianChart>
              </View>
              <View
                style={styles.legend}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: colors.primary.main },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    Completion Rate (Last 30 days)
                  </Text>
                </View>
              </View>

              {/* Hidden text alternative for screen readers */}
              <Text
                style={styles.hiddenText}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                {dataTable}
              </Text>
            </>
          )}
        </BaseChart>
      </View>
    </ChartCard>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  hiddenText: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export default HabitsComparisonChart;
