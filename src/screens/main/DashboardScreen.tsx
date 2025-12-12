/**
 * Dashboard Screen
 * Beautiful, polished overview of daily metrics and quick actions
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dashboardApi } from '../../services/dashboard.api';
import { MetricCard } from '../../components/MetricCard';
import { StartControls } from '../../components/StartControls';
import { AppCard, AppButton, EmptyState, LoadingState } from '../../components/ui';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  textStyles,
} from '../../theme';

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Fetch today's metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', 'today'],
    queryFn: dashboardApi.getTodayMetrics,
    refetchInterval: 60000,
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
    if (value == null) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  if (metricsLoading && !metrics) {
    return <LoadingState fullScreen message="Loading your dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing['3xl'] },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary.main}
          colors={[colors.primary.main]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.content, { paddingTop: insets.top + spacing.base }]}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.dateLabel}>TODAY</Text>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>

        {/* Metrics Grid */}
        {metrics && (
          <View style={styles.metricsSection}>
            <Text style={styles.sectionLabel}>YOUR PROGRESS</Text>
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
                variant="info"
              />
              <MetricCard
                label="Cash on hand"
                value={formatCash(metrics.cash, metrics.currency)}
                helper={`Latest snapshot`}
                variant="success"
              />
            </View>
          </View>
        )}

        {/* Start Controls Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK START</Text>
          <AppCard variant="elevated">
            <StartControls macroGoals={macroGoals} defaultDuration={10} />
          </AppCard>
        </View>

        {/* Quick Capture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK CAPTURE</Text>
          <View style={styles.quickCaptureGrid}>
            <QuickCaptureCard
              title="Idea"
              placeholder="Capture an idea..."
              emoji="💡"
            />
            <QuickCaptureCard
              title="Study"
              placeholder="Log study session..."
              emoji="📚"
            />
            <QuickCaptureCard
              title="Cash"
              placeholder="Record cash snapshot..."
              emoji="💰"
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
  emoji: string;
}

const QuickCaptureCard: React.FC<QuickCaptureCardProps> = ({
  title,
  placeholder,
  emoji,
}) => {
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    console.log(`Quick capture ${title}:`, value);
    setValue('');
    setIsExpanded(false);
  };

  return (
    <View style={[styles.quickCaptureCard, isExpanded && styles.quickCaptureCardExpanded]}>
      <View style={styles.quickCaptureHeader}>
        <Text style={styles.quickCaptureEmoji}>{emoji}</Text>
        <Text style={styles.quickCaptureTitle}>{title}</Text>
      </View>

      {isExpanded ? (
        <View style={styles.quickCaptureForm}>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.text.placeholder}
            style={[
              styles.quickCaptureInput,
              isFocused && styles.quickCaptureInputFocused,
            ]}
            multiline
            numberOfLines={3}
            autoFocus
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <View style={styles.quickCaptureButtons}>
            <TouchableOpacity
              onPress={() => {
                setValue('');
                setIsExpanded(false);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!value.trim()}
              style={[
                styles.saveButton,
                !value.trim() && styles.saveButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  !value.trim() && styles.saveButtonTextDisabled,
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsExpanded(true)}
          style={styles.expandButton}
          activeOpacity={0.7}
        >
          <Text style={styles.expandButtonText}>+ Add {title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  // Header styles
  header: {
    marginBottom: spacing['2xl'],
  },
  dateLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary.main,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  greeting: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.regular,
    color: colors.text.tertiary,
  },
  // Section styles
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.md,
  },
  // Metrics styles
  metricsSection: {
    marginBottom: spacing.xl,
  },
  metricsGrid: {
    gap: spacing.md,
  },
  // Quick capture styles
  quickCaptureGrid: {
    gap: spacing.md,
  },
  quickCaptureCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.sm,
  },
  quickCaptureCardExpanded: {
    borderColor: colors.primary.main,
  },
  quickCaptureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quickCaptureEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  quickCaptureTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  quickCaptureForm: {
    gap: spacing.md,
  },
  quickCaptureInput: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.size.base,
    textAlignVertical: 'top',
    minHeight: 80,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  quickCaptureInputFocused: {
    borderColor: colors.primary.main,
  },
  quickCaptureButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  cancelButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  saveButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },
  saveButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: '#FFFFFF',
  },
  saveButtonTextDisabled: {
    color: colors.text.disabled,
  },
  expandButton: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
  },
});
