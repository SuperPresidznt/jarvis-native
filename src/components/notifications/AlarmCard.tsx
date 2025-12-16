/**
 * AlarmCard Component
 * Displays a recurring alarm with controls
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, Text, Switch, Chip, IconButton } from 'react-native-paper';
import type { RecurringAlarm } from '../../database/alarms';

interface AlarmCardProps {
  alarm: RecurringAlarm;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AlarmCard({ alarm, onToggle, onEdit, onDelete }: AlarmCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card style={[styles.card, !alarm.isEnabled && styles.disabledCard]}>
      <Pressable onPress={onEdit}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.timeContainer}>
              <Text variant="headlineMedium" style={[styles.time, !alarm.isEnabled && styles.disabledText]}>
                {formatTime(alarm.time)}
              </Text>
              {alarm.alarmType === 'urgent' && (
                <Chip icon="alert" compact style={styles.urgentChip}>
                  Urgent
                </Chip>
              )}
            </View>
            <Switch value={alarm.isEnabled} onValueChange={onToggle} />
          </View>

          <Text variant="titleMedium" style={[styles.title, !alarm.isEnabled && styles.disabledText]}>
            {alarm.title}
          </Text>

          {alarm.description && (
            <Text variant="bodyMedium" style={[styles.description, !alarm.isEnabled && styles.disabledText]}>
              {alarm.description}
            </Text>
          )}

          <View style={styles.daysContainer}>
            {DAYS_SHORT.map((day, index) => {
              const isActive = alarm.daysOfWeek.includes(index);
              return (
                <Chip
                  key={day}
                  selected={isActive}
                  compact
                  style={[
                    styles.dayChip,
                    isActive && styles.activeDayChip,
                    !alarm.isEnabled && styles.disabledChip,
                  ]}
                  textStyle={[styles.dayText, isActive && styles.activeDayText]}
                >
                  {day}
                </Chip>
              );
            })}
          </View>
        </Card.Content>
      </Pressable>

      <Card.Actions>
        <IconButton icon="pencil" onPress={onEdit} />
        <IconButton icon="delete" onPress={onDelete} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  disabledCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#9e9e9e',
  },
  urgentChip: {
    backgroundColor: '#ffebee',
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  dayChip: {
    height: 32,
    backgroundColor: '#f5f5f5',
  },
  activeDayChip: {
    backgroundColor: '#e3f2fd',
  },
  disabledChip: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 12,
  },
  activeDayText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

export default AlarmCard;
