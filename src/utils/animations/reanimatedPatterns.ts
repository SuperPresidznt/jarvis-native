/**
 * React Native Reanimated Patterns
 * Common animation patterns using react-native-reanimated v3
 *
 * This file provides reusable animation utilities and patterns for the app.
 * Reanimated provides better performance than Animated API by running on the UI thread.
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

/**
 * Common animation configurations
 */
export const ANIMATION_CONFIGS = {
  // Timing configs
  fast: { duration: 150, easing: Easing.out(Easing.cubic) },
  normal: { duration: 250, easing: Easing.out(Easing.cubic) },
  slow: { duration: 400, easing: Easing.out(Easing.cubic) },

  // Spring configs
  bouncy: { damping: 10, stiffness: 100 },
  gentle: { damping: 15, stiffness: 150 },
  snappy: { damping: 20, stiffness: 300 },
} as const;

/**
 * Fade in animation hook
 * @param duration Animation duration in ms
 * @returns Animated style object
 */
export const useFadeIn = (duration = 250) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeIn = () => {
    opacity.value = withTiming(1, { duration });
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, { duration });
  };

  return { animatedStyle, fadeIn, fadeOut };
};

/**
 * Scale animation hook
 * @param config Spring configuration
 * @returns Animated style and trigger functions
 */
export const useScaleAnimation = (config = ANIMATION_CONFIGS.gentle) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const scaleIn = () => {
    scale.value = withSpring(1, config);
  };

  const scaleOut = () => {
    scale.value = withSpring(0.95, config);
  };

  const bounce = () => {
    scale.value = withSequence(
      withSpring(1.1, config),
      withSpring(1, config)
    );
  };

  return { animatedStyle, scaleIn, scaleOut, bounce };
};

/**
 * Slide animation hook
 * @param direction Direction of slide (up, down, left, right)
 * @param distance Distance to slide in pixels
 * @returns Animated style and trigger functions
 */
export const useSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance = 50
) => {
  const translateValue = useSharedValue(direction === 'up' || direction === 'left' ? distance : -distance);

  const animatedStyle = useAnimatedStyle(() => {
    const isVertical = direction === 'up' || direction === 'down';
    return {
      transform: [
        isVertical
          ? { translateY: translateValue.value }
          : { translateX: translateValue.value },
      ],
    };
  });

  const slideIn = (config = ANIMATION_CONFIGS.normal) => {
    translateValue.value = withTiming(0, config);
  };

  const slideOut = (config = ANIMATION_CONFIGS.normal) => {
    translateValue.value = withTiming(
      direction === 'up' || direction === 'left' ? distance : -distance,
      config
    );
  };

  return { animatedStyle, slideIn, slideOut };
};

/**
 * Rotate animation hook
 * @returns Animated style and trigger functions
 */
export const useRotateAnimation = () => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const rotate = (degrees: number, config = ANIMATION_CONFIGS.normal) => {
    rotation.value = withTiming(degrees, config);
  };

  const spin = () => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
  };

  const reset = () => {
    rotation.value = withTiming(0, ANIMATION_CONFIGS.fast);
  };

  return { animatedStyle, rotate, spin, reset };
};

/**
 * Shimmer/skeleton loading animation
 * @returns Animated style for shimmer effect
 */
export const useShimmerAnimation = () => {
  const shimmerValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-300, 300],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const startShimmer = () => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  };

  return { animatedStyle, startShimmer };
};

/**
 * Card press animation (scale down on press)
 * @returns Animated style and press handlers
 */
export const useCardPressAnimation = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.98, ANIMATION_CONFIGS.fast);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, ANIMATION_CONFIGS.snappy);
  };

  return { animatedStyle, onPressIn, onPressOut };
};

/**
 * Stagger animation for list items
 * @param index Item index in list
 * @param delay Delay between items in ms
 * @returns Animated style
 */
export const useStaggerAnimation = (index: number, delay = 50) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animate = () => {
    opacity.value = withDelay(
      index * delay,
      withTiming(1, ANIMATION_CONFIGS.normal)
    );
    translateY.value = withDelay(
      index * delay,
      withSpring(0, ANIMATION_CONFIGS.gentle)
    );
  };

  return { animatedStyle, animate };
};

/**
 * Progress bar animation
 * @param progress Progress value (0-1)
 * @returns Animated style
 */
export const useProgressAnimation = (progress: number) => {
  const width = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const updateProgress = (newProgress: number) => {
    width.value = withSpring(Math.max(0, Math.min(1, newProgress)), ANIMATION_CONFIGS.gentle);
  };

  return { animatedStyle, updateProgress };
};

/**
 * Example usage patterns - can be removed in production
 */
export const USAGE_EXAMPLES = `
// Example 1: Fade in component
import Animated from 'react-native-reanimated';
import { useFadeIn } from './reanimatedPatterns';

const MyComponent = () => {
  const { animatedStyle, fadeIn } = useFadeIn();

  useEffect(() => {
    fadeIn();
  }, []);

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};

// Example 2: Card press animation
import { useCardPressAnimation } from './reanimatedPatterns';

const Card = () => {
  const { animatedStyle, onPressIn, onPressOut } = useCardPressAnimation();

  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={onPressIn}
      onTouchEnd={onPressOut}
    >
      Content
    </Animated.View>
  );
};

// Example 3: List with stagger animation
import { useStaggerAnimation } from './reanimatedPatterns';

const ListItem = ({ index }) => {
  const { animatedStyle, animate } = useStaggerAnimation(index);

  useEffect(() => {
    animate();
  }, []);

  return <Animated.View style={animatedStyle}>Item {index}</Animated.View>;
};
`;
