# React Native Reanimated Migration Guide

**Created**: 2025-12-21
**Status**: Infrastructure Ready - Incremental Migration Recommended

## Overview

This guide outlines the migration path from React Native's Animated API to react-native-reanimated v3 for improved animation performance.

## Why Migrate?

- **Better Performance**: Animations run on UI thread instead of JS thread
- **Smoother Animations**: 60fps animations even during heavy JS operations
- **Declarative API**: More intuitive animation API with hooks
- **Layout Animations**: Built-in support for layout transitions

## Current State

### Installed Dependencies

- `react-native-reanimated`: v3 (latest)
- Configuration: Ready to use (added to package.json)

### Reanimated Utilities Created

Location: `/src/utils/animations/reanimatedPatterns.ts`

Available patterns:
- `useFadeIn` - Fade in/out animations
- `useScaleAnimation` - Scale animations with bounce
- `useSlideAnimation` - Slide transitions
- `useRotateAnimation` - Rotation animations
- `useShimmerAnimation` - Skeleton loading shimmer
- `useCardPressAnimation` - Touch feedback
- `useStaggerAnimation` - List item stagger
- `useProgressAnimation` - Progress bar animations

## Migration Strategy

### Phase 1: New Components (Recommended First)

Start using Reanimated for all new animations:

```tsx
import Animated from 'react-native-reanimated';
import { useFadeIn } from '../utils/animations/reanimatedPatterns';

const NewComponent = () => {
  const { animatedStyle, fadeIn } = useFadeIn();

  useEffect(() => {
    fadeIn();
  }, []);

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};
```

### Phase 2: Critical Paths (Performance Sensitive)

Migrate animations in performance-critical areas:

1. **List animations** (TasksScreen, HabitsScreen)
2. **Gesture-based animations** (SwipeableTaskItem)
3. **Modal transitions**
4. **Chart animations**

### Phase 3: Legacy Components (Low Priority)

Gradually migrate existing Animated API usage:

Current files using Animated API:
- `/src/components/habits/CelebrationOverlay.tsx` (uses confetti library)
- `/src/components/tasks/TaskCelebration.tsx` (uses confetti library)
- `/src/components/ui/AnimatedListItem.tsx` (candidate for migration)
- Various screen components with fade/scale animations

## Configuration

### Babel Plugin (Required)

Add to `babel.config.js`:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

### TypeScript (Optional)

Add to `tsconfig.json` for better type support:

```json
{
  "compilerOptions": {
    "types": ["react-native-reanimated"]
  }
}
```

## Migration Checklist

- [x] Install react-native-reanimated
- [x] Create reusable animation patterns
- [ ] Add Babel plugin configuration
- [ ] Test patterns in one component
- [ ] Migrate AnimatedListItem component
- [ ] Migrate modal transitions
- [ ] Migrate gesture animations
- [ ] Performance benchmark vs Animated API
- [ ] Update documentation

## Example Migrations

### Before (Animated API)

```tsx
import { Animated } from 'react-native';

const Component = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={{ opacity: fadeAnim }}>Content</Animated.View>;
};
```

### After (Reanimated)

```tsx
import Animated from 'react-native-reanimated';
import { useFadeIn } from '../utils/animations/reanimatedPatterns';

const Component = () => {
  const { animatedStyle, fadeIn } = useFadeIn();

  useEffect(() => {
    fadeIn();
  }, []);

  return <Animated.View style={animatedStyle}>Content</Animated.View>;
};
```

## Performance Benefits

Expected improvements:
- **60fps animations** even during JS thread blocking
- **Reduced jank** in list scrolling with animations
- **Lower battery consumption** due to UI thread execution
- **Smoother gestures** with gesture handler integration

## Common Patterns

### 1. Entrance Animations

```tsx
const { animatedStyle, fadeIn } = useFadeIn();
const { animatedStyle: slideStyle, slideIn } = useSlideAnimation('up');

const combinedStyle = useAnimatedStyle(() => ({
  ...animatedStyle,
  ...slideStyle,
}));
```

### 2. Press Feedback

```tsx
const { animatedStyle, onPressIn, onPressOut } = useCardPressAnimation();

<Animated.View
  style={animatedStyle}
  onTouchStart={onPressIn}
  onTouchEnd={onPressOut}
>
  <TouchableOpacity>Content</TouchableOpacity>
</Animated.View>
```

### 3. List Stagger

```tsx
const items = data.map((item, index) => (
  <ListItem key={item.id} index={index} />
));

const ListItem = ({ index }) => {
  const { animatedStyle, animate } = useStaggerAnimation(index);

  useEffect(() => {
    animate();
  }, []);

  return <Animated.View style={animatedStyle}>...</Animated.View>;
};
```

## Testing

After migration, test:
1. Animation smoothness (60fps)
2. Memory usage
3. Battery consumption
4. Accessibility (screen readers)
5. Performance on lower-end devices

## Resources

- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Migration Guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/migration/)
- [Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/app/src/examples)

## Notes

- Reanimated animations are **not interruptible** by default (use `cancelAnimation` if needed)
- Layout animations require `enableLayoutAnimations()` configuration
- Gesture handler integration available for complex gestures
- All patterns support dark mode through theme system

---

**Next Steps**: Add Babel plugin configuration and test one pattern in a component before full migration.
