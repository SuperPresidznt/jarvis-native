/**
 * Onboarding Flow
 * Orchestrates the complete onboarding experience
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import FeatureTour from './FeatureTour';
import SampleDataPrompt from './SampleDataPrompt';
import { useOnboarding } from '../../hooks/useOnboarding';
import { generateSampleData } from '../../services/sampleData';

type OnboardingStep = 'welcome' | 'tour' | 'sample-data' | 'complete';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const { completeOnboarding } = useOnboarding();

  const handleWelcomeGetStarted = () => {
    setCurrentStep('tour');
  };

  const handleWelcomeSkip = () => {
    setCurrentStep('sample-data');
  };

  const handleTourComplete = () => {
    setCurrentStep('sample-data');
  };

  const handleTourSkip = () => {
    setCurrentStep('sample-data');
  };

  const handleSampleDataAccept = async () => {
    try {
      await generateSampleData();
      await finishOnboarding();
    } catch (error) {
      console.error('[OnboardingFlow] Failed to generate sample data:', error);
      // Still complete onboarding even if sample data fails
      await finishOnboarding();
    }
  };

  const handleSampleDataDecline = async () => {
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    try {
      await completeOnboarding();
      setCurrentStep('complete');
      onComplete();
    } catch (error) {
      console.error('[OnboardingFlow] Failed to complete onboarding:', error);
      // Still navigate to main app
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 'welcome' && (
        <WelcomeScreen
          onGetStarted={handleWelcomeGetStarted}
          onSkip={handleWelcomeSkip}
        />
      )}

      {currentStep === 'tour' && (
        <FeatureTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}

      {currentStep === 'sample-data' && (
        <SampleDataPrompt
          visible={true}
          onAccept={handleSampleDataAccept}
          onDecline={handleSampleDataDecline}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
