/**
 * ReviewStatsSection Component
 * Displays statistics section in review detail
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface StatItem {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface ReviewStatsSectionProps {
  title: string;
  icon: string;
  stats: StatItem[];
}

export function ReviewStatsSection({ title, icon, stats }: ReviewStatsSectionProps) {
  const { colors } = useTheme();

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'neutral':
        return 'remove';
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      case 'neutral':
        return colors.text.tertiary;
      default:
        return colors.text.tertiary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary.main + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text.primary,
    },
    statsGrid: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    statRowLast: {
      borderBottomWidth: 0,
    },
    statLabel: {
      fontSize: 14,
      color: colors.text.secondary,
      flex: 1,
    },
    statRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: colors.background.tertiary,
    },
    trendText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={18} color={colors.primary.main} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statRow, index === stats.length - 1 && styles.statRowLast]}
          >
            <Text style={styles.statLabel}>{stat.label}</Text>
            <View style={styles.statRight}>
              <Text style={styles.statValue}>{stat.value}</Text>
              {stat.trend && stat.trendValue && (
                <View style={styles.trendContainer}>
                  <Ionicons
                    name={getTrendIcon(stat.trend) as any}
                    size={14}
                    color={getTrendColor(stat.trend)}
                  />
                  <Text style={[styles.trendText, { color: getTrendColor(stat.trend) }]}>
                    {stat.trendValue}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
