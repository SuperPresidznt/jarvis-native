/**
 * ReviewCard Component
 * Displays a review summary card with key metrics
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Review } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ReviewCardProps {
  review: Review;
  onPress: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function ReviewCard({ review, onPress, onDelete, onExport }: ReviewCardProps) {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getReviewIcon = () => {
    switch (review.reviewType) {
      case 'weekly':
        return 'calendar-outline';
      case 'monthly':
        return 'calendar';
      case 'custom':
        return 'time-outline';
      default:
        return 'document-text-outline';
    }
  };

  const getReviewTypeLabel = () => {
    return review.reviewType.charAt(0).toUpperCase() + review.reviewType.slice(1);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    headerLeft: {
      flex: 1,
    },
    typeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    typeIcon: {
      marginRight: 6,
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary.main,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    periodText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    dateText: {
      fontSize: 13,
      color: colors.text.tertiary,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: colors.background.tertiary,
    },
    metricsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    metric: {
      flex: 1,
    },
    metricLabel: {
      fontSize: 11,
      color: colors.text.tertiary,
      marginBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text.primary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border.subtle,
    },
    insightCount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    insightText: {
      fontSize: 12,
      color: colors.text.secondary,
      marginLeft: 6,
    },
    exportedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.tertiary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    exportedText: {
      fontSize: 11,
      color: colors.text.tertiary,
      marginLeft: 4,
    },
  });

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: colors.primary.main + '20' }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.typeRow}>
            <Ionicons
              name={getReviewIcon() as any}
              size={14}
              color={colors.primary.main}
              style={styles.typeIcon}
            />
            <Text style={styles.typeLabel}>{getReviewTypeLabel()} Review</Text>
          </View>
          <Text style={styles.periodText}>
            {formatDate(review.periodStart)} - {formatDate(review.periodEnd)}
          </Text>
          <Text style={styles.dateText}>Created {formatDate(review.createdAt)}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onExport();
            }}
          >
            <Ionicons name="share-outline" size={18} color={colors.text.secondary} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Tasks</Text>
          <Text style={styles.metricValue}>{review.data.tasks.completed}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Habits</Text>
          <Text style={styles.metricValue}>{review.data.habits.totalCompletions}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Focus</Text>
          <Text style={styles.metricValue}>
            {Math.round(review.data.focus.totalMinutes / 60)}h
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Pomodoros</Text>
          <Text style={styles.metricValue}>{review.data.pomodoro.totalPomodoros}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.insightCount}>
          <Ionicons name="bulb-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.insightText}>
            {review.data.insights.length} insight
            {review.data.insights.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {review.exported && (
          <View style={styles.exportedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.exportedText}>Exported</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
