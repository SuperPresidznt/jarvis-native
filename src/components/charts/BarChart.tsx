/**
 * Generic BarChart Component
 * Reusable bar chart using react-native-chart-kit
 */

import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';
import { BaseChart } from './BaseChart';

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
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = Dimensions.get('window').width - 40,
  height = 220,
  isLoading = false,
  error = null,
  emptyMessage = 'No data to display',
  showValues = true,
  yAxisSuffix = '',
  yAxisLabel = '',
  fromZero = true,
}) => {
  const { colors } = useTheme();

  const isEmpty = !data.labels.length || !data.datasets.length || data.datasets[0].data.length === 0;

  return (
    <BaseChart
      isLoading={isLoading}
      error={error}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      height={height}
    >
      <RNBarChart
        data={data}
        width={width}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        fromZero={fromZero}
        showValuesOnTopOfBars={showValues}
        chartConfig={{
          backgroundColor: colors.background.secondary,
          backgroundGradientFrom: colors.background.secondary,
          backgroundGradientTo: colors.background.secondary,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.primary.main,
          labelColor: (opacity = 1) => colors.text.tertiary,
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontSize: 10,
          },
          propsForBackgroundLines: {
            stroke: colors.border.subtle,
            strokeWidth: 1,
            strokeDasharray: '0',
          },
        }}
        style={{
          borderRadius: 16,
        }}
      />
    </BaseChart>
  );
};

export default BarChart;
