/**
 * Settings Screen
 * User preferences and app configuration
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Divider, Switch, Text } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Account
        </Text>
        <List.Item
          title={user?.email || 'demo@jarvis.app'}
          titleStyle={{ fontWeight: '500' }}
          description="Email address"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="account" color="#007AFF" />}
        />
        <Divider />
        <List.Item
          title={user?.timezone || 'America/Chicago'}
          titleStyle={{ fontWeight: '500' }}
          description="Timezone"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="clock-outline" color="#007AFF" />}
        />
        <Divider />
        <List.Item
          title={user?.currency || 'USD'}
          titleStyle={{ fontWeight: '500' }}
          description="Currency"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="currency-usd" color="#007AFF" />}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Notifications
        </Text>
        <List.Item
          title="Push Notifications"
          titleStyle={{ fontWeight: '500' }}
          description="Receive notifications for tasks and events"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="bell-outline" color="#007AFF" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color="#007AFF"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Security
        </Text>
        <List.Item
          title="Biometric Authentication"
          titleStyle={{ fontWeight: '500' }}
          description="Use fingerprint or face ID"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="fingerprint" color="#007AFF" />}
          right={() => (
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              color="#007AFF"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          About
        </Text>
        <List.Item
          title="Version"
          titleStyle={{ fontWeight: '500' }}
          description="1.0.0"
          descriptionStyle={{ fontSize: 13 }}
          left={(props) => <List.Icon {...props} icon="information-outline" color="#8E8E93" />}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          titleStyle={{ fontWeight: '500' }}
          left={(props) => <List.Icon {...props} icon="shield-check-outline" color="#8E8E93" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#C7C7CC" />}
          onPress={() => {
            // TODO: Open privacy policy
          }}
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          titleStyle={{ fontWeight: '500' }}
          left={(props) => <List.Icon {...props} icon="file-document-outline" color="#8E8E93" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color="#C7C7CC" />}
          onPress={() => {
            // TODO: Open terms of service
          }}
        />
      </View>

      <View style={styles.section}>
        <List.Item
          title="Logout"
          titleStyle={styles.logoutText}
          left={(props) => <List.Icon {...props} icon="logout" color="#FF3B30" />}
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});
