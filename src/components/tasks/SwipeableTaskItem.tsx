/**
 * SwipeableTaskItem Component
 * Wraps TaskCard with swipe gestures for quick actions
 * - Swipe right: Complete/Uncomplete toggle
 * - Swipe left: Delete with confirmation
 */

import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Text, Alert } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius, typography } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { haptic } from '../../utils/haptics';

interface SwipeableTaskItemProps {
  children: React.ReactNode;
  taskId: string;
  taskTitle: string;
  isCompleted: boolean;
  onComplete: () => void;
  onUncomplete: () => void;
  onDelete: () => void;
  disabled?: boolean; // Disable swipe in bulk select mode
}

export const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({
  children,
  taskId,
  taskTitle,
  isCompleted,
  onComplete,
  onUncomplete,
  onDelete,
  disabled = false,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const { colors } = useTheme();

  // Right swipe action: Complete/Uncomplete
  const handleRightSwipe = () => {
    haptic.swipeAction();
    swipeableRef.current?.close();

    if (isCompleted) {
      onUncomplete();
    } else {
      onComplete();
    }
  };

  // Left swipe action: Delete with confirmation
  const handleLeftSwipe = () => {
    haptic.swipeAction();
    swipeableRef.current?.close();

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            haptic.taskDelete();
            onDelete();
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render right swipe action (complete/uncomplete)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const translateX = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [80, 0],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={[styles.rightAction, { backgroundColor: colors.success }]}
        onPress={handleRightSwipe}
      >
        <Animated.View
          style={[
            styles.actionContent,
            {
              transform: [{ scale }, { translateX }],
            },
          ]}
        >
          <Icon
            name={isCompleted ? 'checkbox-blank-circle-outline' : 'check-circle'}
            size={28}
            color={colors.background.primary}
          />
          <Text style={[styles.actionText, { color: colors.background.primary }]}>
            {isCompleted ? 'Undo' : 'Complete'}
          </Text>
        </Animated.View>
      </RectButton>
    );
  };

  // Render left swipe action (delete)
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const translateX = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, -80],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={[styles.leftAction, { backgroundColor: colors.error }]}
        onPress={handleLeftSwipe}
      >
        <Animated.View
          style={[
            styles.actionContent,
            {
              transform: [{ scale }, { translateX }],
            },
          ]}
        >
          <Icon name="delete" size={28} color={colors.background.primary} />
          <Text style={[styles.actionText, { color: colors.background.primary }]}>
            Delete
          </Text>
        </Animated.View>
      </RectButton>
    );
  };

  // If disabled (bulk select mode), render children without swipe
  if (disabled) {
    return <View>{children}</View>;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: spacing.lg,
    flex: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: spacing.lg,
    flex: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  actionText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
