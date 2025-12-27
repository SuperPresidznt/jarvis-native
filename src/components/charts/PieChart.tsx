/**
 * Generic PieChart Component
 * Reusable pie chart using Victory Native
 */

import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { useTheme } from '../../hooks/useTheme';
import { BaseChart } from './BaseChart';
import { getChartDescription, ChartDataPoint } from '../../utils/chartAccessibility';
import { typography, spacing } from '../../theme';

export interface PieChartDataItem {
  name: string;
  value: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface PieChartProps {
  data: PieChartDataItem[];
  width?: number;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showLegend?: boolean;
  accessor?: string;
  centerLabelComponent?: () => React.ReactElement;
  hasLegend?: boolean;
  paddingLeft?: string;
  title?: string;
  accessibilityLabel?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = Dimensions.get('window').width - 40,
  height = 220,
  isLoading = false,
  error = null,
  emptyMessage = 'No data to display',
  showLegend = true,
  accessor: _accessor = 'value',
  centerLabelComponent: _centerLabelComponent,
  hasLegend = true,
  paddingLeft: _paddingLeft = '15',
  title = 'Pie Chart',
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  const isEmpty = !data.length || data.every(item => item.value === 0);

  // Apply default colors if not provided
  const chartData = data.map((item, index) => ({
    label: item.name,
    value: item.value,
    color: item.color || getDefaultColor(index, colors),
  }));

  // Generate accessibility description
  const chartDataPoints: ChartDataPoint[] = data.map((item) => ({
    label: item.name,
    value: item.value,
  }));

  const description = accessibilityLabel || getChartDescription(chartDataPoints, {
    title,
    type: 'pie',
  });

  return (
    <BaseChart
      isLoading={isLoading}
      error={error}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      height={height + (hasLegend && showLegend ? 60 : 0)}
    >
      <View
        accessible={true}
        accessibilityLabel={description}
        accessibilityRole="image"
        accessibilityHint="Double tap to view distribution breakdown"
        style={styles.container}
      >
        <View style={[styles.chartContainer, { width, height }]}>
          <PolarChart
            data={chartData}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius={0} />
          </PolarChart>
        </View>
        {hasLegend && showLegend && (
          <View style={styles.legend}>
            {chartData.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendText, { color: colors.text.tertiary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </BaseChart>
  );
};

// Helper function to generate default colors
function getDefaultColor(index: number, colors: { primary: { main: string } }): string {
  const palette = [
    colors.primary.main,
    '#F59E0B',
    '#EF4444',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#10B981',
    '#6366F1',
    '#F97316',
    '#14B8A6',
  ];
  return palette[index % palette.length];
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.size.xs,
  },
});

export default PieChart;
