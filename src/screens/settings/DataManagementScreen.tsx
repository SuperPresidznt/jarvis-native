/**
 * Data Management Screen
 * Advanced settings with danger zone for destructive actions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../types';
import { DestructiveActionDialog } from '../../components/DestructiveActionDialog';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';
import { getTasks } from '../../database/tasks';
import { getHabits } from '../../database/habits';
import { getEvents } from '../../database/calendar';
import {
  getTransactions,
  getAssets,
  getLiabilities,
} from '../../database/finance';
import { dropAllTables, initDatabase } from '../../database';
import { alertSuccess, alertError } from '../../utils/dialogs';
import { haptic } from '../../utils/haptics';
import { exportAllDataAsJSON } from '../../services/export';
import { AppButton } from '../../components/ui';

type DataManagementScreenProps = {
  navigation: NativeStackNavigationProp<SettingsStackParamList, 'DataManagement'>;
};

interface DatabaseStats {
  tasks: number;
  habits: number;
  events: number;
  transactions: number;
  assets: number;
  liabilities: number;
}

export default function DataManagementScreen({ navigation }: DataManagementScreenProps) {
  const insets = useSafeAreaInsets();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState<DatabaseStats>({
    tasks: 0,
    habits: 0,
    events: 0,
    transactions: 0,
    assets: 0,
    liabilities: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [tasks, habits, events, transactions, assets, liabilities] = await Promise.all([
        getTasks(),
        getHabits(),
        getEvents(),
        getTransactions(),
        getAssets(),
        getLiabilities(),
      ]);

      setStats({
        tasks: tasks.length,
        habits: habits.length,
        events: events.length,
        transactions: transactions.length,
        assets: assets.length,
        liabilities: liabilities.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      haptic.light();
      const result = await exportAllDataAsJSON();

      if (result.success) {
        alertSuccess('Export Successful', result.message);
      } else {
        alertError('Export Failed', result.message);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      alertError('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAllData = async () => {
    try {
      haptic.heavy();
      await dropAllTables();
      await initDatabase();
      await loadStats();

      alertSuccess(
        'Success',
        'All data has been cleared successfully.'
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to clear data:', error);
      alertError('Error', 'Failed to clear data. Please try again.');
      throw error; // Re-throw to be caught by dialog
    }
  };

  const totalRecords = Object.values(stats).reduce((sum, val) => sum + val, 0);

  const confirmationDetails = [
    `${stats.tasks} tasks`,
    `${stats.habits} habits and logs`,
    `${stats.events} calendar events`,
    `${stats.transactions} transactions`,
    `${stats.assets} assets`,
    `${stats.liabilities} liabilities`,
  ].filter((_, index) => Object.values(stats)[index] > 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing['3xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>Advanced Settings</Text>
          <Text style={styles.warningText}>
            These actions affect all your data. Proceed with caution.
          </Text>
        </View>
      </View>

      {/* Export Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BACKUP & EXPORT</Text>
        <View style={styles.exportCard}>
          <View style={styles.exportContent}>
            <Text style={styles.exportTitle}>📦  Export All Data</Text>
            <Text style={styles.exportSubtitle}>
              Download a complete backup of all your data as JSON ({totalRecords} {totalRecords === 1 ? 'item' : 'items'})
            </Text>
            <Text style={styles.exportDescription}>
              Includes tasks, habits, calendar events, transactions, budgets, and all settings. Perfect for backing up or migrating to another device.
            </Text>

            <View style={styles.exportButtonContainer}>
              <AppButton
                title={isExporting ? 'Exporting...' : 'Export JSON Backup'}
                onPress={handleExportData}
                loading={isExporting}
                disabled={isExporting || loading}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Danger Zone Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DANGER ZONE</Text>
        <View style={styles.dangerZone}>
          <View style={styles.dangerContent}>
            <Text style={styles.dangerTitle}>🗑️  Clear All Data</Text>
            <Text style={styles.dangerSubtitle}>
              Permanently delete all database records ({totalRecords} {totalRecords === 1 ? 'item' : 'items'})
            </Text>
            <Text style={styles.dangerWarning}>
              This action cannot be undone. Make sure you have exported your data if you need a backup.
            </Text>

            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Text
                  style={styles.buttonText}
                  onPress={() => setShowConfirmDialog(true)}
                >
                  Clear All Data
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Destructive Action Confirmation Dialog */}
      <DestructiveActionDialog
        visible={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClearAllData}
        title="Clear All Data?"
        confirmationPhrase="DELETE ALL DATA"
        warningMessage={`This will permanently delete all ${totalRecords} records from your database:`}
        details={confirmationDetails}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    paddingTop: spacing.base,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    ...shadows.sm,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * 1.5,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  exportCard: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.md,
  },
  exportContent: {
    padding: spacing.lg,
  },
  exportTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },
  exportSubtitle: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exportDescription: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * 1.5,
    marginBottom: spacing.lg,
  },
  exportButtonContainer: {
    alignItems: 'stretch',
  },
  dangerZone: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.error,
    ...shadows.md,
  },
  dangerContent: {
    padding: spacing.lg,
  },
  dangerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  dangerSubtitle: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  dangerWarning: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * 1.5,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  buttonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.inverse,
    textAlign: 'center',
  },
});
