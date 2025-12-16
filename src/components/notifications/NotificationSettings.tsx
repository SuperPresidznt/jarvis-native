/**
 * NotificationSettings Component
 * Section for notification preferences in Settings screen
 */

import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { List, Button, Text, Chip, Divider } from 'react-native-paper';
import { useNotifications } from '../../hooks/useNotifications';
import { useAlarms } from '../../hooks/useAlarms';

interface NotificationSettingsProps {
  onNavigateToAlarms?: () => void;
}

export function NotificationSettings({ onNavigateToAlarms }: NotificationSettingsProps) {
  const { permissionStatus, requestPermissions, hasPermission } = useNotifications();
  const { activeCount } = useAlarms();

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      // Offer to open settings
      Linking.openSettings();
    }
  };

  const getPermissionStatusColor = () => {
    if (!permissionStatus) return '#666';
    if (permissionStatus.granted) return '#4caf50';
    return '#f44336';
  };

  const getPermissionStatusText = () => {
    if (!permissionStatus) return 'Unknown';
    if (permissionStatus.granted) return 'Enabled';
    if (permissionStatus.canAskAgain) return 'Disabled';
    return 'Denied';
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Notifications</List.Subheader>

        <List.Item
          title="Notification Permission"
          description={hasPermission ? 'Notifications are enabled' : 'Enable notifications to receive reminders'}
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Chip
              style={[styles.statusChip, { backgroundColor: getPermissionStatusColor() + '20' }]}
              textStyle={{ color: getPermissionStatusColor() }}
            >
              {getPermissionStatusText()}
            </Chip>
          )}
        />

        {!hasPermission && (
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleRequestPermission}
              icon="bell-ring"
              style={styles.button}
            >
              {permissionStatus?.canAskAgain ? 'Enable Notifications' : 'Open Settings'}
            </Button>
            <Text variant="bodySmall" style={styles.helperText}>
              Notifications are required for task reminders, habit reminders, and alarms.
            </Text>
          </View>
        )}

        <Divider style={styles.divider} />

        <List.Item
          title="Task Reminders"
          description="Get notified about upcoming task deadlines"
          left={(props) => <List.Icon {...props} icon="check-circle-outline" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={hasPermission ? 'check' : 'close'}
              color={hasPermission ? '#4caf50' : '#f44336'}
            />
          )}
        />

        <List.Item
          title="Habit Reminders"
          description="Daily reminders for your habits"
          left={(props) => <List.Icon {...props} icon="repeat" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={hasPermission ? 'check' : 'close'}
              color={hasPermission ? '#4caf50' : '#f44336'}
            />
          )}
        />

        <List.Item
          title="Calendar Reminders"
          description="Get notified before events start"
          left={(props) => <List.Icon {...props} icon="calendar" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={hasPermission ? 'check' : 'close'}
              color={hasPermission ? '#4caf50' : '#f44336'}
            />
          )}
        />

        <Divider style={styles.divider} />

        <List.Item
          title="Recurring Alarms"
          description={`${activeCount} active alarm${activeCount !== 1 ? 's' : ''}`}
          left={(props) => <List.Icon {...props} icon="alarm" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={onNavigateToAlarms}
        />

        {hasPermission && (
          <View style={styles.infoContainer}>
            <List.Icon icon="information" color="#2196f3" />
            <Text variant="bodySmall" style={styles.infoText}>
              You can customize individual reminders when creating or editing tasks, habits, and events.
            </Text>
          </View>
        )}
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  statusChip: {
    marginRight: 8,
  },
  actionContainer: {
    padding: 16,
    paddingTop: 0,
  },
  button: {
    marginBottom: 8,
  },
  helperText: {
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#e3f2fd',
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: '#1976d2',
  },
});

export default NotificationSettings;
