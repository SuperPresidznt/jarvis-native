/**
 * Onboarding Hook
 * Re-exports from the Zustand store for backwards compatibility
 * @deprecated Use useOnboardingStore from '../store/onboardingStore' directly
 */

import { useEffect } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';

export interface OnboardingState {
  isOnboardingComplete: boolean;
  shownTooltips: string[];
  isLoading: boolean;
}

export interface OnboardingActions {
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  markTooltipShown: (tooltipId: string) => Promise<void>;
  hasShownTooltip: (tooltipId: string) => boolean;
}

export function useOnboarding(): OnboardingState & OnboardingActions {
  const store = useOnboardingStore();

  // Load state on mount for backwards compatibility
  useEffect(() => {
    if (store.isLoading) {
      store.loadOnboardingState();
    }
  }, [store.isLoading]);

  return {
    isOnboardingComplete: store.isOnboardingComplete,
    shownTooltips: store.shownTooltips,
    isLoading: store.isLoading,
    completeOnboarding: store.completeOnboarding,
    resetOnboarding: store.resetOnboarding,
    markTooltipShown: store.markTooltipShown,
    hasShownTooltip: store.hasShownTooltip,
  };
}
