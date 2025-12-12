/**
 * EmptyState - Beautiful empty state component
 * Features: icon/emoji, title, description, action button
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '',
  title,
  description,
  actionLabel,
  onAction,
  style,
  compact = false,
}) => {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      {icon && <Text style={[styles.icon, compact && styles.compactIcon]}>{icon}</Text>}
      <Text style={[styles.title, compact && styles.compactTitle]}>{title}</Text>
      {description && (
        <Text style={[styles.description, compact && styles.compactDescription]}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size={compact ? 'small' : 'medium'}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4xl'],
  },
  compact: {
    padding: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  compactIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  compactTitle: {
    fontSize: typography.size.lg,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  compactDescription: {
    fontSize: typography.size.sm,
    marginBottom: spacing.base,
  },
  button: {
    marginTop: spacing.sm,
  },
});

export default EmptyState;
