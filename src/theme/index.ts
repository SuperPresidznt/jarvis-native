/**
 * Centralized Theme System
 * Production-ready design tokens for consistent UI
 */

export const colors = {
  // Dark mode backgrounds
  background: {
    primary: '#0F172A',    // Main background
    secondary: '#1E293B',  // Cards and elevated surfaces
    tertiary: '#334155',   // Subtle borders and dividers
  },

  // Text colors with proper contrast
  text: {
    primary: '#F8FAFC',    // Main text - excellent contrast
    secondary: '#E2E8F0',  // Secondary text - good contrast
    tertiary: '#94A3B8',   // Muted text - sufficient contrast
    disabled: '#64748B',   // Disabled state
    placeholder: '#64748B', // Input placeholders
  },

  // Semantic colors
  accent: {
    primary: '#10B981',    // Success/Primary actions
    secondary: '#3B82F6',  // Info/Links
    warning: '#F59E0B',    // Warnings
    danger: '#EF4444',     // Errors/Destructive actions
  },

  // UI element colors
  border: {
    default: '#334155',
    focus: '#10B981',
    error: '#EF4444',
  },

  // Input colors
  input: {
    background: '#0F172A',
    border: '#334155',
    text: '#F8FAFC',
    placeholder: '#64748B',
  },

  // Light mode (for auth screens)
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    primary: '#007AFF',
  }
};

export const typography = {
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Font sizes
  size: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};

// Common text styles for consistency
export const textStyles = {
  h1: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
  },
  h2: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    lineHeight: typography.size.xl * typography.lineHeight.normal,
  },
  h4: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    lineHeight: typography.size.lg * typography.lineHeight.normal,
  },
  body: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    color: colors.text.primary,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  bodySecondary: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  caption: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
};

// Common card style
export const cardStyle = {
  backgroundColor: colors.background.secondary,
  borderRadius: borderRadius.lg,
  ...shadows.sm,
};

// Common input style
export const inputStyle = {
  backgroundColor: colors.input.background,
  borderRadius: borderRadius.md,
  borderWidth: 1.5,
  borderColor: colors.input.border,
  padding: spacing.md,
  color: colors.input.text,
  fontSize: typography.size.base,
  fontWeight: typography.weight.regular,
};
