/**
 * Calendar Screen
 * Professional calendar events view with Google Calendar sync
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendar.api';
import { AppButton, AppChip, EmptyState, LoadingState } from '../../components/ui';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';

export default function CalendarScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'all'>('today');

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar', 'events', viewMode],
    queryFn: () => {
      if (viewMode === 'today') {
        return calendarApi.getEvents(today, today);
      } else if (viewMode === 'week') {
        return calendarApi.getEvents(today, weekLater);
      } else {
        return calendarApi.getEvents();
      }
    },
  });

  const { data: syncSettings = [] } = useQuery({
    queryKey: ['calendar', 'sync'],
    queryFn: calendarApi.getSyncSettings,
  });

  const googleSync = syncSettings.find((s) => s.provider === 'google');

  const triggerSyncMutation = useMutation({
    mutationFn: calendarApi.triggerSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['calendar'] });
    setRefreshing(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && events.length === 0) {
    return <LoadingState fullScreen message="Loading calendar..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>
            {events.length} event{events.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => triggerSyncMutation.mutate()}
          disabled={triggerSyncMutation.isPending}
          style={styles.syncButton}
        >
          <Text style={styles.syncButtonText}>
            {triggerSyncMutation.isPending ? 'Syncing...' : 'Sync'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sync Status */}
      {googleSync && (
        <View style={styles.syncCard}>
          <View style={styles.syncInfo}>
            <View style={styles.syncStatus}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: googleSync.syncEnabled
                      ? colors.success
                      : colors.text.disabled,
                  },
                ]}
              />
              <Text style={styles.syncText}>
                Google Calendar:{' '}
                {googleSync.syncEnabled ? 'Connected' : 'Not Connected'}
              </Text>
            </View>
            {googleSync.lastSyncAt && (
              <Text style={styles.lastSyncText}>
                Last sync: {new Date(googleSync.lastSyncAt).toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* View Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['today', 'week', 'all'] as const).map((mode) => (
          <AppChip
            key={mode}
            label={mode === 'today' ? 'Today' : mode === 'week' ? 'This Week' : 'All'}
            selected={viewMode === mode}
            onPress={() => setViewMode(mode)}
          />
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <AppButton
          title="New Event"
          onPress={() => {
            /* TODO: Open create event modal */
          }}
          fullWidth
          style={styles.createButton}
        />

        {events.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No events"
            description={
              viewMode === 'today'
                ? 'Your schedule is clear for today'
                : viewMode === 'week'
                ? 'No events scheduled this week'
                : 'Create events to keep track of your schedule'
            }
            actionLabel="Create Event"
            onAction={() => {
              /* TODO: Open create event modal */
            }}
          />
        ) : (
          <View style={styles.eventsList}>
            {events.map((event: any) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                activeOpacity={0.9}
              >
                <View style={styles.eventTimeColumn}>
                  <Text style={styles.eventTimeText}>
                    {formatTime(event.startAt)}
                  </Text>
                  <View style={styles.eventTimeLine} />
                  <Text style={styles.eventTimeText}>
                    {formatTime(event.endAt)}
                  </Text>
                </View>

                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <AppChip
                      label={formatDate(event.startAt)}
                      variant="info"
                      compact
                    />
                  </View>

                  {event.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}

                  {event.location && (
                    <View style={styles.eventLocation}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={styles.locationText}>{event.location}</Text>
                    </View>
                  )}

                  {event.isRecurring && (
                    <AppChip label="Recurring" compact style={styles.recurringChip} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  syncButton: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  syncButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  syncCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.xs,
  },
  syncInfo: {
    gap: spacing.xs,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  syncText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  lastSyncText: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginLeft: spacing.base + spacing.sm,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  createButton: {
    marginBottom: spacing.lg,
  },
  eventsList: {
    gap: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.sm,
  },
  eventTimeColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
  },
  eventTimeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
  },
  eventTimeLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.xs,
  },
  eventContent: {
    flex: 1,
    padding: spacing.base,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  eventDescription: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
    marginBottom: spacing.sm,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  recurringChip: {
    marginTop: spacing.xs,
  },
});
