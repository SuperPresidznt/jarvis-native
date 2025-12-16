/**
 * TaskReminderPicker Component
 * UI for selecting task reminder options
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, RadioButton, TextInput, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Task } from '../../database/tasks';

export interface TaskReminderOptions {
  reminderTime?: string;
  reminderMinutes?: number;
}

interface TaskReminderPickerProps {
  task: Task;
  visible: boolean;
  onSelect: (options: TaskReminderOptions) => void;
  onCancel: () => void;
}

export function TaskReminderPicker({ task, visible, onSelect, onCancel }: TaskReminderPickerProps) {
  const [reminderType, setReminderType] = useState<'specific' | 'relative' | 'none'>(
    task.reminderTime ? 'specific' : task.reminderMinutes ? 'relative' : 'none'
  );
  const [specificTime, setSpecificTime] = useState<Date>(
    task.reminderTime ? new Date(task.reminderTime) : new Date()
  );
  const [relativeMinutes, setRelativeMinutes] = useState<number>(task.reminderMinutes || 60);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    if (reminderType === 'none') {
      onSelect({ reminderTime: undefined, reminderMinutes: undefined });
    } else if (reminderType === 'specific') {
      onSelect({ reminderTime: specificTime.toISOString(), reminderMinutes: undefined });
    } else {
      onSelect({ reminderTime: undefined, reminderMinutes: relativeMinutes });
    }
  };

  const presetMinutes = [
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
    { label: '2 hours before', value: 120 },
    { label: '1 day before', value: 1440 },
  ];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <View style={styles.header}>
            <Text variant="titleLarge">Set Reminder</Text>
            <IconButton icon="close" onPress={onCancel} />
          </View>

          <RadioButton.Group onValueChange={(value) => setReminderType(value as any)} value={reminderType}>
            <View style={styles.option}>
              <RadioButton.Item label="No reminder" value="none" />
            </View>

            <View style={styles.option}>
              <RadioButton.Item label="At specific time" value="specific" />
              {reminderType === 'specific' && (
                <View style={styles.optionContent}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timeButton}
                  >
                    {specificTime.toLocaleString()}
                  </Button>
                  {showTimePicker && (
                    <DateTimePicker
                      value={specificTime}
                      mode="datetime"
                      display="default"
                      onChange={(event, date) => {
                        setShowTimePicker(false);
                        if (date) {
                          setSpecificTime(date);
                        }
                      }}
                    />
                  )}
                </View>
              )}
            </View>

            {task.dueDate && (
              <View style={styles.option}>
                <RadioButton.Item label="Before due date" value="relative" />
                {reminderType === 'relative' && (
                  <View style={styles.optionContent}>
                    {presetMinutes.map((preset) => (
                      <Button
                        key={preset.value}
                        mode={relativeMinutes === preset.value ? 'contained' : 'outlined'}
                        onPress={() => setRelativeMinutes(preset.value)}
                        style={styles.presetButton}
                      >
                        {preset.label}
                      </Button>
                    ))}

                    <View style={styles.customInput}>
                      <Text>Custom:</Text>
                      <TextInput
                        mode="outlined"
                        keyboardType="numeric"
                        value={relativeMinutes.toString()}
                        onChangeText={(text) => {
                          const num = parseInt(text, 10);
                          if (!isNaN(num) && num > 0) {
                            setRelativeMinutes(num);
                          }
                        }}
                        style={styles.input}
                        right={<TextInput.Affix text="minutes" />}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </RadioButton.Group>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={onCancel} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
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
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  option: {
    paddingVertical: 8,
  },
  optionContent: {
    paddingLeft: 56,
    paddingRight: 16,
    paddingBottom: 16,
  },
  timeButton: {
    marginTop: 8,
  },
  presetButton: {
    marginTop: 8,
  },
  customInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  input: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
});

export default TaskReminderPicker;
