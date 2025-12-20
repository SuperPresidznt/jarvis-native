/**
 * AnimatedListItem Component
 * Wrapper component that adds fade-in animation to list items
 */

import React, { ReactNode } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useListItemAnimation } from '../../hooks/useListItemAnimation';

interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  delay,
  duration,
  style,
}) => {
  const animationStyle = useListItemAnimation({ index, delay, duration });

  return (
    <Animated.View style={[style, animationStyle]}>
      {children}
    </Animated.View>
  );
};
