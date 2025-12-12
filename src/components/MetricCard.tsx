/**
 * MetricCard Component
 * Displays a single metric with label, value, and optional helper text
 * Professional, polished design with proper theming
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

type MetricVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  variant?: MetricVariant;
  style?: ViewStyle;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  helper,
  variant = 'default',
  style,
  compact = false,
}) => {
  const getAccentColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.text.primary;
    }
  };

  const getAccentBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return `${colors.success}15`;
      case 'warning':
        return `${colors.warning}15`;
      case 'danger':
        return `${colors.error}15`;
      case 'info':
        return `${colors.info}15`;
      default:
        return 'transparent';
    }
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact, style]}>
      {/* Accent bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: getAccentColor() },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>

        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.value,
              compact && styles.valueCompact,
              { color: getAccentColor() },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value}
          </Text>

          {variant !== 'default' && (
            <View
              style={[
                styles.badge,
                { backgroundColor: getAccentBackgroundColor() },
              ]}
            >
              <View
                style={[
                  styles.badgeDot,
                  { backgroundColor: getAccentColor() },
                ]}
              />
            </View>
          )}
        </View>

        {helper && (
          <Text style={styles.helper} numberOfLines={2}>
            {helper}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.sm,
  },
  cardCompact: {
    borderRadius: borderRadius.md,
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.sm,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  valueCompact: {
    fontSize: typography.size.xl,
  },
  badge: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  helper: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
});

export default MetricCard;
