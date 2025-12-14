/**
 * PercentageChange Component
 * Badge displaying percentage change with color coding
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatPercentageChange, getTrendDirection } from '../../utils/chartUtils';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface PercentageChangeProps {
  value: number;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'inline';
}

export const PercentageChange: React.FC<PercentageChangeProps> = ({
  value,
  label = 'this week',
  showIcon = true,
  size = 'sm',
  variant = 'badge',
}) => {
  const trend = getTrendDirection(value);
  const formattedValue = formatPercentageChange(value);

  const trendColor = getTrendColor(trend);
  const trendIcon = getTrendIcon(trend);

  if (variant === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        {showIcon && (
          <MaterialCommunityIcons
            name={trendIcon}
            size={getSizeValue(size) + 4}
            color={trendColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.inlineText, getSizeStyle(size), { color: trendColor }]}>
          {formattedValue}
        </Text>
        {label && (
          <Text style={[styles.label, getSizeLabelStyle(size)]}>
            {label}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getTrendBackgroundColor(trend) },
      ]}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={trendIcon}
          size={getSizeValue(size)}
          color={trendColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.badgeText, getSizeStyle(size), { color: trendColor }]}>
        {formattedValue}
      </Text>
    </View>
  );
};

/**
 * Get color based on trend direction
 */
function getTrendColor(trend: 'positive' | 'negative' | 'neutral'): string {
  switch (trend) {
    case 'positive':
      return colors.success;
    case 'negative':
      return colors.error;
    case 'neutral':
      return colors.text.tertiary;
  }
}

/**
 * Get background color based on trend direction
 */
function getTrendBackgroundColor(trend: 'positive' | 'negative' | 'neutral'): string {
  switch (trend) {
    case 'positive':
      return `${colors.success}20`;
    case 'negative':
      return `${colors.error}20`;
    case 'neutral':
      return `${colors.text.tertiary}20`;
  }
}

/**
 * Get icon name based on trend direction
 */
function getTrendIcon(trend: 'positive' | 'negative' | 'neutral'): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (trend) {
    case 'positive':
      return 'trending-up';
    case 'negative':
      return 'trending-down';
    case 'neutral':
      return 'trending-neutral';
  }
}

/**
 * Get font size value based on size prop
 */
function getSizeValue(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm':
      return 12;
    case 'md':
      return 14;
    case 'lg':
      return 16;
  }
}

/**
 * Get text style based on size prop
 */
function getSizeStyle(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return { fontSize: typography.size.xs };
    case 'md':
      return { fontSize: typography.size.sm };
    case 'lg':
      return { fontSize: typography.size.base };
  }
}

/**
 * Get label text style based on size prop
 */
function getSizeLabelStyle(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return { fontSize: typography.size.xs };
    case 'md':
      return { fontSize: typography.size.sm };
    case 'lg':
      return { fontSize: typography.size.base };
  }
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.tight,
  },
  icon: {
    marginRight: spacing.xs / 2,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineText: {
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.tight,
  },
  label: {
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
});

export default PercentageChange;
