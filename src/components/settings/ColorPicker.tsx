/**
 * ColorPicker Component
 * RGB slider-based color picker for theme customization
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  typography,
  spacing,
  borderRadius,
} from '../../theme';

interface ColorPickerProps {
  color: string; // Hex color like '#10E87F'
  onColorChange: (color: string) => void;
  label?: string;
  colors: ReturnType<typeof import('../../theme').getColors>;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Convert hex to RGB
const hexToRgb = (hex: string): RGBColor => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onColorChange,
  label,
  colors,
}) => {
  const [rgb, setRgb] = useState<RGBColor>(() => hexToRgb(color));
  const [hexInput, setHexInput] = useState(color.toUpperCase());

  // Sync internal state when external color changes
  useEffect(() => {
    const newRgb = hexToRgb(color);
    setRgb(newRgb);
    setHexInput(color.toUpperCase());
  }, [color]);

  const handleSliderChange = useCallback(
    (channel: keyof RGBColor, value: number) => {
      const newRgb = { ...rgb, [channel]: Math.round(value) };
      setRgb(newRgb);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setHexInput(newHex);
      onColorChange(newHex);
    },
    [rgb, onColorChange]
  );

  const handleHexInputChange = useCallback(
    (text: string) => {
      // Allow partial input while typing
      let cleanedText = text.replace(/[^#A-Fa-f0-9]/g, '');

      // Add # if missing
      if (!cleanedText.startsWith('#')) {
        cleanedText = '#' + cleanedText;
      }

      // Limit to 7 characters (#RRGGBB)
      if (cleanedText.length > 7) {
        cleanedText = cleanedText.slice(0, 7);
      }

      setHexInput(cleanedText.toUpperCase());

      // Only update color if we have a valid 6-digit hex
      if (/^#[A-Fa-f0-9]{6}$/.test(cleanedText)) {
        const newRgb = hexToRgb(cleanedText);
        setRgb(newRgb);
        onColorChange(cleanedText.toUpperCase());
      }
    },
    [onColorChange]
  );

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Color Preview and Hex Input */}
      <View style={styles.previewRow}>
        <View
          style={[styles.colorPreview, { backgroundColor: rgbToHex(rgb.r, rgb.g, rgb.b) }]}
        />
        <TextInput
          style={styles.hexInput}
          value={hexInput}
          onChangeText={handleHexInputChange}
          placeholder="#000000"
          placeholderTextColor={colors.text.placeholder}
          maxLength={7}
          autoCapitalize="characters"
        />
      </View>

      {/* RGB Sliders */}
      <View style={styles.slidersContainer}>
        {/* Red Slider */}
        <View style={styles.sliderRow}>
          <Text style={[styles.channelLabel, { color: '#FF4444' }]}>R</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={rgb.r}
            onValueChange={(v) => handleSliderChange('r', v)}
            minimumTrackTintColor="#FF4444"
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor="#FF4444"
          />
          <Text style={styles.channelValue}>{rgb.r}</Text>
        </View>

        {/* Green Slider */}
        <View style={styles.sliderRow}>
          <Text style={[styles.channelLabel, { color: '#44FF44' }]}>G</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={rgb.g}
            onValueChange={(v) => handleSliderChange('g', v)}
            minimumTrackTintColor="#44FF44"
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor="#44FF44"
          />
          <Text style={styles.channelValue}>{rgb.g}</Text>
        </View>

        {/* Blue Slider */}
        <View style={styles.sliderRow}>
          <Text style={[styles.channelLabel, { color: '#4444FF' }]}>B</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={rgb.b}
            onValueChange={(v) => handleSliderChange('b', v)}
            minimumTrackTintColor="#4444FF"
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor="#4444FF"
          />
          <Text style={styles.channelValue}>{rgb.b}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof import('../../theme').getColors>) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    colorPreview: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.border.default,
    },
    hexInput: {
      flex: 1,
      height: 48,
      backgroundColor: colors.background.tertiary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      fontSize: typography.size.lg,
      fontWeight: typography.weight.medium,
      color: colors.text.primary,
      fontFamily: 'monospace',
      letterSpacing: 1,
    },
    slidersContainer: {
      gap: spacing.md,
    },
    sliderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    channelLabel: {
      width: 24,
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      textAlign: 'center',
    },
    slider: {
      flex: 1,
      height: 40,
    },
    channelValue: {
      width: 40,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      color: colors.text.secondary,
      textAlign: 'right',
      fontFamily: 'monospace',
    },
  });

export default ColorPicker;
