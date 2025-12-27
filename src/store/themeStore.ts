/**
 * Theme Store
 * Manages app theme with preset support, custom colors, and persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeMode = 'dark' | 'light' | 'system';
type ResolvedThemeMode = 'dark' | 'light';

export interface CustomColors {
  primaryMain: string;
  accentCyan?: string;
  accentPurple?: string;
  accentPink?: string;
}

interface ThemeStore {
  mode: ThemeMode;
  presetId: string;
  customColors: CustomColors | null;
  setMode: (mode: ThemeMode) => Promise<void>;
  setPreset: (presetId: string) => Promise<void>;
  setCustomColors: (colors: CustomColors | null) => Promise<void>;
  loadTheme: () => Promise<void>;
  getResolvedMode: () => ResolvedThemeMode;
}

const THEME_MODE_STORAGE_KEY = '@yarvi_theme_mode';
const THEME_PRESET_STORAGE_KEY = '@yarvi_theme_preset';
const CUSTOM_COLORS_STORAGE_KEY = '@yarvi_custom_colors';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system', // Default to system preference
  presetId: 'neon-dark', // Default preset
  customColors: null, // Custom color overrides

  getResolvedMode: () => {
    const state = get();
    if (state.mode === 'system') {
      const systemColorScheme = Appearance.getColorScheme();
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return state.mode;
  },

  setMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      set({ mode });
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  },

  setPreset: async (presetId: string) => {
    try {
      await AsyncStorage.setItem(THEME_PRESET_STORAGE_KEY, presetId);
      // Also extract and set the mode from the preset
      const { getPresetById } = require('../theme/presets');
      const preset = getPresetById(presetId);
      if (preset) {
        await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, preset.mode);
        set({ presetId, mode: preset.mode });
      }
    } catch (error) {
      console.error('Failed to save theme preset:', error);
    }
  },

  setCustomColors: async (colors: CustomColors | null) => {
    try {
      if (colors) {
        await AsyncStorage.setItem(CUSTOM_COLORS_STORAGE_KEY, JSON.stringify(colors));
      } else {
        await AsyncStorage.removeItem(CUSTOM_COLORS_STORAGE_KEY);
      }
      set({ customColors: colors });
    } catch (error) {
      console.error('Failed to save custom colors:', error);
    }
  },

  loadTheme: async () => {
    try {
      const [savedMode, savedPreset, savedCustomColors] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_STORAGE_KEY),
        AsyncStorage.getItem(THEME_PRESET_STORAGE_KEY),
        AsyncStorage.getItem(CUSTOM_COLORS_STORAGE_KEY),
      ]);

      const updates: Partial<ThemeStore> = {};

      if (savedMode === 'dark' || savedMode === 'light' || savedMode === 'system') {
        updates.mode = savedMode;
      }

      if (savedPreset) {
        updates.presetId = savedPreset;
      }

      if (savedCustomColors) {
        try {
          updates.customColors = JSON.parse(savedCustomColors) as CustomColors;
        } catch {
          // Invalid JSON, ignore
        }
      }

      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
