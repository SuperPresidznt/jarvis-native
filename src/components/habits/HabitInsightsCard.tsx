import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HabitInsights } from '../../database/habits';

interface HabitInsightsCardProps {
  insights: HabitInsights;
  habitName: string;
}

export function HabitInsightsCard({ insights, habitName }: HabitInsightsCardProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.title}>{habitName} Insights</Text>

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

        {/* Best Time of Day */}
        {insights.bestTimeOfDay && (
          <View style={styles.section}>
            <View style={styles.insightRow}>
              <Icon name="clock-outline" size={24} color="#4A90E2" />
              <View style={styles.insightTextContainer}>
                <Text style={styles.insightText}>
                  You complete this habit most often in the{' '}
                  <Text style={styles.insightHighlight}>{insights.bestTimeOfDay}</Text>
                </Text>
                <View style={styles.timeDistribution}>
                  <Text style={styles.timeDistLabel}>
                    Morning: {insights.timeDistribution.morning}
                  </Text>
                  <Text style={styles.timeDistLabel}>
                    Afternoon: {insights.timeDistribution.afternoon}
                  </Text>
                  <Text style={styles.timeDistLabel}>
                    Evening: {insights.timeDistribution.evening}
                  </Text>
                </View>
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
  timeDistribution: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeDistLabel: {
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
});
