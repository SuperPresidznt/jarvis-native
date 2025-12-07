/**
 * Habits Screen
 * Habit tracking and streaks
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';

export default function HabitsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          No habits yet. Start building positive habits today!
        </Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Track daily/weekly/monthly habits
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • View streak statistics
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Get completion insights
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Set reminders
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Open habit creation modal
        }}
      />
    </View>
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
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginVertical: 32,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoText: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
  },
});
