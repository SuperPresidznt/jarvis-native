/**
 * Custom Colors Screen
 * Allows users to customize theme colors using RGB pickers
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../types';
import { useThemeStore, CustomColors } from '../../store/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { ColorPicker } from '../../components/settings/ColorPicker';
import { AppButton } from '../../components/ui';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';
import { haptic } from '../../utils/haptics';
import { alertSuccess } from '../../utils/dialogs';

type CustomColorsScreenProps = {
  navigation: NativeStackNavigationProp<SettingsStackParamList, 'CustomColors'>;
};

// Preset quick colors for easy selection
const QUICK_COLORS = [
  { name: 'Emerald', color: '#10E87F' },
  { name: 'Cyan', color: '#00E5FF' },
  { name: 'Purple', color: '#A855F7' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Orange', color: '#FF6B35' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Yellow', color: '#FBBF24' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CustomColorsScreen({ navigation: _navigation }: CustomColorsScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, customColors: savedCustomColors } = useTheme();
  const { setCustomColors } = useThemeStore();

  // Local state for editing
  const [primaryColor, setPrimaryColor] = useState(
    savedCustomColors?.primaryMain || colors.primary.main
  );
  const [accentCyan, setAccentCyan] = useState(
    savedCustomColors?.accentCyan || colors.accent.cyan
  );
  const [accentPurple, setAccentPurple] = useState(
    savedCustomColors?.accentPurple || colors.accent.purple
  );
  const [accentPink, setAccentPink] = useState(
    savedCustomColors?.accentPink || colors.accent.pink
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handlePrimaryChange = useCallback((color: string) => {
    setPrimaryColor(color);
    setHasChanges(true);
  }, []);

  const handleAccentCyanChange = useCallback((color: string) => {
    setAccentCyan(color);
    setHasChanges(true);
  }, []);

  const handleAccentPurpleChange = useCallback((color: string) => {
    setAccentPurple(color);
    setHasChanges(true);
  }, []);

  const handleAccentPinkChange = useCallback((color: string) => {
    setAccentPink(color);
    setHasChanges(true);
  }, []);

  const handleQuickColor = useCallback((color: string) => {
    haptic.light();
    setPrimaryColor(color);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    haptic.success();
    const customColors: CustomColors = {
      primaryMain: primaryColor,
      accentCyan: accentCyan,
      accentPurple: accentPurple,
      accentPink: accentPink,
    };
    await setCustomColors(customColors);
    alertSuccess('Saved!', 'Your custom colors have been applied.');
    setHasChanges(false);
  }, [primaryColor, accentCyan, accentPurple, accentPink, setCustomColors]);

  const handleReset = useCallback(async () => {
    haptic.warning();
    await setCustomColors(null);
    // Reset to current preset's default colors
    setPrimaryColor(colors.primary.main);
    setAccentCyan(colors.accent.cyan);
    setAccentPurple(colors.accent.purple);
    setAccentPink(colors.accent.pink);
    setHasChanges(false);
    alertSuccess('Reset', 'Colors have been reset to preset defaults.');
  }, [setCustomColors, colors]);

  const styles = createStyles(colors);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + spacing['3xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>🎨</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Custom Colors</Text>
          <Text style={styles.infoText}>
            Customize your theme colors. These override the selected preset's colors.
          </Text>
        </View>
      </View>

      {/* Quick Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK PICK</Text>
        <View style={styles.quickColorsContainer}>
          <View style={styles.quickColorsGrid}>
            {QUICK_COLORS.map((item) => (
              <TouchableOpacity
                key={item.color}
                style={[
                  styles.quickColorButton,
                  { backgroundColor: item.color },
                  primaryColor === item.color && styles.quickColorSelected,
                ]}
                onPress={() => handleQuickColor(item.color)}
                activeOpacity={0.7}
              >
                {primaryColor === item.color && (
                  <Text style={styles.quickColorCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Primary Color Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PRIMARY / ACCENT COLOR</Text>
        <View style={styles.pickerCard}>
          <ColorPicker
            color={primaryColor}
            onColorChange={handlePrimaryChange}
            label="Primary Color"
            colors={colors}
          />
          <Text style={styles.pickerHint}>
            Used for buttons, highlights, and key UI elements
          </Text>
        </View>
      </View>

      {/* Additional Accent Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ADDITIONAL ACCENTS</Text>
        <View style={styles.pickerCard}>
          <ColorPicker
            color={accentCyan}
            onColorChange={handleAccentCyanChange}
            label="Accent Cyan"
            colors={colors}
          />
        </View>
        <View style={[styles.pickerCard, { marginTop: spacing.md }]}>
          <ColorPicker
            color={accentPurple}
            onColorChange={handleAccentPurpleChange}
            label="Accent Purple"
            colors={colors}
          />
        </View>
        <View style={[styles.pickerCard, { marginTop: spacing.md }]}>
          <ColorPicker
            color={accentPink}
            onColorChange={handleAccentPinkChange}
            label="Accent Pink"
            colors={colors}
          />
        </View>
      </View>

      {/* Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PREVIEW</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <View style={[styles.previewButton, { backgroundColor: primaryColor }]}>
              <Text style={styles.previewButtonText}>Primary Button</Text>
            </View>
          </View>
          <View style={styles.previewRow}>
            <View style={[styles.previewChip, { backgroundColor: accentCyan }]} />
            <View style={[styles.previewChip, { backgroundColor: accentPurple }]} />
            <View style={[styles.previewChip, { backgroundColor: accentPink }]} />
            <View style={[styles.previewChip, { backgroundColor: primaryColor }]} />
          </View>
          <View style={[styles.previewBorder, { borderColor: primaryColor }]}>
            <Text style={[styles.previewText, { color: primaryColor }]}>
              Focused Input Preview
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <AppButton
          title="Save Custom Colors"
          onPress={handleSave}
          variant="primary"
          disabled={!hasChanges}
        />
        <View style={styles.buttonSpacer} />
        <AppButton
          title="Reset to Preset Default"
          onPress={handleReset}
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof import('../../theme').getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    contentContainer: {
      paddingTop: spacing.base,
    },
    infoBanner: {
      flexDirection: 'row',
      backgroundColor: colors.background.secondary,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      padding: spacing.base,
      borderRadius: borderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary.main,
      ...shadows.sm,
    },
    infoIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.bold,
      color: colors.primary.main,
      marginBottom: spacing.xs,
    },
    infoText: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
      lineHeight: typography.size.sm * 1.5,
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
    quickColorsContainer: {
      backgroundColor: colors.background.secondary,
      marginHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      ...shadows.sm,
    },
    quickColorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      justifyContent: 'center',
    },
    quickColorButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    quickColorSelected: {
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
    quickColorCheck: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    pickerCard: {
      backgroundColor: colors.background.secondary,
      marginHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    pickerHint: {
      fontSize: typography.size.sm,
      color: colors.text.tertiary,
      marginTop: spacing.md,
      fontStyle: 'italic',
    },
    previewCard: {
      backgroundColor: colors.background.secondary,
      marginHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      gap: spacing.md,
      ...shadows.sm,
    },
    previewRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
    },
    previewButton: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
      ...shadows.sm,
    },
    previewButtonText: {
      color: '#FFFFFF',
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
    },
    previewChip: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    previewBorder: {
      borderWidth: 2,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
    },
    previewText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
    buttonSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    buttonSpacer: {
      height: spacing.md,
    },
  });
