/**
 * ReviewDetail Component
 * Full review display with all sections and insights
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Review } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { ReviewStatsSection } from './ReviewStatsSection';
import { ReviewInsightCard } from './ReviewInsightCard';

interface ReviewDetailProps {
  review: Review;
  onClose: () => void;
  onExport: () => void;
}

export function ReviewDetail({ review, onClose, onExport }: ReviewDetailProps) {
  const { colors } = useTheme();
  const [exportFormat, setExportFormat] = useState<'text' | 'markdown' | 'json'>('text');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleExport = () => {
    Alert.alert(
      'Export Review',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Text (.txt)',
          onPress: () => {
            setExportFormat('text');
            onExport();
          },
        },
        {
          text: 'Markdown (.md)',
          onPress: () => {
            setExportFormat('markdown');
            onExport();
          },
        },
        {
          text: 'JSON (.json)',
          onPress: () => {
            setExportFormat('json');
            onExport();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      backgroundColor: colors.background.secondary,
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    closeButton: {
      padding: 4,
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary.main,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    exportButtonText: {
      color: colors.primary.contrast,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 15,
      color: colors.text.secondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 16,
      marginTop: 8,
    },
    emptyState: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.text.tertiary,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  const { data } = review;

  // Prepare stats for each section
  const taskStats = [
    { label: 'Completed', value: data.tasks.completed },
    { label: 'Created', value: data.tasks.created },
    { label: 'Completion Rate', value: `${data.tasks.completionRate}%` },
    { label: 'Average Latency', value: `${data.tasks.averageLatency.toFixed(1)} days` },
  ];

  const habitStats = [
    { label: 'Total Completions', value: data.habits.totalCompletions },
    { label: 'Average Streak', value: `${data.habits.averageStreak} days` },
    { label: 'Best Streak', value: `${data.habits.bestStreak} days` },
    { label: 'Completion Rate', value: `${data.habits.completionRate}%` },
  ];

  const focusStats = [
    { label: 'Total Sessions', value: data.focus.totalSessions },
    { label: 'Total Time', value: formatDuration(data.focus.totalMinutes) },
    { label: 'Average Session', value: formatDuration(data.focus.averageSessionLength) },
    {
      label: 'Most Productive Hours',
      value: data.focus.mostProductiveHours.length > 0
        ? data.focus.mostProductiveHours.join(', ')
        : 'N/A',
    },
  ];

  const pomodoroStats = [
    { label: 'Total Completed', value: data.pomodoro.totalPomodoros },
    { label: 'Total Time', value: formatDuration(data.pomodoro.totalMinutes) },
    { label: 'Completion Rate', value: `${data.pomodoro.completionRate}%` },
    { label: 'Average Per Day', value: data.pomodoro.averagePerDay.toFixed(1) },
  ];

  const financeStats = [
    { label: 'Income', value: `$${data.finance.totalIncome.toFixed(2)}` },
    { label: 'Expenses', value: `$${data.finance.totalExpenses.toFixed(2)}` },
    {
      label: 'Net Cash Flow',
      value: `${data.finance.netCashFlow >= 0 ? '+' : ''}$${data.finance.netCashFlow.toFixed(2)}`,
    },
    { label: 'Budget Adherence', value: `${data.finance.budgetAdherence}%` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.text.primary} />
          </Pressable>
          <Pressable style={styles.exportButton} onPress={handleExport}>
            <Ionicons name="share-outline" size={18} color={colors.primary.contrast} />
            <Text style={styles.exportButtonText}>Export</Text>
          </Pressable>
        </View>

        <Text style={styles.headerTitle}>
          {review.reviewType.charAt(0).toUpperCase() + review.reviewType.slice(1)} Review
        </Text>
        <Text style={styles.headerSubtitle}>
          {formatDate(review.periodStart)} - {formatDate(review.periodEnd)}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Tasks Section */}
        <ReviewStatsSection title="Tasks" icon="checkbox-outline" stats={taskStats} />

        {/* Habits Section */}
        <ReviewStatsSection title="Habits" icon="checkmark-done-outline" stats={habitStats} />

        {/* Focus Sessions Section */}
        <ReviewStatsSection title="Focus Sessions" icon="fitness-outline" stats={focusStats} />

        {/* Pomodoro Section */}
        <ReviewStatsSection title="Pomodoro" icon="timer-outline" stats={pomodoroStats} />

        {/* Finance Section */}
        <ReviewStatsSection title="Finances" icon="wallet-outline" stats={financeStats} />

        {/* Insights Section */}
        <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
        {data.insights.length > 0 ? (
          data.insights.map((insight, index) => (
            <ReviewInsightCard key={index} insight={insight} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateText}>
              No insights available for this period
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
