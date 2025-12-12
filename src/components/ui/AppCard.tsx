/**
 * AppCard - Professional card component
 * Features: multiple variants, optional header, footer, press handling
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows, animation } from '../../theme';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

interface AppCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  contentStyle,
  header,
  footer,
  noPadding = false,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = useCallback(() => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: animation.pressedScale,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  }, [scaleValue, onPress]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  }, [scaleValue, onPress]);

  const getCardStyles = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.card];

    switch (variant) {
      case 'default':
        baseStyles.push(styles.defaultCard);
        break;
      case 'elevated':
        baseStyles.push(styles.elevatedCard);
        break;
      case 'outlined':
        baseStyles.push(styles.outlinedCard);
        break;
      case 'filled':
        baseStyles.push(styles.filledCard);
        break;
    }

    return baseStyles;
  };

  const cardContent = (
    <>
      {header && <View style={styles.header}>{header}</View>}
      <View style={[styles.content, noPadding && styles.noPadding, contentStyle]}>
        {children}
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={getCardStyles()}
        >
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[...getCardStyles(), style]}>
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  defaultCard: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.sm,
  },
  elevatedCard: {
    backgroundColor: colors.background.secondary,
    ...shadows.md,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  filledCard: {
    backgroundColor: colors.background.tertiary,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  content: {
    padding: spacing.base,
  },
  noPadding: {
    padding: 0,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

export default AppCard;
