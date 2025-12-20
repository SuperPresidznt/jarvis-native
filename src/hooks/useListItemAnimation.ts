/**
 * useListItemAnimation Hook
 * Provides fade-in and slide-up animation for list items
 */

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface ListItemAnimationOptions {
  index: number;
  delay?: number;
  duration?: number;
}

export function useListItemAnimation(options: ListItemAnimationOptions) {
  const { index, delay = 50, duration = 300 } = options;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: index * delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay: index * delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [index, delay, duration, opacity, translateY]);

  return {
    opacity,
    transform: [{ translateY }],
  };
}
