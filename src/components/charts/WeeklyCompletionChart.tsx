/**
 * WeeklyCompletionChart Component
 * Compact bar chart showing habit completion for last 7 days
 * Designed to be embedded in habit cards
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { BaseChart } from './BaseChart';
import { getWeeklyCompletionData, WeeklyCompletionData } from '../../utils/charts/habitCharts';
import { colors } from '../../theme';
import { getChartDescription, getChartDataTable } from '../../utils/chartAccessibility';

interface WeeklyCompletionChartProps {
  habitId: string;
  compact?: boolean;
}

export const WeeklyCompletionChart: React.FC<WeeklyCompletionChartProps> = ({
  habitId,
  compact = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeeklyCompletionData | null>(null);
  const font = useFont(null, compact ? 9 : 11);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chartData = await getWeeklyCompletionData(habitId);
      setData(chartData);
    } catch (err) {
      console.error('Error loading weekly completion:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = compact ? screenWidth - 96 : screenWidth - 64;
  const chartHeight = compact ? 100 : 180;

  const isEmpty = !data || data.datasets[0].data.every((v) => v === 0);

  // Generate accessibility description
  const chartDataPoints = data?.labels.map((label, index) => ({
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  const completedDays = chartDataPoints.filter(p => p.value > 0).length;
  const accessibilityDescription = data
    ? `Weekly completion chart. ${completedDays} out of 7 days completed. ${getChartDescription(chartDataPoints, {
        title: 'Last 7 days',
        type: 'bar',
        unit: ' completions',
      })}`
    : 'No weekly completion data available';

  const dataTable = data ? getChartDataTable(chartDataPoints, { unit: ' completions' }) : '';

  // Transform data for Victory Native
  const chartData = data?.labels.map((label, index) => ({
    x: index,
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  // Calculate max for domain
  const maxValue = data ? Math.max(...data.datasets[0].data, 1) : 1;

  return (
    <View
      accessible={true}
      accessibilityLabel={accessibilityDescription}
      accessibilityRole="image"
    >
      <BaseChart
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No activity yet"
        height={chartHeight}
      >
        {data && (
          <>
            <View
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              style={[styles.chartWrapper, { width: chartWidth, height: chartHeight }]}
            >
              <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={['value']}
                domainPadding={{ left: 15, right: 15, top: 10, bottom: 10 }}
                domain={{ y: [0, maxValue + 0.5] }}
                axisOptions={{
                  font,
                  tickCount: { x: 7, y: compact ? 2 : 4 },
                  formatXLabel: (value: number) => {
                    const index = Math.round(value);
                    return data.labels[index] || '';
                  },
                  formatYLabel: (value: number) => Math.round(value).toString(),
                  labelColor: colors.text.tertiary,
                  lineColor: compact ? 'transparent' : colors.border.subtle,
                }}
              >
                {({ points, chartBounds }) => (
                  <Bar
                    points={points.value}
                    chartBounds={chartBounds}
                    color={colors.primary.main}
                    roundedCorners={{ topLeft: 3, topRight: 3 }}
                  />
                )}
              </CartesianChart>
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
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 4,
    borderRadius: 8,
  },
  hiddenText: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export default WeeklyCompletionChart;
