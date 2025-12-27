/**
 * Generic LineChart Component
 * Reusable line chart using Victory Native
 */

import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { useTheme } from '../../hooks/useTheme';
import { BaseChart } from './BaseChart';
import { getChartDescription, ChartDataPoint } from '../../utils/chartAccessibility';

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }>;
  legend?: string[];
}

interface LineChartProps {
  data: LineChartData;
  width?: number;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showDots?: boolean;
  bezier?: boolean;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  fromZero?: boolean;
  fillShadowGradient?: boolean;
  title?: string;
  accessibilityLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = Dimensions.get('window').width - 40,
  height = 220,
  isLoading = false,
  error = null,
  emptyMessage = 'No data to display',
  showDots = true,
  bezier: _bezier = false,
  yAxisSuffix = '',
  yAxisLabel: _yAxisLabel = '',
  fromZero = true,
  fillShadowGradient: _fillShadowGradient = true,
  title = 'Line Chart',
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const font = useFont(null, 11);
  const { state } = useChartPressState({ x: 0, y: { value: 0 } });

  const isEmpty = !data.labels.length || !data.datasets.length || data.datasets[0].data.length === 0;

  // Generate accessibility description
  const chartDataPoints: ChartDataPoint[] = data.labels.map((label, index) => ({
    label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  const description = accessibilityLabel || getChartDescription(chartDataPoints, {
    title,
    type: 'line',
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
        accessibilityHint="Double tap to view trend details and data table"
        style={[styles.chartContainer, { width, height }]}
      >
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['value']}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
          domain={{ y: [minValue, maxValue + padding] }}
          axisOptions={{
            font,
            tickCount: { x: Math.min(data.labels.length, 6), y: 5 },
            formatXLabel: (value: number) => {
              const index = Math.round(value);
              return data.labels[index] || '';
            },
            formatYLabel: (value: number) => `${Math.round(value)}${yAxisSuffix}`,
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
              {showDots && points.value
                .filter((point): point is typeof point & { x: number; y: number } =>
                  point.x !== undefined && point.y !== undefined)
                .map((point, index) => (
                  <Circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    color={colors.primary.main}
                  />
                ))}
              {state.isActive && state.x.position !== undefined && state.y.value.position !== undefined && (
                <Circle
                  cx={state.x.position.value}
                  cy={state.y.value.position.value}
                  r={8}
                  color={colors.primary.main}
                />
              )}
            </>
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

export default LineChart;
