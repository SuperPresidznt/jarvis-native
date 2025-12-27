/**
 * MonthlyComparisonChart Component
 * Bar chart comparing income vs expenses over months
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { BaseChart } from './BaseChart';
import { ChartCard } from './ChartCard';
import { getMonthlyComparisonData, MonthlyComparisonData } from '../../utils/charts/financeCharts';
import { colors, typography, spacing } from '../../theme';
import { getMonthlyComparisonDescription, getChartDataTable } from '../../utils/chartAccessibility';

interface MonthlyComparisonChartProps {
  months?: number;
  onViewDetails?: () => void;
}

export const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({
  months = 6,
  onViewDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MonthlyComparisonData | null>(null);
  const font = useFont(null, 10);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chartData = await getMonthlyComparisonData(months);
      setData(chartData);
    } catch (err) {
      console.error('Error loading monthly comparison:', err);
      setError('Failed to load comparison data');
    } finally {
      setIsLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const isEmpty = !data || data.datasets.every((ds) => ds.data.every((v) => v === 0));

  // Generate accessibility description
  const monthlyData = data?.labels.map((label, index) => ({
    month: label as string,
    income: (data.datasets[0]?.data[index] as number) || 0,
    expenses: (data.datasets[1]?.data[index] as number) || 0,
  })) || [];

  const accessibilityDescription = data
    ? getMonthlyComparisonDescription(monthlyData)
    : 'No monthly comparison data available';

  // Generate data table
  const incomePoints = monthlyData.map(m => ({ label: `${m.month} Income`, value: m.income }));
  const expensePoints = monthlyData.map(m => ({ label: `${m.month} Expenses`, value: m.expenses }));
  const allPoints = [...incomePoints, ...expensePoints];
  const dataTable = data ? getChartDataTable(allPoints, { unit: '$' }) : '';

  // Transform data for Victory Native - combine income and expenses
  // Victory Native doesn't support grouped bars natively, so we show income only with legend
  const chartData = data?.labels.map((label, index) => ({
    x: index,
    label: label as string,
    income: (data.datasets[0]?.data[index] as number) || 0,
    expenses: (data.datasets[1]?.data[index] as number) || 0,
  })) || [];

  // Calculate max for domain
  const maxValue = data ? Math.max(
    ...data.datasets[0].data,
    ...data.datasets[1].data
  ) : 100;

  return (
    <ChartCard
      title="Income vs Expenses"
      subtitle={`Last ${months} months`}
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
          emptyMessage="No financial data yet"
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
                  yKeys={['income', 'expenses']}
                  domainPadding={{ left: 30, right: 30, top: 20, bottom: 20 }}
                  domain={{ y: [0, maxValue * 1.1] }}
                  axisOptions={{
                    font,
                    tickCount: { x: data.labels.length, y: 5 },
                    formatXLabel: (value: number) => {
                      const index = Math.round(value);
                      return data.labels[index] || '';
                    },
                    formatYLabel: (value: number) => `$${Math.round(value / 1000)}k`,
                    labelColor: colors.text.tertiary,
                    lineColor: colors.border.subtle,
                  }}
                >
                  {({ points, chartBounds }) => (
                    <>
                      <Bar
                        points={points.income}
                        chartBounds={chartBounds}
                        color={colors.success}
                        roundedCorners={{ topLeft: 4, topRight: 4 }}
                        barWidth={12}
                      />
                      <Bar
                        points={points.expenses.map((p) => ({
                          ...p,
                          x: p.x + 14, // Offset for grouped appearance
                        }))}
                        chartBounds={chartBounds}
                        color={colors.error}
                        roundedCorners={{ topLeft: 4, topRight: 4 }}
                        barWidth={12}
                      />
                    </>
                  )}
                </CartesianChart>
              </View>
              <View
                style={styles.legend}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                {data.legend.map((label, index) => (
                  <View key={label} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor:
                            index === 0 ? colors.success : colors.error,
                        },
                      ]}
                    />
                    <Text style={styles.legendText}>{label}</Text>
                  </View>
                ))}
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
    gap: spacing.lg,
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

export default MonthlyComparisonChart;
