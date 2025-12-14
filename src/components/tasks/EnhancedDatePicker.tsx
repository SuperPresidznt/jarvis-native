/**
 * Enhanced Date Picker Component
 * Provides calendar view with quick date options for task due dates
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { getQuickDate, formatDateWithDay } from '../../utils/dateUtils';

interface EnhancedDatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string | undefined) => void;
  label: string;
}

export const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Quick date options
  const quickOptions = [
    { label: 'Today', icon: 'calendar-today', value: 'today' as const },
    { label: 'Tomorrow', icon: 'calendar-arrow-right', value: 'tomorrow' as const },
    { label: 'Next Week', icon: 'calendar-week', value: 'next-week' as const },
    { label: 'Weekend', icon: 'calendar-weekend', value: 'this-weekend' as const },
  ];

  const handleQuickDate = (type: 'today' | 'tomorrow' | 'next-week' | 'this-weekend') => {
    const dateString = getQuickDate(type);
    setSelectedDate(new Date(dateString));
    onChange(dateString);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      setSelectedDate(date);
      // Convert to ISO date string (YYYY-MM-DD)
      const dateString = date.toISOString().split('T')[0];
      onChange(dateString);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    onChange(undefined);
    setShowPicker(false);
  };

  const handleShowPicker = () => {
    setShowPicker(true);
  };

  const handleDismissPicker = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Quick Options */}
      <View style={styles.quickOptions}>
        {quickOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.quickButton}
            onPress={() => handleQuickDate(option.value)}
            activeOpacity={0.7}
          >
            <Icon name={option.icon} size={18} color={colors.primary.main} />
            <Text style={styles.quickButtonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Date Display */}
      <View style={styles.selectedDateContainer}>
        {selectedDate ? (
          <View style={styles.dateDisplay}>
            <Icon name="calendar-check" size={20} color={colors.primary.main} />
            <Text style={styles.dateText}>
              {formatDateWithDay(selectedDate.toISOString().split('T')[0])}
            </Text>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDateText}>No due date set</Text>
        )}
      </View>

      {/* Custom Date Button */}
      <TouchableOpacity
        style={styles.customButton}
        onPress={handleShowPicker}
        activeOpacity={0.7}
      >
        <Icon name="calendar-blank" size={20} color={colors.text.secondary} />
        <Text style={styles.customButtonText}>Pick Custom Date</Text>
      </TouchableOpacity>

      {/* Native Date Picker */}
      {showPicker && (
        <>
          {Platform.OS === 'ios' ? (
            // iOS: Show inline picker with done button
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.iosClearButton}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDismissPicker}>
                  <Text style={styles.iosDoneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="inline"
                onChange={handleDateChange}
                minimumDate={new Date()} // Don't allow past dates by default
              />
            </View>
          ) : (
            // Android: Show modal picker
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()} // Don't allow past dates by default
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  quickOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  quickButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.primary.main,
  },
  selectedDateContainer: {
    marginBottom: spacing.md,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary.main,
  },
  dateText: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  noDateText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.md,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  customButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  // iOS Picker Styles
  iosPickerContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    backgroundColor: colors.background.secondary,
  },
  iosClearButton: {
    fontSize: typography.size.base,
    color: colors.error,
    fontWeight: typography.weight.medium,
  },
  iosDoneButton: {
    fontSize: typography.size.base,
    color: colors.primary.main,
    fontWeight: typography.weight.semibold,
  },
});

export default EnhancedDatePicker;
