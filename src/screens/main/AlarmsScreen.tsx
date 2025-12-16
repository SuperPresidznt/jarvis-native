/**
 * AlarmsScreen
 * Manage recurring alarms
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { FAB, Text, Button, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlarms } from '../../hooks/useAlarms';
import { AlarmCard, AlarmForm, type AlarmFormData } from '../../components/notifications';
import type { RecurringAlarm } from '../../database/alarms';

export default function AlarmsScreen() {
  const {
    alarms,
    isLoading,
    error,
    loadAlarms,
    createNewAlarm,
    editAlarm,
    toggleAlarmEnabled,
    removeAlarm,
  } = useAlarms();

  const [showForm, setShowForm] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<RecurringAlarm | undefined>(undefined);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [alarmToDelete, setAlarmToDelete] = useState<RecurringAlarm | null>(null);

  const handleCreateAlarm = () => {
    setEditingAlarm(undefined);
    setShowForm(true);
  };

  const handleEditAlarm = (alarm: RecurringAlarm) => {
    setEditingAlarm(alarm);
    setShowForm(true);
  };

  const handleSaveAlarm = async (data: AlarmFormData) => {
    try {
      if (editingAlarm) {
        await editAlarm(editingAlarm.id, data);
      } else {
        await createNewAlarm(data);
      }
      setShowForm(false);
      setEditingAlarm(undefined);
    } catch (err) {
      console.error('[AlarmsScreen] Error saving alarm:', err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAlarm(undefined);
  };

  const handleToggleAlarm = async (alarm: RecurringAlarm) => {
    try {
      await toggleAlarmEnabled(alarm.id);
    } catch (err) {
      console.error('[AlarmsScreen] Error toggling alarm:', err);
    }
  };

  const handleDeleteAlarm = (alarm: RecurringAlarm) => {
    setAlarmToDelete(alarm);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (alarmToDelete) {
      try {
        await removeAlarm(alarmToDelete.id);
        setDeleteDialogVisible(false);
        setAlarmToDelete(null);
      } catch (err) {
        console.error('[AlarmsScreen] Error deleting alarm:', err);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogVisible(false);
    setAlarmToDelete(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadAlarms} />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Recurring Alarms
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Set up daily alarms for routines and reminders
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="outlined" onPress={loadAlarms}>
              Retry
            </Button>
          </View>
        )}

        {alarms.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text variant="titleLarge" style={styles.emptyTitle}>
              No alarms set
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              Create your first recurring alarm to get started
            </Text>
            <Button
              mode="contained"
              onPress={handleCreateAlarm}
              icon="alarm-plus"
              style={styles.emptyButton}
            >
              Create Alarm
            </Button>
          </View>
        )}

        {alarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            alarm={alarm}
            onToggle={() => handleToggleAlarm(alarm)}
            onEdit={() => handleEditAlarm(alarm)}
            onDelete={() => handleDeleteAlarm(alarm)}
          />
        ))}

        {alarms.length > 0 && <View style={styles.bottomPadding} />}
      </ScrollView>

      {alarms.length > 0 && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreateAlarm}
          label="New Alarm"
        />
      )}

      <AlarmForm
        visible={showForm}
        alarm={editingAlarm}
        onSave={handleSaveAlarm}
        onCancel={handleCancelForm}
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={cancelDelete}>
          <Dialog.Title>Delete Alarm</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{alarmToDelete?.title}"?
            </Text>
            <Text variant="bodySmall" style={styles.deleteWarning}>
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelDelete}>Cancel</Button>
            <Button onPress={confirmDelete} textColor="#d32f2f">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  deleteWarning: {
    color: '#666',
    marginTop: 8,
  },
});
