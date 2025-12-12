/**
 * Dashboard Screen
 * Overview of daily metrics, start controls, and quick capture
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TextInput } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../../services/dashboard.api';
import { MetricCard } from '../../components/MetricCard';
import { StartControls } from '../../components/StartControls';

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10B981"
        />
      }
    >
      <View style={styles.content}>
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
              placeholderTextColor="#64748B"
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
                textColor="#64748B"
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
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
    gap: 28,
    paddingBottom: 40,
  },
  header: {
    gap: 6,
    paddingTop: 8,
  },
  todayLabel: {
    color: '#64748B',
    letterSpacing: 3,
    fontWeight: '600',
  },
  dateText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 4,
  },
  greeting: {
    color: '#94A3B8',
    marginTop: 2,
  },
  metricsGrid: {
    gap: 14,
  },
  controlsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  quickCaptureSection: {
    gap: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  quickCaptureGrid: {
    gap: 14,
  },
  quickCaptureCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quickCaptureTitle: {
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  quickCaptureInput: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
    textAlignVertical: 'top',
    minHeight: 90,
  },
  quickCaptureButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  expandButton: {
    borderColor: '#475569',
    borderWidth: 1.5,
  },
});
