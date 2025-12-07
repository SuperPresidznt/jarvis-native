/**
 * Calendar Screen
 * Calendar events and scheduling
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function CalendarScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • View your calendar events
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Sync with Google Calendar
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Create and edit events
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Find available time slots
            </Text>
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
  infoCard: {
    marginBottom: 16,
  },
  infoText: {
    marginTop: 8,
  },
});
