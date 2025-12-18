/**
 * Generic LineChart Component
 * Reusable line chart using react-native-chart-kit
 */

import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';
import { BaseChart } from './BaseChart';

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
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = Dimensions.get('window').width - 40,
  height = 220,
  isLoading = false,
  error = null,
  emptyMessage = 'No data to display',
  showDots = true,
  bezier = false,
  yAxisSuffix = '',
  yAxisLabel = '',
  fromZero = true,
  fillShadowGradient = true,
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
      <RNLineChart
        data={data}
        width={width}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        fromZero={fromZero}
        bezier={bezier}
        withDots={showDots}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withShadow={fillShadowGradient}
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
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary.main,
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

export default LineChart;
