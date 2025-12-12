/**
 * Dashboard Screen
 * Overview of daily metrics, start controls, and quick capture
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TextInput } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dashboardApi } from '../../services/dashboard.api';
import { MetricCard } from '../../components/MetricCard';
import { StartControls } from '../../components/StartControls';
import { colors, typography, spacing, borderRadius, textStyles, cardStyle, inputStyle } from '../../theme';

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Fetch today's metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', 'today'],
    queryFn: dashboardApi.getTodayMetrics,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch macro goals
  const { data: macroGoals = [] } = useQuery({
    queryKey: ['macro-goals'],
    queryFn: dashboardApi.getMacroGoals,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['metrics', 'today'] }),
      queryClient.invalidateQueries({ queryKey: ['macro-goals'] }),
    ]);
    setRefreshing(false);
  };

  const formatCash = (value: number | null, currency: string) => {
    if (value == null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(value / 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  if (metricsLoading && !metrics) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + spacing.xl }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
        />
      }
    >
      <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="labelSmall" style={styles.todayLabel}>
            TODAY
          </Text>
          <Text variant="headlineLarge" style={styles.dateText}>
            {getFormattedDate()}
          </Text>
          <Text variant="titleMedium" style={styles.greeting}>
            {getGreeting()}
          </Text>
        </View>

        {/* Today's Metrics */}
        {metrics && (
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Starts today"
              value={metrics.starts}
              helper={
                metrics.starts >= 3
                  ? 'Great momentum!'
                  : 'Micro-starts fuel progress'
              }
              variant={metrics.starts >= 3 ? 'success' : 'default'}
            />
            <MetricCard
              label="Study minutes"
              value={metrics.studyMinutes}
              helper="Daily learning time"
            />
            <MetricCard
              label="Cash on hand"
              value={formatCash(metrics.cash, metrics.currency)}
              helper={`Latest snapshot (${metrics.currency})`}
            />
          </View>
        )}

        {/* Start Controls */}
        <Card style={styles.controlsCard}>
          <Card.Content>
            <StartControls
              macroGoals={macroGoals}
              defaultDuration={10}
            />
          </Card.Content>
        </Card>

        {/* Quick Capture */}
        <View style={styles.quickCaptureSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick capture
          </Text>
          <View style={styles.quickCaptureGrid}>
            <QuickCaptureCard
              title="Idea"
              placeholder="Capture an idea..."
              icon="lightbulb-outline"
            />
            <QuickCaptureCard
              title="Study"
              placeholder="Log study session..."
              icon="book-outline"
            />
            <QuickCaptureCard
              title="Cash"
              placeholder="Record cash snapshot..."
              icon="cash"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

interface QuickCaptureCardProps {
  title: string;
  placeholder: string;
  icon: string;
}

const QuickCaptureCard: React.FC<QuickCaptureCardProps> = ({
  title,
  placeholder,
  icon,
}) => {
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement quick capture API calls
    console.log(`Quick capture ${title}:`, value);
    setValue('');
    setIsExpanded(false);
  };

  return (
    <Card style={styles.quickCaptureCard}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.quickCaptureTitle}>
          {title}
        </Text>
        {isExpanded ? (
          <>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor={colors.text.placeholder}
              style={styles.quickCaptureInput}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.quickCaptureButtons}>
              <Button
                mode="text"
                onPress={() => {
                  setValue('');
                  setIsExpanded(false);
                }}
                textColor={colors.text.tertiary}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!value.trim()}
                style={styles.submitButton}
              >
                Save
              </Button>
            </View>
          </>
        ) : (
          <Button
            mode="outlined"
            onPress={() => setIsExpanded(true)}
            style={styles.expandButton}
          >
            Add {title}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing['2xl'],
  },
  header: {
    gap: spacing.xs,
  },
  todayLabel: {
    ...textStyles.label,
    color: colors.text.disabled,
    letterSpacing: typography.letterSpacing.widest,
  },
  dateText: {
    ...textStyles.h2,
    marginTop: spacing.xs,
  },
  greeting: {
    ...textStyles.bodySecondary,
    fontSize: typography.size.md,
    marginTop: spacing.xs,
  },
  metricsGrid: {
    gap: spacing.md,
  },
  controlsCard: {
    ...cardStyle,
    borderRadius: borderRadius.xl,
  },
  quickCaptureSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h4,
  },
  quickCaptureGrid: {
    gap: spacing.md,
  },
  quickCaptureCard: {
    ...cardStyle,
  },
  quickCaptureTitle: {
    ...textStyles.h4,
    fontSize: typography.size.md,
    marginBottom: spacing.md,
  },
  quickCaptureInput: {
    ...inputStyle,
    textAlignVertical: 'top',
    minHeight: 90,
    marginBottom: spacing.md,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  quickCaptureButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.accent.primary,
  },
  expandButton: {
    borderColor: colors.border.default,
    borderWidth: 1.5,
  },
});
