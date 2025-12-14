/**
 * BaseChart Component
 * Wrapper with loading, error, and empty states
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface BaseChartProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  height?: number;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No data available',
  children,
  height = 220,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.message}>Loading chart...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.message}>{emptyMessage}</Text>
      </View>
    );
  }

  // Chart content
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  message: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.size.sm,
    color: colors.error,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
});

export default BaseChart;
