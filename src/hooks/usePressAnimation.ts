/**
 * usePressAnimation Hook
 * Provides scale animation for button press feedback
 */

import { useRef } from 'react';
import { Animated } from 'react-native';

export function usePressAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return {
    scale,
    onPressIn,
    onPressOut,
  };
}
