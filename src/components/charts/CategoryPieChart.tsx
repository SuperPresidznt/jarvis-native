/**
 * CategoryPieChart Component
 * Pie chart showing spending breakdown by category
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { BaseChart } from './BaseChart';
import { ChartCard } from './ChartCard';
import { baseChartConfig } from '../../utils/charts/chartConfig';
import { getCategoryBreakdownData, CategoryBreakdownData } from '../../utils/charts/financeCharts';
import { colors, typography, spacing } from '../../theme';

interface CategoryPieChartProps {
  month?: string;
  onViewDetails?: () => void;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  month,
  onViewDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CategoryBreakdownData | null>(null);

  useEffect(() => {
    loadData();
  }, [month]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chartData = await getCategoryBreakdownData(month);
      setData(chartData);
    } catch (err) {
      console.error('Error loading category breakdown:', err);
      setError('Failed to load category data');
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const isEmpty = !data;

  // Format data for PieChart
  const pieData = data
    ? data.labels.map((label, index) => ({
        name: label,
        population: data.data[index],
        color: data.colors[index],
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      }))
    : [];

  return (
    <ChartCard
      title="Category Breakdown"
      subtitle="This month"
      onAction={onViewDetails}
      actionLabel={onViewDetails ? 'Details' : undefined}
    >
      <BaseChart
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No spending data yet"
        height={260}
      >
        {data && (
          <>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={220}
              chartConfig={baseChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={false}
              style={styles.chart}
            />
            <View style={styles.legend}>
              {data.labels.map((label, index) => (
                <View key={label} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: data.colors[index] }]}
                  />
                  <Text style={styles.legendText}>
                    {label} (${data.data[index].toFixed(0)})
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </BaseChart>
    </ChartCard>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
});

export default CategoryPieChart;
