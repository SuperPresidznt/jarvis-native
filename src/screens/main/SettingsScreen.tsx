/**
 * Settings Screen
 * Professional dark-themed settings and preferences
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Switch } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  danger = false,
}) => {
  const content = (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
      {onPress && !rightElement && (
        <Text style={styles.chevron}>›</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const insets = useSafeAreaInsets();

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing['3xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="👤"
            title={user?.email || 'demo@jarvis.app'}
            subtitle="Email address"
          />
          <View style={styles.divider} />
          <SettingItem
            icon="🌐"
            title={user?.timezone || 'America/Chicago'}
            subtitle="Timezone"
            onPress={() => {/* TODO: Open timezone picker */}}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="💵"
            title={user?.currency || 'USD'}
            subtitle="Currency"
            onPress={() => {/* TODO: Open currency picker */}}
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🔔"
            title="Push Notifications"
            subtitle="Receive notifications for tasks and events"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: colors.background.tertiary,
                  true: `${colors.primary.main}80`,
                }}
                thumbColor={notificationsEnabled ? colors.primary.main : colors.text.disabled}
              />
            }
          />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🔐"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{
                  false: colors.background.tertiary,
                  true: `${colors.primary.main}80`,
                }}
                thumbColor={biometricEnabled ? colors.primary.main : colors.text.disabled}
              />
            }
          />
          <View style={styles.divider} />
          <SettingItem
            icon="🔑"
            title="Change Password"
            onPress={() => {/* TODO: Open change password modal */}}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="ℹ️"
            title="Version"
            subtitle="1.0.0"
          />
          <View style={styles.divider} />
          <SettingItem
            icon="🛡️"
            title="Privacy Policy"
            onPress={() => {/* TODO: Open privacy policy */}}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="📄"
            title="Terms of Service"
            onPress={() => {/* TODO: Open terms of service */}}
          />
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🚪"
            title="Logout"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Jarvis</Text>
        <Text style={styles.appVersion}>Your Personal AI Assistant</Text>
        <Text style={styles.appCopyright}>Made with care</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    paddingTop: spacing.base,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingIconText: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  chevron: {
    fontSize: 24,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginLeft: spacing.base + 40 + spacing.md,
  },
  dangerText: {
    color: colors.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  appName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  appCopyright: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  },
});
