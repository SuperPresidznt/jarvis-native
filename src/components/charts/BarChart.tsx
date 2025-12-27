/**
 * Generic BarChart Component
 * Reusable bar chart using Victory Native
 */

import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { CartesianChart, Bar, useChartPressState } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { useTheme } from '../../hooks/useTheme';
import { BaseChart } from './BaseChart';
import { getChartDescription, ChartDataPoint } from '../../utils/chartAccessibility';

export interface BarChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity?: number) => string;
  }>;
}

interface BarChartProps {
  data: BarChartData;
  width?: number;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showValues?: boolean;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  fromZero?: boolean;
  title?: string;
  accessibilityLabel?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = Dimensions.get('window').width - 40,
  height = 220,
  isLoading = false,
  error = null,
  emptyMessage = 'No data to display',
  showValues: _showValues = true,
  yAxisSuffix = '',
  yAxisLabel: _yAxisLabel = '',
  fromZero = true,
  title = 'Bar Chart',
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const font = useFont(null, 11);
  // Press state available for future interactive features
  useChartPressState({ x: 0, y: { value: 0 } });

  const isEmpty = !data.labels.length || !data.datasets.length || data.datasets[0].data.length === 0;

  // Generate accessibility description
  const chartDataPoints: ChartDataPoint[] = data.labels.map((label, index) => ({
    label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  const description = accessibilityLabel || getChartDescription(chartDataPoints, {
    title,
    type: 'bar',
    unit: yAxisSuffix,
  });

  // Transform data for Victory Native
  const chartData = data.labels.map((label, index) => ({
    x: index,
    label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  // Calculate domain
  const allValues = data.datasets.flatMap(ds => ds.data);
  const minValue = fromZero ? 0 : Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1 || 10;

  return (
    <BaseChart
      isLoading={isLoading}
      error={error}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      height={height}
    >
      <View
        accessible={true}
        accessibilityLabel={description}
        accessibilityRole="image"
        accessibilityHint="Double tap to view data table"
        style={[styles.chartContainer, { width, height }]}
      >
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['value']}
          domainPadding={{ left: 30, right: 30, top: 20, bottom: 20 }}
          domain={{ y: [minValue, maxValue + padding] }}
          axisOptions={{
            font,
            tickCount: { x: data.labels.length, y: 5 },
            formatXLabel: (value: number) => {
              const index = Math.round(value);
              return data.labels[index] || '';
            },
            formatYLabel: (value: number) => `${Math.round(value)}${yAxisSuffix}`,
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
    </BaseChart>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default BarChart;
