/**
 * Theme Store
 * Manages app theme with preset support and persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

interface ThemeStore {
  mode: ThemeMode;
  presetId: string;
  setMode: (mode: ThemeMode) => Promise<void>;
  setPreset: (presetId: string) => Promise<void>;
  loadTheme: () => Promise<void>;
}

const THEME_MODE_STORAGE_KEY = '@jarvis_theme_mode';
const THEME_PRESET_STORAGE_KEY = '@jarvis_theme_preset';

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'dark', // Default to dark
  presetId: 'neon-dark', // Default preset

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

  loadTheme: async () => {
    try {
      const [savedMode, savedPreset] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_STORAGE_KEY),
        AsyncStorage.getItem(THEME_PRESET_STORAGE_KEY),
      ]);

      const updates: Partial<ThemeStore> = {};

      if (savedMode === 'dark' || savedMode === 'light') {
        updates.mode = savedMode;
      }

      if (savedPreset) {
        updates.presetId = savedPreset;
      }

      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
