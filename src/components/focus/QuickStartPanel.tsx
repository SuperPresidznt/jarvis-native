/**
 * Quick Start Panel
 * Fast focus session start with duration presets and optional Pomodoro mode
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Switch,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { typography, spacing, borderRadius, shadows } from '../../theme';
import { Task } from '../../database/tasks';

interface DurationPreset {
  minutes: number;
  label: string;
  icon: string;
}

const DURATION_PRESETS: DurationPreset[] = [
  { minutes: 1, label: '1 min', icon: '⏱️' },
  { minutes: 2, label: '2 min', icon: '🎯' },
  { minutes: 10, label: '10 min', icon: '🚀' },
  { minutes: 15, label: '15 min', icon: '⚡' },
  { minutes: 25, label: '25 min', icon: '🍅' },
  { minutes: 50, label: '50 min', icon: '🔥' },
];

interface QuickStartPanelProps {
  onStart: (options: {
    minutes: number;
    title: string;
    taskId?: string;
    pomodoroMode: boolean;
  }) => void;
  pomodoroModeEnabled?: boolean;
  onPomodoroModeChange?: (enabled: boolean) => void;
}

export function QuickStartPanel({
  onStart,
  pomodoroModeEnabled = false,
  onPomodoroModeChange,
}: QuickStartPanelProps) {
  const { colors } = useTheme();
  const [_showTaskPicker, _setShowTaskPicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleQuickStart = (minutes: number) => {
    const title = pomodoroModeEnabled
      ? `Pomodoro - ${minutes} min work`
      : `Focus - ${minutes} min`;

    onStart({
      minutes,
      title,
      taskId: selectedTask?.id,
      pomodoroMode: pomodoroModeEnabled,
    });
  };

  // Commenting out unused function - may be needed for future task picker feature
  // const handleTaskSelected = (task: Task | null) => {
  //   setSelectedTask(task);
  //   setShowTaskPicker(false);
  // };

  return (
    <View style={styles.container}>
      {/* Quick Start Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Quick Start
        </Text>
        <IconButton
          icon="cog-outline"
          iconColor={colors.text.secondary}
          size={20}
          onPress={() => setShowSettings(true)}
        />
      </View>

      {/* Pomodoro Mode Indicator */}
      {pomodoroModeEnabled && (
        <View
          style={[
            styles.pomodoroIndicator,
            { backgroundColor: colors.error + '20', borderColor: colors.error },
          ]}
        >
          <Text style={styles.pomodoroIcon}>🍅</Text>
          <Text style={[styles.pomodoroText, { color: colors.error }]}>
            Pomodoro Mode: Work → Break cycles
          </Text>
        </View>
      )}

      {/* Duration Presets */}
      <View style={styles.presetGrid}>
        {DURATION_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.minutes}
            style={[
              styles.presetButton,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.subtle,
              },
            ]}
            onPress={() => handleQuickStart(preset.minutes)}
            activeOpacity={0.7}
          >
            <Text style={styles.presetIcon}>{preset.icon}</Text>
            <Text
              style={[styles.presetLabel, { color: colors.text.primary }]}
            >
              {preset.label}
            </Text>
            {preset.minutes === 25 && pomodoroModeEnabled && (
              <Text style={[styles.presetHint, { color: colors.text.tertiary }]}>
                Standard
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Link Task (optional) */}
      <TouchableOpacity
        style={[
          styles.taskLink,
          {
            backgroundColor: colors.background.secondary,
            borderColor: selectedTask ? colors.primary.main : colors.border.subtle,
          },
        ]}
        onPress={() => _setShowTaskPicker(true)}
      >
        <IconButton
          icon={selectedTask ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          iconColor={selectedTask ? colors.primary.main : colors.text.tertiary}
          size={20}
          style={styles.taskIcon}
        />
        <Text
          style={[
            styles.taskText,
            { color: selectedTask ? colors.text.primary : colors.text.secondary },
          ]}
          numberOfLines={1}
        >
          {selectedTask?.title || 'Link a task (optional)'}
        </Text>
        {selectedTask && (
          <IconButton
            icon="close"
            iconColor={colors.text.tertiary}
            size={16}
            onPress={() => setSelectedTask(null)}
          />
        )}
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background.primary },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Focus Settings
              </Text>
              <IconButton
                icon="close"
                iconColor={colors.text.secondary}
                size={24}
                onPress={() => setShowSettings(false)}
              />
            </View>

            {/* Pomodoro Mode Toggle */}
            <View
              style={[
                styles.settingRow,
                { borderBottomColor: colors.border.subtle },
              ]}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                  🍅 Pomodoro Mode
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Enables work/break cycles (25 min work, 5 min break)
                </Text>
              </View>
              <Switch
                value={pomodoroModeEnabled}
                onValueChange={onPomodoroModeChange}
                trackColor={{
                  false: colors.background.tertiary,
                  true: colors.primary.main + '80',
                }}
                thumbColor={pomodoroModeEnabled ? colors.primary.main : colors.text.tertiary}
              />
            </View>

            {pomodoroModeEnabled && (
              <View style={styles.pomodoroDetails}>
                <Text style={[styles.detailsText, { color: colors.text.secondary }]}>
                  • 25 min work → 5 min break
                </Text>
                <Text style={[styles.detailsText, { color: colors.text.secondary }]}>
                  • After 4 sessions → 15 min long break
                </Text>
                <Text style={[styles.detailsText, { color: colors.text.secondary }]}>
                  • Auto-starts next phase when complete
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  pomodoroIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  pomodoroIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  pomodoroText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  presetButton: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    ...shadows.sm,
  },
  presetIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  presetLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  presetHint: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  taskLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  taskIcon: {
    margin: 0,
  },
  taskText: {
    flex: 1,
    fontSize: typography.size.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: typography.size.sm,
  },
  pomodoroDetails: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  detailsText: {
    fontSize: typography.size.sm,
    marginBottom: spacing.xs,
  },
});
