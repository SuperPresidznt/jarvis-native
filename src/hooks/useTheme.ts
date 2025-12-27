/**
 * useTheme Hook
 * Provides reactive access to theme colors based on current theme preset
 * Supports system theme detection and custom color overrides
 */

import { useEffect, useState, useMemo } from 'react';
import { Appearance } from 'react-native';
import { useThemeStore, CustomColors } from '../store/themeStore';
import { getColors } from '../theme';
import { getPresetColors } from '../theme/presets';

type ThemeColors = ReturnType<typeof getColors>;

// Apply custom colors on top of preset/default colors
const applyCustomColors = (baseColors: ThemeColors, customColors: CustomColors | null): ThemeColors => {
  if (!customColors) return baseColors;

  // Deep clone the base colors
  const colors = JSON.parse(JSON.stringify(baseColors)) as ThemeColors;

  // Override primary color if set
  if (customColors.primaryMain) {
    colors.primary.main = customColors.primaryMain;
    // Also update related colors that use primary
    colors.border.focus = customColors.primaryMain;
    colors.success = customColors.primaryMain;
    // Update gradients that use primary
    colors.gradient.primary = [customColors.primaryMain, colors.primary.dark];
    colors.gradient.primaryGlow = [customColors.primaryMain, colors.primary.light, customColors.primaryMain];
  }

  // Override accent colors if set
  if (customColors.accentCyan) {
    colors.accent.cyan = customColors.accentCyan;
  }
  if (customColors.accentPurple) {
    colors.accent.purple = customColors.accentPurple;
  }
  if (customColors.accentPink) {
    colors.accent.pink = customColors.accentPink;
  }

  return colors;
};

export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.mode);
  const presetId = useThemeStore((state) => state.presetId);
  const customColors = useThemeStore((state) => state.customColors);
  const getResolvedMode = useThemeStore((state) => state.getResolvedMode);

  const [baseColors, setBaseColors] = useState(() => {
    const resolvedMode = getResolvedMode();
    // Use preset colors if available, otherwise fall back to default mode colors
    return presetId ? getPresetColors(presetId) : getColors(resolvedMode);
  });

  // Apply custom colors on top of base colors
  const colors = useMemo(() => {
    return applyCustomColors(baseColors, customColors);
  }, [baseColors, customColors]);

  useEffect(() => {
    // Update colors when preset or mode changes
    const resolvedMode = getResolvedMode();
    setBaseColors(presetId ? getPresetColors(presetId) : getColors(resolvedMode));
  }, [themeMode, presetId, getResolvedMode]);

  // Listen for system theme changes when mode is 'system'
  useEffect(() => {
    if (themeMode !== 'system') return;

    const subscription = Appearance.addChangeListener(() => {
      const resolvedMode = getResolvedMode();
      setBaseColors(presetId ? getPresetColors(presetId) : getColors(resolvedMode));
    });

    return () => subscription.remove();
  }, [themeMode, presetId, getResolvedMode]);

  const resolvedMode = getResolvedMode();

  return {
    colors,
    mode: themeMode,
    resolvedMode,
    presetId,
    customColors,
    isDark: resolvedMode === 'dark',
    isLight: resolvedMode === 'light',
  };
};
