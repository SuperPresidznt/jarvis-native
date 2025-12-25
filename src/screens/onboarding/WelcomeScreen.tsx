/**
 * Welcome Screen
 * First screen shown on app first launch
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Skip Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: colors.primary.main }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Logo/Branding */}
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
            <Text style={styles.logoText}>J</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text.primary }]}>Jarvis</Text>
          <Text style={[styles.tagline, { color: colors.text.secondary }]}>
            Your Personal Assistant
          </Text>
        </View>

        {/* Value Propositions */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="✓"
            title="Stay Organized"
            description="Manage tasks, habits, and calendar in one place"
            colors={colors}
          />
          <FeatureItem
            icon="📊"
            title="Track Your Progress"
            description="Visualize habits, finances, and productivity metrics"
            colors={colors}
          />
          <FeatureItem
            icon="🚀"
            title="Work Offline"
            description="All your data stored locally with offline-first design"
            colors={colors}
          />
          <FeatureItem
            icon="🎯"
            title="Achieve More"
            description="Stay focused and accomplish your goals every day"
            colors={colors}
          />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: colors.primary.main }]}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
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
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  featuresContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
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
  getStartedButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
