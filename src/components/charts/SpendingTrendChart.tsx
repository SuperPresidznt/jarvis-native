/**
 * SpendingTrendChart Component
 * Line chart showing daily spending over last 30 days
 */

import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BaseChart } from './BaseChart';
import { ChartCard } from './ChartCard';
import { baseChartConfig, getChartDimensions } from '../../utils/charts/chartConfig';
import { getDailySpendingData, DailySpendingData } from '../../utils/charts/financeCharts';

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

  useEffect(() => {
    loadData();
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

  return (
    <ChartCard
      title="Spending Trend"
      subtitle={`Last ${days} days`}
      onAction={onViewDetails}
      actionLabel={onViewDetails ? 'Details' : undefined}
    >
      <BaseChart
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No spending data yet"
        height={chartDimensions.height}
      >
        {data && (
          <LineChart
            data={data}
            width={chartDimensions.width}
            height={chartDimensions.height}
            chartConfig={baseChartConfig}
            bezier
            style={styles.chart}
            withInnerLines
            withOuterLines
            withDots={days <= 14} // Show dots only for shorter periods
            withShadow={false}
            fromZero
            segments={4}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1}
            formatYLabel={(value) => {
              const num = parseFloat(value);
              if (num >= 1000) {
                return `${(num / 1000).toFixed(1)}k`;
              }
              return num.toFixed(0);
            }}
            decorator={() => {
              // Could add custom decorators here
              return null;
            }}
          />
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
});

export default SpendingTrendChart;
