/**
 * Goals Screen
 * Display and manage goals with progress tracking and milestones
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as goalsDB from '../../database/goals';
import type { GoalWithMilestones, GoalStatus } from '../../database/goals';
import { AppButton, AppChip, EmptyState } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
  getColors,
} from '../../theme';
import { haptic as hapticUtils } from '../../utils/haptics';
import { confirmations, alertSuccess, alertError } from '../../utils/dialogs';
import { HIT_SLOP } from '../../constants/ui';

// ============================================================================
// Main Screen Component
// ============================================================================

export default function GoalsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [goals, setGoals] = useState<GoalWithMilestones[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalWithMilestones | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');

  // Load goals from database
  const loadGoals = useCallback(async () => {
    try {
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const data = await goalsDB.getAllGoalsWithMilestones(status);
      setGoals(data);
    } catch (error) {
      console.error('[GoalsScreen] Error loading goals:', error);
      alertError('Error', 'Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Pull-to-refresh
  const { refreshing, handleRefresh } = useRefreshControl({
    screenName: 'goals',
    onRefresh: loadGoals,
  });

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setShowFormModal(true);
  };

  const handleEditGoal = (goal: GoalWithMilestones) => {
    setEditingGoal(goal);
    setShowFormModal(true);
  };

  const handleDeleteGoal = (goalId: string, goalName: string) => {
    confirmations.deleteItem(goalName, 'goal', async () => {
      try {
        await goalsDB.deleteGoal(goalId);
        hapticUtils.success();
        await loadGoals();
        alertSuccess('Deleted', `"${goalName}" has been deleted`);
      } catch (error) {
        console.error('[GoalsScreen] Error deleting goal:', error);
        alertError('Error', 'Failed to delete goal');
      }
    });
  };

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      await goalsDB.toggleMilestone(milestoneId);
      hapticUtils.light();
      await loadGoals();
    } catch (error) {
      console.error('[GoalsScreen] Error toggling milestone:', error);
      alertError('Error', 'Failed to update milestone');
    }
  };

  const handleToggleExpand = (goalId: string) => {
    setExpandedGoalId((prev) => (prev === goalId ? null : goalId));
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingGoal(null);
  };

  const handleFormSuccess = async () => {
    await loadGoals();
    handleFormClose();
  };

  // Filter counts
  const activeCount = goals.filter((g) => g.status === 'active').length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={HIT_SLOP}
          >
            <IconButton
              icon="arrow-left"
              iconColor={colors.text.primary}
              size={24}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Goals</Text>
        </View>
        <AppButton
          title="New Goal"
          onPress={handleCreateGoal}
          size="small"
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <AppChip
            label={`All (${goals.length})`}
            selected={filterStatus === 'all'}
            onPress={() => setFilterStatus('all')}
          />
          <AppChip
            label={`Active (${activeCount})`}
            selected={filterStatus === 'active'}
            onPress={() => setFilterStatus('active')}
          />
          <AppChip
            label={`Completed (${completedCount})`}
            selected={filterStatus === 'completed'}
            onPress={() => setFilterStatus('completed')}
          />
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
            progressBackgroundColor={colors.background.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading goals...</Text>
          </View>
        ) : goals.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            title="No goals yet"
            description="Set meaningful goals and track your progress with milestones"
            actionLabel="Create Goal"
            onAction={handleCreateGoal}
          />
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isExpanded={expandedGoalId === goal.id}
              onToggleExpand={() => handleToggleExpand(goal.id)}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id, goal.name)}
              onToggleMilestone={handleToggleMilestone}
              onRefresh={loadGoals}
            />
          ))
        )}
      </ScrollView>

      {/* Form Modal */}
      <GoalFormModal
        visible={showFormModal}
        goal={editingGoal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </View>
  );
}

// ============================================================================
// Goal Card Component
// ============================================================================

interface GoalCardProps {
  goal: GoalWithMilestones;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleMilestone: (milestoneId: string) => void;
  onRefresh: () => Promise<void>;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleMilestone,
  onRefresh,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [scaleValue] = useState(new Animated.Value(1));
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handleAddMilestone = async () => {
    if (!newMilestoneTitle.trim()) return;

    try {
      await goalsDB.createMilestone({
        goalId: goal.id,
        title: newMilestoneTitle.trim(),
      });
      setNewMilestoneTitle('');
      setShowAddMilestone(false);
      hapticUtils.success();
      await onRefresh();
    } catch (error) {
      console.error('[GoalCard] Error adding milestone:', error);
      alertError('Error', 'Failed to add milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId: string, title: string) => {
    confirmations.deleteItem(title, 'milestone', async () => {
      try {
        await goalsDB.deleteMilestone(milestoneId);
        hapticUtils.light();
        await onRefresh();
      } catch (error) {
        console.error('[GoalCard] Error deleting milestone:', error);
        alertError('Error', 'Failed to delete milestone');
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = () => {
    if (goal.progress >= 100) return colors.success;
    if (goal.progress >= 75) return colors.primary.main;
    if (goal.progress >= 50) return colors.warning;
    return colors.text.tertiary;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={onToggleExpand}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.goalCard,
          goal.status === 'completed' && styles.goalCardCompleted,
        ]}
      >
        {/* Goal Header */}
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            {goal.description && (
              <Text style={styles.goalDescription} numberOfLines={2}>
                {goal.description}
              </Text>
            )}
            <View style={styles.goalMeta}>
              {goal.targetDate && (
                <View style={styles.targetDateBadge}>
                  <IconButton
                    icon="calendar"
                    iconColor={colors.text.tertiary}
                    size={14}
                    style={styles.metaIcon}
                  />
                  <Text style={styles.targetDateText}>
                    {formatDate(goal.targetDate)}
                  </Text>
                </View>
              )}
              <AppChip
                label={goal.status}
                compact
                selected={goal.status === 'completed'}
              />
            </View>
          </View>

          {/* Progress Circle */}
          <View style={styles.progressCircle}>
            <View
              style={[
                styles.progressCircleInner,
                { borderColor: getProgressColor() },
              ]}
            >
              <Text style={[styles.progressText, { color: getProgressColor() }]}>
                {goal.progress}%
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${goal.progress}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {goal.completedCount} of {goal.totalCount} milestones
          </Text>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Milestones */}
            <View style={styles.milestonesSection}>
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneTitle}>Milestones</Text>
                <TouchableOpacity
                  onPress={() => setShowAddMilestone(true)}
                  hitSlop={HIT_SLOP}
                >
                  <IconButton
                    icon="plus"
                    iconColor={colors.primary.main}
                    size={20}
                    style={styles.addMilestoneButton}
                  />
                </TouchableOpacity>
              </View>

              {goal.milestones.length === 0 ? (
                <Text style={styles.noMilestonesText}>
                  No milestones yet. Add some to track progress!
                </Text>
              ) : (
                goal.milestones.map((milestone) => (
                  <View key={milestone.id} style={styles.milestoneItem}>
                    <TouchableOpacity
                      onPress={() => onToggleMilestone(milestone.id)}
                      style={styles.milestoneCheckbox}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          milestone.completed && styles.checkboxCompleted,
                        ]}
                      >
                        {milestone.completed && (
                          <Text style={styles.checkmark}>&#10003;</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.milestoneText,
                        milestone.completed && styles.milestoneTextCompleted,
                      ]}
                    >
                      {milestone.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleDeleteMilestone(milestone.id, milestone.title)
                      }
                      hitSlop={HIT_SLOP}
                    >
                      <IconButton
                        icon="close"
                        iconColor={colors.text.tertiary}
                        size={16}
                        style={styles.deleteMilestoneButton}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}

              {/* Add Milestone Input */}
              {showAddMilestone && (
                <View style={styles.addMilestoneInput}>
                  <TextInput
                    value={newMilestoneTitle}
                    onChangeText={setNewMilestoneTitle}
                    placeholder="Enter milestone..."
                    placeholderTextColor={colors.text.placeholder}
                    style={styles.milestoneInput}
                    autoFocus
                    onSubmitEditing={handleAddMilestone}
                  />
                  <TouchableOpacity
                    onPress={handleAddMilestone}
                    disabled={!newMilestoneTitle.trim()}
                  >
                    <IconButton
                      icon="check"
                      iconColor={
                        newMilestoneTitle.trim()
                          ? colors.primary.main
                          : colors.text.disabled
                      }
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddMilestone(false);
                      setNewMilestoneTitle('');
                    }}
                  >
                    <IconButton
                      icon="close"
                      iconColor={colors.text.tertiary}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDelete}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

// ============================================================================
// Goal Form Modal
// ============================================================================

interface GoalFormModalProps {
  visible: boolean;
  goal: GoalWithMilestones | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GoalFormModal: React.FC<GoalFormModalProps> = ({
  visible,
  goal,
  onClose,
  onSuccess,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(goal?.name || '');
      setDescription(goal?.description || '');
      setTargetDate(goal?.targetDate || '');
    }
  }, [visible, goal]);

  const handleSubmit = async () => {
    if (isSubmitting || !name.trim()) return;

    setIsSubmitting(true);
    try {
      if (goal) {
        // Update existing goal
        await goalsDB.updateGoal(goal.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          targetDate: targetDate || undefined,
        });
      } else {
        // Create new goal
        await goalsDB.createGoal({
          name: name.trim(),
          description: description.trim() || undefined,
          targetDate: targetDate || undefined,
        });
      }

      hapticUtils.success();
      onSuccess();
    } catch (error) {
      console.error('[GoalFormModal] Error saving goal:', error);
      alertError('Error', 'Failed to save goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { paddingBottom: Math.max(insets.bottom, spacing.base) },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {goal ? 'Edit Goal' : 'New Goal'}
            </Text>
            <IconButton
              icon="close"
              onPress={onClose}
              iconColor={colors.text.tertiary}
              hitSlop={HIT_SLOP}
            />
          </View>

          <ScrollView
            style={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>Goal Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="What do you want to achieve?"
                placeholderTextColor={colors.text.placeholder}
                style={[styles.input, nameFocused && styles.inputFocused]}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Why is this goal important?"
                placeholderTextColor={colors.text.placeholder}
                style={[
                  styles.input,
                  styles.textArea,
                  descFocused && styles.inputFocused,
                ]}
                multiline
                numberOfLines={3}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Target Date (optional)</Text>
              <TextInput
                value={targetDate}
                onChangeText={setTargetDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.text.placeholder}
                style={[styles.input, dateFocused && styles.inputFocused]}
                onFocus={() => setDateFocused(true)}
                onBlur={() => setDateFocused(false)}
              />
              <Text style={styles.helperText}>
                Format: 2025-12-31
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <AppButton
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.modalButton}
            />
            <AppButton
              title={goal ? 'Update' : 'Create'}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!name.trim()}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// Styles
// ============================================================================

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      margin: 0,
      marginLeft: -spacing.sm,
    },
    title: {
      fontSize: typography.size['2xl'],
      fontWeight: typography.weight.bold,
      color: colors.text.primary,
    },
    filterContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    filterContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
      flexDirection: 'row',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
    },
    loadingContainer: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text.tertiary,
      fontSize: typography.size.base,
    },

    // Goal Card
    goalCard: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    goalCardCompleted: {
      opacity: 0.7,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    goalInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    goalName: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    goalDescription: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
      lineHeight: typography.size.sm * 1.5,
      marginBottom: spacing.sm,
    },
    goalMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    targetDateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaIcon: {
      margin: 0,
      padding: 0,
    },
    targetDateText: {
      fontSize: typography.size.xs,
      color: colors.text.tertiary,
    },

    // Progress Circle
    progressCircle: {
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressCircleInner: {
      width: 52,
      height: 52,
      borderRadius: 26,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.tertiary,
    },
    progressText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },

    // Progress Bar
    progressBarContainer: {
      marginTop: spacing.md,
    },
    progressBarBackground: {
      height: 8,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.tertiary,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: borderRadius.full,
    },
    progressLabel: {
      fontSize: typography.size.xs,
      color: colors.text.tertiary,
      marginTop: spacing.xs,
      textAlign: 'right',
    },

    // Expanded Content
    expandedContent: {
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border.subtle,
    },
    milestonesSection: {
      marginBottom: spacing.md,
    },
    milestoneHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    milestoneTitle: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
    },
    addMilestoneButton: {
      margin: 0,
    },
    noMilestonesText: {
      fontSize: typography.size.sm,
      color: colors.text.tertiary,
      fontStyle: 'italic',
      paddingVertical: spacing.sm,
    },
    milestoneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    milestoneCheckbox: {
      marginRight: spacing.sm,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: borderRadius.sm,
      borderWidth: 2,
      borderColor: colors.border.default,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxCompleted: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    checkmark: {
      color: colors.primary.contrast,
      fontSize: 14,
      fontWeight: typography.weight.bold,
    },
    milestoneText: {
      flex: 1,
      fontSize: typography.size.base,
      color: colors.text.primary,
    },
    milestoneTextCompleted: {
      textDecorationLine: 'line-through',
      color: colors.text.tertiary,
    },
    deleteMilestoneButton: {
      margin: 0,
    },
    addMilestoneInput: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      backgroundColor: colors.background.tertiary,
      borderRadius: borderRadius.md,
      paddingLeft: spacing.md,
    },
    milestoneInput: {
      flex: 1,
      height: 44,
      fontSize: typography.size.base,
      color: colors.text.primary,
    },

    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background.tertiary,
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      color: colors.text.secondary,
    },
    deleteButton: {
      backgroundColor: `${colors.error}20`,
    },
    deleteButtonText: {
      color: colors.error,
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background.secondary,
      borderTopLeftRadius: borderRadius['2xl'],
      borderTopRightRadius: borderRadius['2xl'],
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    modalTitle: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
    },
    modalBody: {
      padding: spacing.base,
    },
    formGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      padding: spacing.md,
      color: colors.text.primary,
      fontSize: typography.size.base,
    },
    inputFocused: {
      borderColor: colors.primary.main,
    },
    textArea: {
      textAlignVertical: 'top',
      minHeight: 80,
      lineHeight: typography.size.base * 1.5,
    },
    helperText: {
      fontSize: typography.size.xs,
      color: colors.text.tertiary,
      marginTop: spacing.xs,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.border.subtle,
    },
    modalButton: {
      flex: 1,
    },
  });
