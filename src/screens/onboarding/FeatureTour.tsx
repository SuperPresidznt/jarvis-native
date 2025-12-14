/**
 * Feature Tour
 * Swipeable cards explaining main features
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 'tasks',
    icon: '✓',
    title: 'Task Management',
    description:
      'Create, organize, and track your tasks. Set priorities, due dates, and group them into projects for better organization.',
    color: '#007AFF',
  },
  {
    id: 'habits',
    icon: '🎯',
    title: 'Habit Tracking',
    description:
      'Build better habits with daily, weekly, or monthly tracking. Visualize your streaks and stay motivated with progress charts.',
    color: '#34C759',
  },
  {
    id: 'calendar',
    icon: '📅',
    title: 'Calendar & Events',
    description:
      'Schedule events, set reminders, and manage your time effectively. View your schedule at a glance with month and day views.',
    color: '#FF9500',
  },
  {
    id: 'finance',
    icon: '💰',
    title: 'Finance Tracking',
    description:
      'Track income, expenses, and budgets. Monitor your assets, liabilities, and get insights into your spending patterns.',
    color: '#32ADE6',
  },
  {
    id: 'dashboard',
    icon: '📊',
    title: 'Personal Dashboard',
    description:
      "See all your important metrics in one place. Track today's focus, habits, upcoming events, and financial overview.",
    color: '#5856D6',
  },
];

interface FeatureTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function FeatureTour({ onComplete, onSkip }: FeatureTourProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLastSlide = currentIndex === FEATURES.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const renderFeatureCard = ({ item }: { item: Feature }) => (
    <View style={[styles.card, { width: SCREEN_WIDTH }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>{item.title}</Text>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        {item.description}
      </Text>
    </View>
  );

  const renderDot = (index: number) => {
    const isActive = index === currentIndex;
    return (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor: isActive ? colors.primary.main : colors.border.default,
            width: isActive ? 24 : 8,
          },
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: colors.primary.main }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Cards */}
      <FlatList
        ref={flatListRef}
        data={FEATURES}
        renderItem={renderFeatureCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
      />

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {FEATURES.map((_, index) => renderDot(index))}
      </View>

      {/* Navigation Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary.main }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  card: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
