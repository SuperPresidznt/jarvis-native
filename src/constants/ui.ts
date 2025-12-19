/**
 * UI Constants
 * Centralized UI configuration values
 */

/**
 * Standard hitSlop for better tap targets on mobile
 * Increases touchable area without changing visual size
 */
export const HIT_SLOP = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

/**
 * Larger hitSlop for small icons and critical actions
 */
export const HIT_SLOP_LARGE = {
  top: 16,
  bottom: 16,
  left: 16,
  right: 16,
};

/**
 * Minimum loading duration to prevent flashing
 */
export const MIN_LOADING_DURATION = 150; // ms

/**
 * Debounce delay for search inputs
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Animation durations
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

/**
 * Toast/Snackbar durations
 */
export const TOAST_DURATION = {
  short: 2000,
  medium: 4000,
  long: 6000,
} as const;

/**
 * Maximum items to render in virtualized lists
 */
export const LIST_CONFIG = {
  initialNumToRender: 15,
  maxToRenderPerBatch: 10,
  windowSize: 10,
  updateCellsBatchingPeriod: 50,
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

/**
 * Avatar sizes
 */
export const AVATAR_SIZE = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  overlay: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;
