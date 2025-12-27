/**
 * Onboarding Store
 * Manages onboarding state using Zustand with AsyncStorage persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = '@yarvi:onboarding_complete';
const SHOWN_TOOLTIPS_KEY = '@yarvi:shown_tooltips';

interface OnboardingStore {
  isOnboardingComplete: boolean;
  shownTooltips: string[];
  isLoading: boolean;
  loadOnboardingState: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  markTooltipShown: (tooltipId: string) => Promise<void>;
  hasShownTooltip: (tooltipId: string) => boolean;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  isOnboardingComplete: false,
  shownTooltips: [],
  isLoading: true,

  loadOnboardingState: async () => {
    try {
      const [onboardingComplete, tooltipsData] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY),
        AsyncStorage.getItem(SHOWN_TOOLTIPS_KEY),
      ]);

      set({
        isOnboardingComplete: onboardingComplete === 'true',
        shownTooltips: tooltipsData ? JSON.parse(tooltipsData) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error('[OnboardingStore] Failed to load state:', error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      set({ isOnboardingComplete: true });
      console.log('[OnboardingStore] Onboarding completed');
    } catch (error) {
      console.error('[OnboardingStore] Failed to complete onboarding:', error);
      throw error;
    }
  },

  resetOnboarding: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY),
        AsyncStorage.removeItem(SHOWN_TOOLTIPS_KEY),
      ]);
      set({
        isOnboardingComplete: false,
        shownTooltips: [],
      });
      console.log('[OnboardingStore] Onboarding reset');
    } catch (error) {
      console.error('[OnboardingStore] Failed to reset onboarding:', error);
      throw error;
    }
  },

  markTooltipShown: async (tooltipId: string) => {
    try {
      const updatedTooltips = [...get().shownTooltips, tooltipId];
      await AsyncStorage.setItem(SHOWN_TOOLTIPS_KEY, JSON.stringify(updatedTooltips));
      set({ shownTooltips: updatedTooltips });
      console.log(`[OnboardingStore] Tooltip "${tooltipId}" marked as shown`);
    } catch (error) {
      console.error('[OnboardingStore] Failed to mark tooltip as shown:', error);
      throw error;
    }
  },

  hasShownTooltip: (tooltipId: string) => {
    return get().shownTooltips.includes(tooltipId);
  },
}));
