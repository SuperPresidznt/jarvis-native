/**
 * Tasks Screen
 * Task and project management
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          No tasks yet. Tap the + button to create your first task!
        </Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Create and organize tasks
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Set priorities and due dates
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Track project progress
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Sync with backend
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Open task creation modal
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
