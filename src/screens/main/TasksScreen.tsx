/**
 * Tasks Screen
 * Task management with list, kanban, and priority matrix views
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
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  IconButton,
  SegmentedButtons,
  Checkbox,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../services/tasks.api';

type ViewMode = 'list' | 'kanban' | 'matrix';
type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags: string[];
  project?: { id: string; name: string };
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#64748B',
  medium: '#F59E0B',
  high: '#F97316',
  urgent: '#EF4444',
};

export default function TasksScreen() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filterStatus],
    queryFn: () =>
      tasksApi.getTasks(
        filterStatus !== 'all' ? { status: filterStatus } : undefined
      ),
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    setRefreshing(false);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({
      id: taskId,
      data: {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      },
    });
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(taskId),
      },
    ]);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowCreateModal(true);
  };

  const renderListView = () => (
    <View style={styles.listView}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </View>
  );

  const renderKanbanView = () => {
    const columns: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'completed'];
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.kanbanView}>
          {columns.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);
            return (
              <View key={status} style={styles.kanbanColumn}>
                <View style={styles.kanbanHeader}>
                  <Text variant="titleSmall" style={styles.kanbanHeaderText}>
                    {STATUS_LABELS[status]}
                  </Text>
                  <Text variant="bodySmall" style={styles.kanbanCount}>
                    {columnTasks.length}
                  </Text>
                </View>
                <ScrollView style={styles.kanbanContent}>
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      compact
                    />
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderPriorityMatrix = () => {
    const matrix = {
      urgent_important: tasks.filter(
        (t) => t.priority === 'urgent' && t.status !== 'completed'
      ),
      high_important: tasks.filter(
        (t) => t.priority === 'high' && t.status !== 'completed'
      ),
      medium: tasks.filter(
        (t) => t.priority === 'medium' && t.status !== 'completed'
      ),
      low: tasks.filter(
        (t) => t.priority === 'low' && t.status !== 'completed'
      ),
    };

    return (
      <View style={styles.matrixView}>
        <View style={styles.matrixRow}>
          <View style={[styles.matrixQuadrant, { backgroundColor: '#FEE2E2' }]}>
            <Text variant="titleSmall" style={styles.matrixTitle}>
              Urgent & Important
            </Text>
            {matrix.urgent_important.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact
              />
            ))}
          </View>
          <View style={[styles.matrixQuadrant, { backgroundColor: '#FEF3C7' }]}>
            <Text variant="titleSmall" style={styles.matrixTitle}>
              High Priority
            </Text>
            {matrix.high_important.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact
              />
            ))}
          </View>
        </View>
        <View style={styles.matrixRow}>
          <View style={[styles.matrixQuadrant, { backgroundColor: '#E0E7FF' }]}>
            <Text variant="titleSmall" style={styles.matrixTitle}>
              Medium Priority
            </Text>
            {matrix.medium.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact
              />
            ))}
          </View>
          <View style={[styles.matrixQuadrant, { backgroundColor: '#F1F5F9' }]}>
            <Text variant="titleSmall" style={styles.matrixTitle}>
              Low Priority
            </Text>
            {matrix.low.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading && tasks.length === 0) {
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
        <Text variant="headlineMedium" style={styles.title}>
          Tasks
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            setSelectedTask(null);
            setShowCreateModal(true);
          }}
          style={styles.createButton}
        >
          New Task
        </Button>
      </View>

      {/* View Mode Selector */}
      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        buttons={[
          { value: 'list', label: 'List' },
          { value: 'kanban', label: 'Board' },
          { value: 'matrix', label: 'Matrix' },
        ]}
        style={styles.viewSelector}
      />

      {/* Filter */}
      {viewMode === 'list' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
              <Chip
                key={status}
                selected={filterStatus === status}
                onPress={() => setFilterStatus(status)}
                style={styles.filterChip}
              >
                {status === 'all' ? 'All' : STATUS_LABELS[status]}
              </Chip>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No tasks found
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Create your first task to get started
            </Text>
          </View>
        ) : (
          <>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'kanban' && renderKanbanView()}
            {viewMode === 'matrix' && renderPriorityMatrix()}
          </>
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <TaskFormModal
        visible={showCreateModal}
        task={selectedTask}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedTask(null);
        }}
      />
    </View>
  );
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  compact = false,
}) => {
  return (
    <Card style={[styles.taskCard, compact && styles.taskCardCompact]}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <Checkbox
            status={task.status === 'completed' ? 'checked' : 'unchecked'}
            onPress={() =>
              onStatusChange(
                task.id,
                task.status === 'completed' ? 'todo' : 'completed'
              )
            }
          />
          <View style={styles.taskInfo}>
            <Text
              variant="titleSmall"
              style={[
                styles.taskTitle,
                task.status === 'completed' && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </Text>
            {task.description && !compact && (
              <Text variant="bodySmall" style={styles.taskDescription}>
                {task.description}
              </Text>
            )}
          </View>
        </View>

        {!compact && (
          <>
            {task.priority && (
              <View style={styles.taskMeta}>
                <Chip
                  style={[
                    styles.priorityChip,
                    { backgroundColor: PRIORITY_COLORS[task.priority] },
                  ]}
                  textStyle={{ color: '#FFFFFF' }}
                >
                  {task.priority.toUpperCase()}
                </Chip>
              </View>
            )}

            {task.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {task.tags.map((tag) => (
                  <Chip key={tag} compact style={styles.tagChip}>
                    #{tag}
                  </Chip>
                ))}
              </View>
            )}

            <View style={styles.taskActions}>
              <Button mode="text" onPress={() => onEdit(task)} compact>
                Edit
              </Button>
              <Button
                mode="text"
                onPress={() => onDelete(task.id)}
                textColor="#EF4444"
                compact
              >
                Delete
              </Button>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

interface TaskFormModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  task,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');

  const createMutation = useMutation({
    mutationFn: (data: any) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const data = {
      title,
      description: description || undefined,
      priority,
      status: task?.status || 'todo',
    };

    if (task) {
      updateMutation.mutate({ id: task.id, data });
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
              {task ? 'Edit Task' : 'New Task'}
            </Text>
            <IconButton icon="close" onPress={onClose} />
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text variant="labelMedium" style={styles.label}>
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Task title..."
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
                placeholder="Task description..."
                placeholderTextColor="#64748B"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="labelMedium" style={styles.label}>
                Priority
              </Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                  <Chip
                    key={p}
                    selected={priority === p}
                    onPress={() => setPriority(p)}
                    style={styles.priorityOption}
                  >
                    {p.toUpperCase()}
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
              disabled={!title.trim()}
              style={styles.modalButton}
            >
              {task ? 'Update' : 'Create'}
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
    padding: 16,
    paddingTop: 8,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  viewSelector: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    backgroundColor: '#1E293B',
  },
  content: {
    flex: 1,
  },
  listView: {
    padding: 16,
    gap: 12,
  },
  kanbanView: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  kanbanColumn: {
    width: 280,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  kanbanHeader: {
    padding: 12,
    backgroundColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kanbanHeaderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  kanbanCount: {
    color: '#94A3B8',
  },
  kanbanContent: {
    padding: 8,
  },
  matrixView: {
    padding: 16,
    gap: 12,
  },
  matrixRow: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 300,
  },
  matrixQuadrant: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  matrixTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskCard: {
    backgroundColor: '#1E293B',
    marginBottom: 12,
  },
  taskCardCompact: {
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 8,
  },
  taskTitle: {
    color: '#FFFFFF',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  taskDescription: {
    color: '#94A3B8',
    marginTop: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  tagChip: {
    backgroundColor: '#334155',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748B',
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
    minHeight: 100,
  },
  priorityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
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
});
