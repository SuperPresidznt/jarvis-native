/**
 * Dashboard Screen
 * Overview of daily metrics, tasks, and insights
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.greeting}>
          Good Morning
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Here's your overview for today
        </Text>

        <Card style={styles.card}>
          <Card.Title title="Tasks" subtitle="3 tasks due today" />
          <Card.Content>
            <Text variant="bodyMedium">Coming soon: Task overview widget</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Habits" subtitle="2/5 completed today" />
          <Card.Content>
            <Text variant="bodyMedium">Coming soon: Habit tracking widget</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Calendar" subtitle="Next event in 2 hours" />
          <Card.Content>
            <Text variant="bodyMedium">Coming soon: Calendar widget</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Finance" subtitle="Budget tracking" />
          <Card.Content>
            <Text variant="bodyMedium">Coming soon: Finance summary widget</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8E8E93',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
});
