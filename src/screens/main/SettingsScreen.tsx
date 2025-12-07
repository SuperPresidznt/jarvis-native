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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Account
        </Text>
        <List.Item
          title={user?.email || 'No email'}
          description="Email address"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <Divider />
        <List.Item
          title={user?.timezone || 'America/Chicago'}
          description="Timezone"
          left={(props) => <List.Icon {...props} icon="clock-outline" />}
        />
        <Divider />
        <List.Item
          title={user?.currency || 'USD'}
          description="Currency"
          left={(props) => <List.Icon {...props} icon="currency-usd" />}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Notifications
        </Text>
        <List.Item
          title="Push Notifications"
          description="Receive notifications for tasks and events"
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
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
          description="Use fingerprint or face ID"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={() => (
            <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          About
        </Text>
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-check-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // TODO: Open privacy policy
          }}
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          left={(props) => <List.Icon {...props} icon="file-document-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
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
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#8E8E93',
  },
  logoutText: {
    color: '#FF3B30',
  },
});
