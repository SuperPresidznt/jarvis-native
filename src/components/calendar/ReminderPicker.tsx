/**
 * ReminderPicker Component
 * UI component for selecting event reminder times
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ReminderPickerProps {
  value: number | null;
  onChange: (minutes: number | null) => void;
}

interface ReminderOption {
  label: string;
  value: number | null;
  icon: string;
}

const REMINDER_OPTIONS: ReminderOption[] = [
  { label: 'No Reminder', value: null, icon: 'bell-off-outline' },
  { label: '5 minutes before', value: 5, icon: 'bell-outline' },
  { label: '15 minutes before', value: 15, icon: 'bell-outline' },
  { label: '30 minutes before', value: 30, icon: 'bell-outline' },
  { label: '1 hour before', value: 60, icon: 'bell-ring-outline' },
  { label: '2 hours before', value: 120, icon: 'bell-ring-outline' },
  { label: '1 day before', value: 1440, icon: 'bell-alert-outline' },
];

export function ReminderPicker({ value, onChange }: ReminderPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reminder</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
      >
        {REMINDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <Icon
                name={option.icon}
                size={20}
                color={isSelected ? colors.primary : colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionIcon: {
    marginRight: spacing.xs,
  },
  optionLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
