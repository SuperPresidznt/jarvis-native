/**
 * Habits Screen
 * Habit tracking with streaks and heatmap visualization
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  IconButton,
  Chip,
  Switch,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi, Habit, HabitCadence } from '../../services/habits.api';
import { HabitHeatmap } from '../../components/HabitHeatmap';

export default function HabitsScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapHabit, setHeatmapHabit] = useState<Habit | null>(null);

  // Fetch habits
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.getHabits,
  });

  // Log completion mutation
  const logCompletionMutation = useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      habitsApi.logCompletion(habitId, { date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => habitsApi.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      habitsApi.updateHabit(id, { isActive: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['habits'] });
    setRefreshing(false);
  };

  const handleLogToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    logCompletionMutation.mutate({ habitId, date: today });
  };

  const handleDelete = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure? All completion history will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(habitId),
        },
      ]
    );
  };

  const handleViewHeatmap = (habit: Habit) => {
    setHeatmapHabit(habit);
    setShowHeatmap(true);
  };

  const activeHabits = habits.filter((h) => h.isActive);
  const inactiveHabits = habits.filter((h) => !h.isActive);

  if (isLoading && habits.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Habits
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            {activeHabits.length} active habits
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {
            setSelectedHabit(null);
            setShowCreateModal(true);
          }}
          style={styles.createButton}
        >
          New Habit
        </Button>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text variant="headlineSmall" style={styles.emptyText}>
              No habits yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Start building consistent habits to track your progress and build momentum
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                setSelectedHabit(null);
                setShowCreateModal(true);
              }}
              style={styles.emptyButton}
            >
              Create Habit
            </Button>
          </View>
        ) : (
          <>
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onLogToday={handleLogToday}
                onViewHeatmap={handleViewHeatmap}
                onEdit={(h) => {
                  setSelectedHabit(h);
                  setShowCreateModal(true);
                }}
                onDelete={handleDelete}
                onToggleActive={() =>
                  toggleActiveMutation.mutate({
                    id: habit.id,
                    isActive: habit.isActive,
                  })
                }
              />
            ))}

            {inactiveHabits.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Inactive Habits
                </Text>
                {inactiveHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onLogToday={handleLogToday}
                    onViewHeatmap={handleViewHeatmap}
                    onEdit={(h) => {
                      setSelectedHabit(h);
                      setShowCreateModal(true);
                    }}
                    onDelete={handleDelete}
                    onToggleActive={() =>
                      toggleActiveMutation.mutate({
                        id: habit.id,
                        isActive: habit.isActive,
                      })
                    }
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <HabitFormModal
        visible={showCreateModal}
        habit={selectedHabit}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedHabit(null);
        }}
      />

      {/* Heatmap Modal */}
      <Modal
        visible={showHeatmap}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHeatmap(false)}
      >
        <View style={styles.heatmapOverlay}>
          <View style={styles.heatmapContent}>
            <View style={styles.heatmapHeader}>
              <Text variant="headlineSmall" style={styles.heatmapTitle}>
                {heatmapHabit?.name}
              </Text>
              <IconButton icon="close" onPress={() => setShowHeatmap(false)} />
            </View>
            {heatmapHabit && (
              <HabitHeatmap
                habitId={heatmapHabit.id}
                completions={[]}
                weeks={12}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface HabitCardProps {
  habit: Habit;
  onLogToday: (id: string) => void;
  onViewHeatmap: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleActive: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onLogToday,
  onViewHeatmap,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <Card style={[styles.habitCard, !habit.isActive && styles.habitCardInactive]}>
      <Card.Content>
        <View style={styles.habitHeader}>
          <View style={styles.habitInfo}>
            <Text variant="titleMedium" style={styles.habitName}>
              {habit.name}
            </Text>
            {habit.description && (
              <Text variant="bodySmall" style={styles.habitDescription}>
                {habit.description}
              </Text>
            )}
            <View style={styles.habitMeta}>
              <Chip compact style={styles.frequencyChip}>
                {habit.cadence}
              </Chip>
              <View style={styles.streakContainer}>
                <Text variant="labelSmall" style={styles.streakLabel}>
                  Streak: {habit.currentStreak || 0} days
                </Text>
              </View>
            </View>
          </View>
          {habit.isActive && (
            <Button
              mode={(habit.completionsToday || 0) > 0 ? 'outlined' : 'contained'}
              onPress={() => onLogToday(habit.id)}
              style={styles.logButton}
              icon={(habit.completionsToday || 0) > 0 ? 'check' : 'plus'}
            >
              {(habit.completionsToday || 0) > 0 ? 'Done' : 'Log'}
            </Button>
          )}
        </View>

        <View style={styles.habitActions}>
          <Button mode="text" onPress={() => onViewHeatmap(habit)} compact>
            View Heatmap
          </Button>
          <Button mode="text" onPress={() => onEdit(habit)} compact>
            Edit
          </Button>
          <Button
            mode="text"
            onPress={() => onDelete(habit.id)}
            textColor="#EF4444"
            compact
          >
            Delete
          </Button>
        </View>

        <View style={styles.habitToggle}>
          <Text variant="labelSmall" style={styles.toggleLabel}>
            Active
          </Text>
          <Switch value={habit.isActive} onValueChange={onToggleActive} />
        </View>
      </Card.Content>
    </Card>
  );
};

interface HabitFormModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
}

const HabitFormModal: React.FC<HabitFormModalProps> = ({
  visible,
  habit,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [cadence, setCadence] = useState<HabitCadence>(
    habit?.cadence || 'daily'
  );

  const createMutation = useMutation({
    mutationFn: (data: any) => habitsApi.createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      habitsApi.updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const data = { name, description: description || undefined, cadence };
    if (habit) {
      updateMutation.mutate({ id: habit.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {habit ? 'Edit Habit' : 'New Habit'}
            </Text>
            <IconButton icon="close" onPress={onClose} />
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text variant="labelMedium" style={styles.label}>
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Habit name..."
                placeholderTextColor="#64748B"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="labelMedium" style={styles.label}>
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Optional description..."
                placeholderTextColor="#64748B"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="labelMedium" style={styles.label}>
                Frequency
              </Text>
              <View style={styles.frequencyButtons}>
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <Chip
                    key={freq}
                    selected={cadence === freq}
                    onPress={() => setCadence(freq)}
                    style={styles.frequencyOption}
                  >
                    {freq.toUpperCase()}
                  </Chip>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button mode="outlined" onPress={onClose} style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!name.trim()}
              style={styles.modalButton}
            >
              {habit ? 'Update' : 'Create'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 12,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    marginTop: 6,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginTop: 28,
    marginBottom: 16,
    fontWeight: '600',
  },
  habitCard: {
    backgroundColor: '#1E293B',
    marginBottom: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  habitCardInactive: {
    opacity: 0.6,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
    marginRight: 12,
  },
  habitName: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  habitDescription: {
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 20,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  frequencyChip: {
    backgroundColor: '#334155',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakLabel: {
    color: '#10B981',
    fontWeight: '600',
  },
  logButton: {
    minWidth: 90,
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  habitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  toggleLabel: {
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    backgroundColor: '#334155',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  modalButton: {
    flex: 1,
  },
  heatmapOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heatmapContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    maxWidth: 600,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  heatmapTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
