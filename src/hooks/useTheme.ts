/**
 * useTheme Hook
 * Provides reactive access to theme colors based on current theme preset
 */

import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { getColors } from '../theme';
import { getPresetColors } from '../theme/presets';

export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.mode);
  const presetId = useThemeStore((state) => state.presetId);

  const [colors, setColors] = useState(() => {
    // Use preset colors if available, otherwise fall back to default mode colors
    return presetId ? getPresetColors(presetId) : getColors(themeMode);
  });

  useEffect(() => {
    // Update colors when preset or mode changes
    setColors(presetId ? getPresetColors(presetId) : getColors(themeMode));
  }, [themeMode, presetId]);

  return {
    colors,
    mode: themeMode,
    presetId,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};
