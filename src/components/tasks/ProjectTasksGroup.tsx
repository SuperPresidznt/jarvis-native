/**
 * ProjectTasksGroup Component
 * Displays tasks grouped by project with collapsible sections
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  RefreshControl,
} from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { typography, spacing, borderRadius, shadows } from '../../theme';
import { EmptyState } from '../ui';
import { haptic } from '../../utils/haptics';

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
  dueDate?: string;
  projectId?: string;
  project?: { id: string; name: string; color?: string };
}

interface Project {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

interface ProjectSection {
  project: Project | null; // null = ungrouped tasks
  data: Task[];
  stats: {
    total: number;
    completed: number;
    overdue: number;
  };
}

interface ProjectTasksGroupProps {
  tasks: Task[];
  projects: Project[];
  onTaskPress: (task: Task) => void;
  onTaskComplete: (taskId: string) => void;
  onCreateTask: (projectId?: string) => void;
  onProjectPress?: (project: Project) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  renderTaskItem: (task: Task) => React.ReactNode;
}

export function ProjectTasksGroup({
  tasks,
  projects,
  onTaskPress,
  onTaskComplete,
  onCreateTask,
  onProjectPress,
  refreshing = false,
  onRefresh,
  renderTaskItem,
}: ProjectTasksGroupProps) {
  const { colors } = useTheme();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Group tasks by project
  const sections = useMemo((): ProjectSection[] => {
    const projectMap = new Map<string, Task[]>();
    const ungroupedTasks: Task[] = [];

    // Group tasks
    tasks.forEach((task) => {
      if (task.projectId) {
        const existing = projectMap.get(task.projectId) || [];
        existing.push(task);
        projectMap.set(task.projectId, existing);
      } else {
        ungroupedTasks.push(task);
      }
    });

    // Create sections for projects with tasks
    const projectSections: ProjectSection[] = [];

    projects.forEach((project) => {
      const projectTasks = projectMap.get(project.id) || [];
      if (projectTasks.length > 0) {
        const completed = projectTasks.filter((t) => t.status === 'completed').length;
        const overdue = projectTasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length;

        projectSections.push({
          project,
          data: projectTasks,
          stats: {
            total: projectTasks.length,
            completed,
            overdue,
          },
        });
      }
    });

    // Sort by project name
    projectSections.sort((a, b) => (a.project?.name || '').localeCompare(b.project?.name || ''));

    // Add ungrouped section if there are ungrouped tasks
    if (ungroupedTasks.length > 0) {
      const completed = ungroupedTasks.filter((t) => t.status === 'completed').length;
      const overdue = ungroupedTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length;

      projectSections.push({
        project: null,
        data: ungroupedTasks,
        stats: {
          total: ungroupedTasks.length,
          completed,
          overdue,
        },
      });
    }

    return projectSections;
  }, [tasks, projects]);

  const toggleSection = useCallback((sectionId: string) => {
    haptic.selection();
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const getSectionId = (section: ProjectSection) =>
    section.project?.id || 'ungrouped';

  const renderSectionHeader = ({ section }: { section: ProjectSection }) => {
    const sectionId = getSectionId(section);
    const isCollapsed = collapsedSections.has(sectionId);
    const projectColor = section.project?.color || colors.text.tertiary;

    return (
      <TouchableOpacity
        style={[
          styles.sectionHeader,
          { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle },
        ]}
        onPress={() => toggleSection(sectionId)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionLeft}>
          {/* Color indicator */}
          <View
            style={[
              styles.colorDot,
              { backgroundColor: section.project ? projectColor : colors.text.tertiary },
            ]}
          />

          {/* Project name */}
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {section.project?.name || 'No Project'}
          </Text>

          {/* Task count badge */}
          <Badge
            size={20}
            style={[
              styles.countBadge,
              { backgroundColor: colors.background.tertiary },
            ]}
          >
            {section.stats.total}
          </Badge>

          {/* Overdue indicator */}
          {section.stats.overdue > 0 && (
            <View
              style={[
                styles.overdueBadge,
                { backgroundColor: colors.error + '20' },
              ]}
            >
              <Text style={[styles.overdueText, { color: colors.error }]}>
                {section.stats.overdue} overdue
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionRight}>
          {/* Progress indicator */}
          {section.stats.total > 0 && (
            <Text style={[styles.progressText, { color: colors.text.secondary }]}>
              {section.stats.completed}/{section.stats.total}
            </Text>
          )}

          {/* Add task to project */}
          <IconButton
            icon="plus"
            iconColor={colors.primary.main}
            size={18}
            onPress={() => {
              haptic.buttonPress();
              onCreateTask(section.project?.id);
            }}
            style={styles.addButton}
          />

          {/* Collapse/Expand arrow */}
          <IconButton
            icon={isCollapsed ? 'chevron-down' : 'chevron-up'}
            iconColor={colors.text.tertiary}
            size={20}
            style={styles.collapseButton}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, section }: { item: Task; section: ProjectSection }) => {
    const sectionId = getSectionId(section);
    const isCollapsed = collapsedSections.has(sectionId);

    if (isCollapsed) {
      return null;
    }

    return <View style={styles.taskItem}>{renderTaskItem(item)}</View>;
  };

  if (sections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="📁"
          title="No tasks in projects"
          description="Create a project and add tasks to organize your work"
          actionLabel="Create Task"
          onAction={() => onCreateTask()}
        />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginRight: spacing.sm,
    flexShrink: 1,
  },
  countBadge: {
    marginLeft: spacing.xs,
  },
  overdueBadge: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  overdueText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.size.sm,
    marginRight: spacing.xs,
  },
  addButton: {
    margin: 0,
  },
  collapseButton: {
    margin: 0,
  },
  taskItem: {
    marginLeft: spacing.lg,
  },
  itemSeparator: {
    height: spacing.xs,
  },
  sectionSeparator: {
    height: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
