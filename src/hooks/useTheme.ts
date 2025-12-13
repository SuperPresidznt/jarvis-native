/**
 * useTheme Hook
 * Provides reactive access to theme colors based on current theme mode
 */

import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { getColors } from '../theme';

export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.mode);
  const [colors, setColors] = useState(() => getColors(themeMode));

  useEffect(() => {
    setColors(getColors(themeMode));
  }, [themeMode]);

  return {
    colors,
    mode: themeMode,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};
