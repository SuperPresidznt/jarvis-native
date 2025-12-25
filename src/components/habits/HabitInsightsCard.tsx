import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HabitInsights } from '../../database/habits';
import { Sparkline } from '../charts/Sparkline';
import {
  getHabitCompletionTimes,
  getHabitCompletionDates,
} from '../../database/habits';
import {
  analyzeBestTime,
  generateCompletionTrend,
  calculateStreakMilestones,
  getTimeOfDayEmoji,
  formatTimeFromHour,
  TimeAnalysis,
  CompletionTrendData,
} from '../../utils/habitAnalytics';

interface HabitInsightsCardProps {
  insights: HabitInsights;
  habitName: string;
}

export function HabitInsightsCard({ insights, habitName }: HabitInsightsCardProps) {
  const [trendData, setTrendData] = useState<CompletionTrendData | null>(null);
  const [timeAnalysis, setTimeAnalysis] = useState<TimeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnhancedAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insights.habitId]);

  const loadEnhancedAnalytics = async () => {
    try {
      setIsLoading(true);

      // Load completion dates for trend chart
      const completionDates = await getHabitCompletionDates(insights.habitId, 30);
      const trend = generateCompletionTrend(completionDates, 30);
      setTrendData(trend);

      // Load completion times for time-of-day analysis
      const completionTimes = await getHabitCompletionTimes(insights.habitId, 90);
      const timeData = analyzeBestTime(completionTimes);
      setTimeAnalysis(timeData);
    } catch (error) {
      console.error('[HabitInsightsCard] Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const streakMilestones = calculateStreakMilestones(
    insights.currentStreak,
    insights.longestStreak
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.title}>{habitName} Insights</Text>

        {/* 30-Day Completion Trend Chart */}
        {isLoading ? (
          <View style={[styles.section, styles.loadingContainer]}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        ) : (
          trendData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>30-Day Completion Trend</Text>
              <View style={styles.trendContainer}>
                <Sparkline
                  data={trendData.values}
                  width={300}
                  height={60}
                  color="#4CAF50"
                  strokeWidth={3}
                  trend="positive"
                />
                <Text style={styles.trendSummary}>
                  {trendData.completedDays}/{trendData.totalDays} days completed (
                  {trendData.completionRate}%)
                </Text>
              </View>
            </View>
          )
        )}

        {/* Completion Rates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completion Rates</Text>
          <View style={styles.ratesContainer}>
            <View style={styles.rateBox}>
              <Text style={styles.rateValue}>{insights.completionRate7Days}%</Text>
              <Text style={styles.rateLabel}>Last 7 Days</Text>
              <View style={[styles.rateBar, { width: `${insights.completionRate7Days}%` }]} />
            </View>
            <View style={styles.divider} />
            <View style={styles.rateBox}>
              <Text style={styles.rateValue}>{insights.completionRate30Days}%</Text>
              <Text style={styles.rateLabel}>Last 30 Days</Text>
              <View style={[styles.rateBar, { width: `${insights.completionRate30Days}%` }]} />
            </View>
          </View>
        </View>

        {/* Streaks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streaks</Text>
          <View style={styles.streaksContainer}>
            <View style={styles.streakBox}>
              <Icon name="fire" size={32} color="#FF6B35" />
              <Text style={styles.streakValue}>{insights.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakBox}>
              <Icon name="trophy" size={32} color="#FFD23F" />
              <Text style={styles.streakValue}>{insights.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Streak Milestone Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak Progress</Text>
          <View style={styles.streakProgressContainer}>
            {/* Progress bar showing current vs longest */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width:
                        insights.longestStreak > 0
                          ? `${Math.min(
                              100,
                              (insights.currentStreak / insights.longestStreak) * 100
                            )}%`
                          : '0%',
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>
                  Current: {insights.currentStreak} days
                </Text>
                <Text style={styles.progressLabel}>
                  Best: {insights.longestStreak} days
                </Text>
              </View>
            </View>

            {/* Milestone badges */}
            <View style={styles.milestonesContainer}>
              {streakMilestones.milestones.map((milestone) => (
                <View key={milestone.milestone} style={styles.milestoneItem}>
                  <Icon
                    name={milestone.achieved ? 'check-circle' : 'circle-outline'}
                    size={24}
                    color={milestone.achieved ? '#4CAF50' : '#CCCCCC'}
                  />
                  <Text
                    style={[
                      styles.milestoneText,
                      milestone.achieved && styles.milestoneTextAchieved,
                    ]}
                  >
                    {milestone.milestone} days
                  </Text>
                  {!milestone.achieved && milestone.daysRemaining > 0 && (
                    <Text style={styles.milestoneRemaining}>
                      {milestone.daysRemaining} to go
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Enhanced Best Time of Day */}
        {timeAnalysis && timeAnalysis.percentage > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Best Time of Day</Text>
            <View style={styles.timeOfDayCard}>
              <View style={styles.timeOfDayHeader}>
                <Text style={styles.timeOfDayEmoji}>
                  {getTimeOfDayEmoji(timeAnalysis.timeOfDay)}
                </Text>
                <View style={styles.timeOfDayInfo}>
                  <Text style={styles.timeOfDayLabel}>
                    {timeAnalysis.timeOfDay.charAt(0).toUpperCase() +
                      timeAnalysis.timeOfDay.slice(1)}
                  </Text>
                  <Text style={styles.timeOfDayTime}>{timeAnalysis.hourRange}</Text>
                </View>
                <View style={styles.timeOfDayBadge}>
                  <Text style={styles.timeOfDayPercentage}>{timeAnalysis.percentage}%</Text>
                </View>
              </View>
              <Text style={styles.timeOfDayDescription}>
                Most completions around {formatTimeFromHour(timeAnalysis.mostCommonHour)}
              </Text>
            </View>

            {/* Time Distribution Breakdown */}
            <View style={styles.timeDistribution}>
              <View style={styles.timeDistItem}>
                <Text style={styles.timeDistEmoji}>🌅</Text>
                <Text style={styles.timeDistLabel}>Morning</Text>
                <Text style={styles.timeDistValue}>{insights.timeDistribution.morning}</Text>
              </View>
              <View style={styles.timeDistItem}>
                <Text style={styles.timeDistEmoji}>☀️</Text>
                <Text style={styles.timeDistLabel}>Afternoon</Text>
                <Text style={styles.timeDistValue}>{insights.timeDistribution.afternoon}</Text>
              </View>
              <View style={styles.timeDistItem}>
                <Text style={styles.timeDistEmoji}>🌆</Text>
                <Text style={styles.timeDistLabel}>Evening</Text>
                <Text style={styles.timeDistValue}>{insights.timeDistribution.evening}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Weekday Pattern Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Pattern</Text>
          <View style={styles.weekdayBars}>
            {Object.entries(insights.weekdayPattern).map(([day, rate]) => (
              <View key={day} style={styles.weekdayBar}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${rate}%`,
                        backgroundColor: getBarColor(rate),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weekdayLabel}>{day.slice(0, 3)}</Text>
                <Text style={styles.weekdayRate}>{rate}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Footer */}
        <View style={styles.footer}>
          <Icon name="check-circle" size={16} color="#999" />
          <Text style={styles.footerText}>
            {insights.totalCompletions} completions in last 30 days
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function getBarColor(rate: number): string {
  if (rate >= 80) return '#4CAF50'; // Green
  if (rate >= 50) return '#FFB74D'; // Orange
  return '#EF5350'; // Red
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  ratesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  rateBox: {
    flex: 1,
    alignItems: 'center',
  },
  rateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  rateLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginBottom: 8,
  },
  rateBar: {
    height: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    maxWidth: '100%',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  streaksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  streakBox: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 12,
  },
  insightTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  oldTimeDistribution: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  oldTimeDistLabel: {
    fontSize: 11,
    color: '#777',
  },
  weekdayBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  weekdayBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  weekdayLabel: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
    fontWeight: '500',
  },
  weekdayRate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
  // Loading state styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
  // Trend chart styles
  trendContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  trendSummary: {
    marginTop: 12,
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  // Streak progress styles
  streakProgressContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  milestonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
    minWidth: 120,
  },
  milestoneText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  milestoneTextAchieved: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  milestoneRemaining: {
    fontSize: 10,
    color: '#BBB',
    marginLeft: 4,
  },
  // Enhanced time of day styles
  timeOfDayCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  timeOfDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeOfDayEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  timeOfDayInfo: {
    flex: 1,
  },
  timeOfDayLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeOfDayTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  timeOfDayBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeOfDayPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeOfDayDescription: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  timeDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  timeDistItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeDistEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  timeDistLabel: {
    fontSize: 11,
    color: '#777',
    marginBottom: 4,
  },
  timeDistValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
