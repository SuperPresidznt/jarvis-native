/**
 * AlarmForm Component
 * Create/edit alarm modal with form
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, IconButton, SegmentedButtons, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { RecurringAlarm, AlarmType } from '../../database/alarms';

interface AlarmFormProps {
  visible: boolean;
  alarm?: RecurringAlarm;
  onSave: (data: AlarmFormData) => void;
  onCancel: () => void;
}

export interface AlarmFormData {
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  alarmType: AlarmType;
}

const DAYS_FULL = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

export function AlarmForm({ visible, alarm, onSave, onCancel }: AlarmFormProps) {
  const [title, setTitle] = useState(alarm?.title || '');
  const [description, setDescription] = useState(alarm?.description || '');
  const [time, setTime] = useState<Date>(() => {
    if (alarm?.time) {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    return new Date();
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(alarm?.daysOfWeek || []);
  const [alarmType, setAlarmType] = useState<AlarmType>(alarm?.alarmType || 'gentle');

  useEffect(() => {
    if (alarm) {
      setTitle(alarm.title);
      setDescription(alarm.description || '');
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      setTime(date);
      setDaysOfWeek(alarm.daysOfWeek);
      setAlarmType(alarm.alarmType);
    }
  }, [alarm]);

  const handleSave = () => {
    if (!title.trim() || daysOfWeek.length === 0) {
      return;
    }

    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      time: timeStr,
      daysOfWeek,
      alarmType,
    });
  };

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };

  const selectAllDays = () => {
    setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
  };

  const selectWeekdays = () => {
    setDaysOfWeek([1, 2, 3, 4, 5]);
  };

  const selectWeekend = () => {
    setDaysOfWeek([0, 6]);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <View style={styles.header}>
            <Text variant="titleLarge">{alarm ? 'Edit Alarm' : 'Create Alarm'}</Text>
            <IconButton icon="close" onPress={onCancel} />
          </View>

          <View style={styles.content}>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
            />

            <Text variant="labelLarge" style={styles.label}>Time</Text>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              icon="clock-outline"
            >
              {formatTime(time)}
            </Button>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowTimePicker(false);
                  if (date) {
                    setTime(date);
                  }
                }}
              />
            )}

            <Text variant="labelLarge" style={styles.label}>Repeat on</Text>
            <View style={styles.quickActions}>
              <Button mode="outlined" onPress={selectAllDays} compact>
                Every day
              </Button>
              <Button mode="outlined" onPress={selectWeekdays} compact>
                Weekdays
              </Button>
              <Button mode="outlined" onPress={selectWeekend} compact>
                Weekend
              </Button>
            </View>

            <View style={styles.daysContainer}>
              {DAYS_FULL.map((day) => (
                <Chip
                  key={day.value}
                  selected={daysOfWeek.includes(day.value)}
                  onPress={() => toggleDay(day.value)}
                  style={styles.dayChip}
                >
                  {day.label}
                </Chip>
              ))}
            </View>

            {daysOfWeek.length === 0 && (
              <Text style={styles.error}>Please select at least one day</Text>
            )}

            <Text variant="labelLarge" style={styles.label}>Alarm Type</Text>
            <SegmentedButtons
              value={alarmType}
              onValueChange={(value) => setAlarmType(value as AlarmType)}
              buttons={[
                { value: 'gentle', label: 'Gentle', icon: 'bell-outline' },
                { value: 'urgent', label: 'Urgent', icon: 'bell-ring' },
              ]}
              style={styles.segmented}
            />
          </View>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={onCancel} style={styles.button}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!title.trim() || daysOfWeek.length === 0}
              style={styles.button}
            >
              {alarm ? 'Update' : 'Create'}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  timeButton: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  dayChip: {
    minWidth: 100,
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 12,
  },
  segmented: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
});

export default AlarmForm;
