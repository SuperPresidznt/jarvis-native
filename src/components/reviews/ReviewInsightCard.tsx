/**
 * ReviewInsightCard Component
 * Displays an insight with category, message, and recommendation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Insight } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ReviewInsightCardProps {
  insight: Insight;
}

export function ReviewInsightCard({ insight }: ReviewInsightCardProps) {
  const { colors } = useTheme();

  const getInsightIcon = () => {
    switch (insight.type) {
      case 'positive':
        return 'checkmark-circle';
      case 'improvement':
        return 'alert-circle';
      case 'neutral':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'positive':
        return colors.success;
      case 'improvement':
        return colors.warning;
      case 'neutral':
        return colors.info;
      default:
        return colors.text.tertiary;
    }
  };

  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'positive':
        return colors.success + '15';
      case 'improvement':
        return colors.warning + '15';
      case 'neutral':
        return colors.info + '15';
      default:
        return colors.background.tertiary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: getBackgroundColor(),
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: getInsightColor() + '30',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: getInsightColor() + '25',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    category: {
      fontSize: 13,
      fontWeight: '700',
      color: getInsightColor(),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    message: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text.primary,
      lineHeight: 20,
      marginBottom: insight.recommendation ? 8 : 0,
    },
    recommendationContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.background.secondary + '50',
      borderRadius: 8,
      padding: 10,
      marginTop: 4,
    },
    recommendationIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    recommendation: {
      flex: 1,
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={getInsightIcon() as any} size={16} color={getInsightColor()} />
        </View>
        <Text style={styles.category}>{insight.category}</Text>
      </View>

      <Text style={styles.message}>{insight.message}</Text>

      {insight.recommendation && (
        <View style={styles.recommendationContainer}>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.text.tertiary}
            style={styles.recommendationIcon}
          />
          <Text style={styles.recommendation}>{insight.recommendation}</Text>
        </View>
      )}
    </View>
  );
}
