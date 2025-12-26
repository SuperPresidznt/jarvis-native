/**
 * Onboarding Flow
 * Orchestrates the complete onboarding experience
 * Updated to use new unified OnboardingScreen
 */

import React from 'react';
import OnboardingScreen from './OnboardingScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  return <OnboardingScreen onComplete={onComplete} />;
}
