/**
 * ProjectCard Component
 * Displays project information with stats and progress
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import type { Project } from '../database/projects';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
  onEdit?: () => void;
  compact?: boolean;
}

export function ProjectCard({ project, onPress, onEdit, compact = false }: ProjectCardProps) {
  const progress = project.taskStats
    ? project.taskStats.total > 0
      ? (project.taskStats.completed / project.taskStats.total) * 100
      : 0
    : 0;

  const projectColor = project.color || colors.primary.main;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Color Indicator */}
      <View style={[styles.colorIndicator, { backgroundColor: projectColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
              {project.name}
            </Text>
            {project.status === 'archived' && (
              <View style={styles.archivedBadge}>
                <Text style={styles.archivedText}>Archived</Text>
              </View>
            )}
          </View>

          {onEdit && !compact && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={onEdit}
              iconColor={colors.text.tertiary}
            />
          )}
        </View>

        {/* Description */}
        {project.description && !compact && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {/* Stats */}
        {project.taskStats && !compact && (
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{project.taskStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.completedText]}>
                {project.taskStats.completed}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.inProgressText]}>
                {project.taskStats.inProgress}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        )}

        {/* Progress Bar */}
        {project.taskStats && project.taskStats.total > 0 && !compact && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: projectColor },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {/* Compact Stats */}
        {compact && project.taskStats && (
          <Text style={styles.compactStats}>
            {project.taskStats.completed}/{project.taskStats.total} tasks • {Math.round(progress)}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardCompact: {
    marginBottom: spacing.sm,
  },
  colorIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  titleCompact: {
    fontSize: typography.size.base,
  },
  archivedBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  archivedText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  completedText: {
    color: colors.success,
  },
  inProgressText: {
    color: colors.primary.main,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    minWidth: 40,
    textAlign: 'right',
  },
  compactStats: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
});
