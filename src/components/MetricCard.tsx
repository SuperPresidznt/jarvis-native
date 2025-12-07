/**
 * MetricCard Component
 * Displays a single metric with label and helper text
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  helper,
  variant = 'default',
}) => {
  const getValueColor = () => {
    switch (variant) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'danger':
        return '#EF4444';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelSmall" style={styles.label}>
          {label.toUpperCase()}
        </Text>
        <Text
          variant="headlineMedium"
          style={[styles.value, { color: getValueColor() }]}
        >
          {value}
        </Text>
        {helper && (
          <Text variant="bodySmall" style={styles.helper}>
            {helper}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  label: {
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 1,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helper: {
    color: '#64748B',
  },
});
