/**
 * SpendingTrendChart Component
 * Line chart showing daily spending over last 30 days
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { BaseChart } from './BaseChart';
import { ChartCard } from './ChartCard';
import { getChartDimensions } from '../../utils/charts/chartConfig';
import { getDailySpendingData, DailySpendingData } from '../../utils/charts/financeCharts';
import { getChartDescription, getChartDataTable } from '../../utils/chartAccessibility';
import { colors } from '../../theme';

interface SpendingTrendChartProps {
  days?: number;
  onViewDetails?: () => void;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  days = 30,
  onViewDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DailySpendingData | null>(null);
  const font = useFont(null, 10);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chartData = await getDailySpendingData(days);
      setData(chartData);
    } catch (err) {
      console.error('Error loading spending trend:', err);
      setError('Failed to load spending data');
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const chartDimensions = getChartDimensions(screenWidth);

  const isEmpty = !data || data.datasets[0].data.every((v) => v === 0);

  // Generate accessibility description
  const chartDataPoints = data?.labels.map((label, index) => ({
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  const accessibilityDescription = data
    ? getChartDescription(chartDataPoints, {
        title: `Spending trend for last ${days} days`,
        type: 'line',
        unit: '$',
      })
    : 'No spending data available';

  const dataTable = data ? getChartDataTable(chartDataPoints, { unit: '$' }) : '';

  // Transform data for Victory Native
  const chartData = data?.labels.map((label, index) => ({
    x: index,
    label: label as string,
    value: data.datasets[0].data[index] as number,
  })) || [];

  // Calculate domain
  const allValues = data?.datasets[0].data || [0];
  const maxValue = Math.max(...allValues);
  const domainPadding = maxValue * 0.1 || 10;

  return (
    <ChartCard
      title="Spending Trend"
      subtitle={`Last ${days} days`}
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
          emptyMessage="No spending data yet"
          height={chartDimensions.height}
        >
          {data && (
            <>
              <View
                accessible={false}
                importantForAccessibility="no-hide-descendants"
                style={[styles.chartWrapper, { width: chartDimensions.width, height: chartDimensions.height }]}
              >
                <CartesianChart
                  data={chartData}
                  xKey="x"
                  yKeys={['value']}
                  domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  domain={{ y: [0, maxValue + domainPadding] }}
                  axisOptions={{
                    font,
                    tickCount: { x: Math.min(chartData.length, 7), y: 4 },
                    formatXLabel: (value: number) => {
                      const index = Math.round(value);
                      // Show fewer labels for longer periods
                      const step = days <= 14 ? 2 : 5;
                      if (index % step === 0 && data?.labels[index]) {
                        return data.labels[index];
                      }
                      return '';
                    },
                    formatYLabel: (value: number) => {
                      if (value >= 1000) {
                        return `$${(value / 1000).toFixed(1)}k`;
                      }
                      return `$${Math.round(value)}`;
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
                      {days <= 14 && points.value
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
  hiddenText: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export default SpendingTrendChart;
