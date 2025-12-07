/**
 * Finance Screen
 * Financial tracking and budgeting
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function FinanceScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">Coming Soon</Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Track assets and liabilities
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Monitor cash flow
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Budget management
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              • Financial insights
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
