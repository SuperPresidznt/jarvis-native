/**
 * ReviewsScreen
 * Manage and view productivity reviews
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { ReviewDetail } from '../../components/reviews/ReviewDetail';
import type { Review, ReviewType } from '../../types';
import {
  getReviews,
  deleteReview,
  createReview,
  markReviewAsExported,
} from '../../database/reviews';
import {
  generateWeeklyReview,
  generateMonthlyReview,
} from '../../services/reviewGenerator';
import { shareReview } from '../../utils/reviewExport';
import { useRefreshControl } from '../../hooks/useRefreshControl';

export default function ReviewsScreen() {
  const { colors } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterType, setFilterType] = useState<ReviewType | 'all'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = filterType !== 'all' ? { reviewType: filterType } : undefined;
      const data = await getReviews(filters);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [loadReviews])
  );

  const { refreshing, handleRefresh } = useRefreshControl({
    screenName: 'Reviews',
    onRefresh: loadReviews,
  });

  const handleGenerateReview = async (type: ReviewType) => {
    try {
      setIsGenerating(true);

      let reviewData;
      if (type === 'weekly') {
        reviewData = await generateWeeklyReview();
      } else if (type === 'monthly') {
        reviewData = await generateMonthlyReview();
      } else {
        throw new Error('Custom reviews not yet supported');
      }

      const review = await createReview({
        reviewType: type,
        periodStart: reviewData.period.start,
        periodEnd: reviewData.period.end,
        data: reviewData,
        insights: JSON.stringify(reviewData.insights),
      });

      await loadReviews();
      setSelectedReview(review);

      Alert.alert(
        'Review Generated',
        `Your ${type} review has been generated successfully!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to generate review:', error);
      Alert.alert('Error', 'Failed to generate review. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(reviewId);
              await loadReviews();
            } catch (error) {
              console.error('Failed to delete review:', error);
              Alert.alert('Error', 'Failed to delete review');
            }
          },
        },
      ]
    );
  };

  const handleExportReview = async (review: Review) => {
    Alert.alert(
      'Export Review',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Text (.txt)',
          onPress: async () => {
            try {
              await shareReview(review, 'text');
              await markReviewAsExported(review.id);
              await loadReviews();
            } catch (error) {
              console.error('Failed to export review:', error);
              Alert.alert('Error', 'Failed to export review');
            }
          },
        },
        {
          text: 'Markdown (.md)',
          onPress: async () => {
            try {
              await shareReview(review, 'markdown');
              await markReviewAsExported(review.id);
              await loadReviews();
            } catch (error) {
              console.error('Failed to export review:', error);
              Alert.alert('Error', 'Failed to export review');
            }
          },
        },
        {
          text: 'JSON (.json)',
          onPress: async () => {
            try {
              await shareReview(review, 'json');
              await markReviewAsExported(review.id);
              await loadReviews();
            } catch (error) {
              console.error('Failed to export review:', error);
              Alert.alert('Error', 'Failed to export review');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const showGenerateMenu = () => {
    Alert.alert(
      'Generate Review',
      'Choose review type:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Weekly Review',
          onPress: () => handleGenerateReview('weekly'),
        },
        {
          text: 'Monthly Review',
          onPress: () => handleGenerateReview('monthly'),
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      backgroundColor: colors.background.secondary,
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text.primary,
    },
    generateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary.main,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },
    generateButtonText: {
      color: colors.primary.contrast,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.background.tertiary,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    filterButtonActive: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text.secondary,
    },
    filterButtonTextActive: {
      color: colors.primary.contrast,
    },
    content: {
      flex: 1,
    },
    listContent: {
      padding: 20,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 15,
      color: colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 22,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    generatingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    generatingContent: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      minWidth: 200,
    },
    generatingText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Reviews</Text>
          <Pressable
            style={styles.generateButton}
            onPress={showGenerateMenu}
            disabled={isGenerating}
          >
            <Ionicons name="sparkles" size={18} color={colors.primary.contrast} />
            <Text style={styles.generateButtonText}>Generate</Text>
          </Pressable>
        </View>

        <View style={styles.filterContainer}>
          <Pressable
            style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filterType === 'weekly' && styles.filterButtonActive]}
            onPress={() => setFilterType('weekly')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'weekly' && styles.filterButtonTextActive,
              ]}
            >
              Weekly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filterType === 'monthly' && styles.filterButtonActive]}
            onPress={() => setFilterType('monthly')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'monthly' && styles.filterButtonTextActive,
              ]}
            >
              Monthly
            </Text>
          </Pressable>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <FlatList
          style={styles.content}
          contentContainerStyle={styles.listContent}
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onPress={() => setSelectedReview(item)}
              onDelete={() => handleDeleteReview(item.id)}
              onExport={() => handleExportReview(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="clipboard-outline"
                size={64}
                color={colors.text.tertiary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptySubtitle}>
                Generate your first review to see insights about your productivity and progress
              </Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <Modal visible={!!selectedReview} animationType="slide" presentationStyle="fullScreen">
          <ReviewDetail
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
            onExport={() => handleExportReview(selectedReview)}
          />
        </Modal>
      )}

      {/* Generating Overlay */}
      {isGenerating && (
        <View style={styles.generatingOverlay}>
          <View style={styles.generatingContent}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.generatingText}>Generating Review...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
