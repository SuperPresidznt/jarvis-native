/**
 * Onboarding Screen
 * Multi-step onboarding flow for new users
 * Steps: Welcome -> Permissions -> Sample Data -> Theme Selection -> Ready
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useThemeStore } from '../../store/themeStore';
import { useOnboarding } from '../../hooks/useOnboarding';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { generateSampleData } from '../../services/sampleData';
import { requestPermissions } from '../../services/notifications';
import { analytics } from '../../services/analytics';
import { themePresets } from '../../theme/presets';

const SCREEN_WIDTH = Dimensions.get('window').width;

type OnboardingStep = 'welcome' | 'permissions' | 'sample-data' | 'theme' | 'ready';

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface StepData {
  id: OnboardingStep;
}

const STEPS: StepData[] = [
  { id: 'welcome' },
  { id: 'permissions' },
  { id: 'sample-data' },
  { id: 'theme' },
  { id: 'ready' },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors } = useTheme();
  const { completeOnboarding } = useOnboarding();
  const { setPreset } = useThemeStore();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('neon-dark');

  const currentStep = STEPS[currentIndex].id;
  const isLastStep = currentIndex === STEPS.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const goToNextStep = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    // Skip to the last step (ready screen)
    flatListRef.current?.scrollToIndex({
      index: STEPS.length - 1,
      animated: true,
    });
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      await completeOnboarding();
      analytics.track('feature_used', { feature_name: 'onboarding_completed' });
      onComplete();
    } catch (error) {
      console.error('[OnboardingScreen] Failed to complete onboarding:', error);
      // Still complete even if there's an error
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionsRequest = async () => {
    try {
      const granted = await requestPermissions();
      setPermissionsGranted(granted);
      analytics.track('feature_used', {
        feature_name: 'notifications_permission',
        permission_granted: granted,
      });
      goToNextStep();
    } catch (error) {
      console.error('[OnboardingScreen] Failed to request permissions:', error);
      goToNextStep();
    }
  };

  const handleSampleDataAccept = async () => {
    try {
      setIsLoading(true);
      await generateSampleData();
      analytics.track('feature_used', {
        feature_name: 'sample_data',
        action: 'accepted',
      });
      goToNextStep();
    } catch (error) {
      console.error('[OnboardingScreen] Failed to generate sample data:', error);
      goToNextStep();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleDataDecline = () => {
    analytics.track('feature_used', {
      feature_name: 'sample_data',
      action: 'declined',
    });
    goToNextStep();
  };

  const handleThemeSelect = async (presetId: string) => {
    try {
      setSelectedTheme(presetId);
      await setPreset(presetId);
      analytics.track('feature_used', {
        feature_name: 'theme_selection',
        theme_id: presetId,
      });
      goToNextStep();
    } catch (error) {
      console.error('[OnboardingScreen] Failed to set theme:', error);
      goToNextStep();
    }
  };

  const renderStep = ({ item }: { item: StepData }) => {
    switch (item.id) {
      case 'welcome':
        return <WelcomeStep colors={colors} onNext={goToNextStep} onSkip={handleSkip} />;
      case 'permissions':
        return (
          <PermissionsStep
            colors={colors}
            onRequest={handlePermissionsRequest}
            onSkip={goToNextStep}
          />
        );
      case 'sample-data':
        return (
          <SampleDataStep
            colors={colors}
            onAccept={handleSampleDataAccept}
            onDecline={handleSampleDataDecline}
            isLoading={isLoading}
          />
        );
      case 'theme':
        return (
          <ThemeSelectionStep
            colors={colors}
            selectedTheme={selectedTheme}
            onSelect={handleThemeSelect}
          />
        );
      case 'ready':
        return (
          <ReadyStep
            colors={colors}
            onFinish={handleFinish}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlatList
        ref={flatListRef}
        data={STEPS}
        renderItem={renderStep}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        scrollEnabled={false}
        decelerationRate="fast"
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentIndex ? colors.primary.main : colors.border.default,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

// Step 1: Welcome
interface WelcomeStepProps {
  colors: any;
  onNext: () => void;
  onSkip: () => void;
}

function WelcomeStep({ colors, onNext, onSkip }: WelcomeStepProps) {
  return (
    <View style={[styles.step, { width: SCREEN_WIDTH }]}>
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: colors.primary.main }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: colors.primary.main,
                shadowColor: colors.primary.main,
              },
            ]}
          >
            <Text style={styles.logoText}>Y</Text>
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>Welcome to Yarvi</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Your Personal AI Productivity Assistant
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="✓"
            title="Stay Organized"
            description="Manage tasks, habits, and calendar in one place"
            colors={colors}
          />
          <FeatureItem
            icon="🎯"
            title="Track Progress"
            description="Visualize habits, finances, and productivity metrics"
            colors={colors}
          />
          <FeatureItem
            icon="⚡"
            title="Work Offline"
            description="All your data stored locally, works without internet"
            colors={colors}
          />
        </View>

        <AppButton title="Get Started" onPress={onNext} fullWidth size="large" />
      </View>
    </View>
  );
}

// Step 2: Permission Requests
interface PermissionsStepProps {
  colors: any;
  onRequest: () => void;
  onSkip: () => void;
}

function PermissionsStep({ colors, onRequest, onSkip }: PermissionsStepProps) {
  return (
    <View style={[styles.step, { width: SCREEN_WIDTH }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: colors.primary.main }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.largeIcon}>🔔</Text>
        </View>

        <Text style={[styles.title, { color: colors.text.primary }]}>
          Stay on Track with Reminders
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Enable notifications to get reminders for your habits and calendar events. You can
          always change this later in Settings.
        </Text>

        <View style={styles.permissionsList}>
          <AppCard variant="outlined" style={styles.permissionCard}>
            <View style={styles.permissionRow}>
              <Text style={styles.permissionIcon}>📅</Text>
              <View style={styles.permissionText}>
                <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
                  Calendar Events
                </Text>
                <Text style={[styles.permissionDesc, { color: colors.text.secondary }]}>
                  Get reminded before your events
                </Text>
              </View>
            </View>
          </AppCard>

          <AppCard variant="outlined" style={styles.permissionCard}>
            <View style={styles.permissionRow}>
              <Text style={styles.permissionIcon}>✅</Text>
              <View style={styles.permissionText}>
                <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>
                  Habit Reminders
                </Text>
                <Text style={[styles.permissionDesc, { color: colors.text.secondary }]}>
                  Daily reminders for your habits
                </Text>
              </View>
            </View>
          </AppCard>
        </View>

        <View style={styles.buttonGroup}>
          <AppButton title="Enable Notifications" onPress={onRequest} fullWidth size="large" />
          <AppButton
            title="Not Now"
            onPress={onSkip}
            variant="ghost"
            fullWidth
            size="medium"
          />
        </View>
      </View>
    </View>
  );
}

// Step 3: Sample Data Prompt
interface SampleDataStepProps {
  colors: any;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
}

function SampleDataStep({ colors, onAccept, onDecline, isLoading }: SampleDataStepProps) {
  return (
    <View style={[styles.step, { width: SCREEN_WIDTH }]}>
      <View style={styles.stepContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.largeIcon}>📦</Text>
        </View>

        <Text style={[styles.title, { color: colors.text.primary }]}>
          Explore with Sample Data?
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          We can add example tasks, habits, and events so you can try out features right away.
        </Text>

        <AppCard variant="filled" style={styles.includesCard}>
          <Text style={[styles.includesTitle, { color: colors.text.primary }]}>
            What's included:
          </Text>
          <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
            • 3 sample tasks with different priorities
          </Text>
          <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
            • 2 daily habits to track
          </Text>
          <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
            • 2 upcoming calendar events
          </Text>
          <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
            • 5 finance transactions
          </Text>
        </AppCard>

        <Text style={[styles.note, { color: colors.text.tertiary }]}>
          You can delete this data anytime from Settings
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
              Loading sample data...
            </Text>
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <AppButton title="Add Sample Data" onPress={onAccept} fullWidth size="large" />
            <AppButton
              title="Start Fresh"
              onPress={onDecline}
              variant="outline"
              fullWidth
              size="medium"
            />
          </View>
        )}
      </View>
    </View>
  );
}

// Step 4: Theme Selection
interface ThemeSelectionStepProps {
  colors: any;
  selectedTheme: string;
  onSelect: (themeId: string) => void;
}

function ThemeSelectionStep({ colors, selectedTheme, onSelect }: ThemeSelectionStepProps) {
  return (
    <View style={[styles.step, { width: SCREEN_WIDTH }]}>
      <View style={styles.stepContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.largeIcon}>🎨</Text>
        </View>

        <Text style={[styles.title, { color: colors.text.primary }]}>Choose Your Theme</Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Pick a color scheme that matches your style. You can change this anytime in Settings.
        </Text>

        <View style={styles.themesGrid}>
          {themePresets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.themeCard,
                {
                  backgroundColor: preset.colors.background.secondary,
                  borderColor:
                    selectedTheme === preset.id ? preset.colors.primary.main : 'transparent',
                  borderWidth: selectedTheme === preset.id ? 3 : 1,
                },
              ]}
              onPress={() => onSelect(preset.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: preset.colors.primary.main },
                ]}
              >
                <Text style={styles.themeIcon}>{preset.icon}</Text>
              </View>
              <Text style={[styles.themeName, { color: preset.colors.text.primary }]}>
                {preset.name}
              </Text>
              <Text style={[styles.themeDesc, { color: preset.colors.text.secondary }]}>
                {preset.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Step 5: Ready Screen
interface ReadyStepProps {
  colors: any;
  onFinish: () => void;
  isLoading: boolean;
}

function ReadyStep({ colors, onFinish, isLoading }: ReadyStepProps) {
  return (
    <View style={[styles.step, { width: SCREEN_WIDTH }]}>
      <View style={styles.stepContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.largeIcon}>🚀</Text>
        </View>

        <Text style={[styles.title, { color: colors.text.primary }]}>You're All Set!</Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Your dashboard is ready. Start exploring Yarvi and make it your own.
        </Text>

        <AppCard variant="glass" style={styles.tipCard}>
          <Text style={[styles.tipTitle, { color: colors.text.primary }]}>Quick Tip</Text>
          <Text style={[styles.tipText, { color: colors.text.secondary }]}>
            Tap the + button on your dashboard for quick actions like adding tasks, logging
            expenses, creating events, or starting a focus session.
          </Text>
        </AppCard>

        <AppButton
          title="Start Using Yarvi"
          onPress={onFinish}
          fullWidth
          size="large"
          loading={isLoading}
        />
      </View>
    </View>
  );
}

// Helper component for feature items
interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  colors: any;
}

function FeatureItem({ icon, title, description, colors }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={[styles.featureTitle, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  largeIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  permissionsList: {
    flex: 1,
    gap: 12,
    marginVertical: 24,
  },
  permissionCard: {
    marginBottom: 0,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  includesCard: {
    marginVertical: 20,
  },
  includesTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  includeItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  note: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  buttonGroup: {
    gap: 12,
  },
  themesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 20,
  },
  themeCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeIcon: {
    fontSize: 28,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  themeDesc: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  tipCard: {
    marginVertical: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
});
