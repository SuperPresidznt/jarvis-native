/**
 * Responsive Layout Utilities
 * Provides utilities for responsive design across different device sizes
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device breakpoints
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// Device type detection
export const isPhone = width < BREAKPOINTS.tablet;
export const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
export const isDesktop = width >= BREAKPOINTS.desktop;

/**
 * Get the current device type
 */
export const getDeviceType = (): 'phone' | 'tablet' | 'desktop' => {
  if (width < BREAKPOINTS.tablet) return 'phone';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  return 'desktop';
};

/**
 * Check if the device is in landscape orientation
 */
export const isLandscape = () => width > height;

/**
 * Check if the device is in portrait orientation
 */
export const isPortrait = () => width <= height;

/**
 * Get responsive value based on device type
 * @param phoneValue Value for phone devices
 * @param tabletValue Value for tablet devices
 * @param desktopValue Value for desktop devices (optional, defaults to tablet value)
 */
export const responsive = <T,>(
  phoneValue: T,
  tabletValue: T,
  desktopValue?: T
): T => {
  const deviceType = getDeviceType();
  if (deviceType === 'phone') return phoneValue;
  if (deviceType === 'tablet') return tabletValue;
  return desktopValue ?? tabletValue;
};

/**
 * Get responsive spacing value
 * @param phoneSpacing Spacing for phone (in px)
 * @param tabletSpacing Spacing for tablet (in px)
 * @param desktopSpacing Spacing for desktop (in px, optional)
 */
export const responsiveSpacing = (
  phoneSpacing: number,
  tabletSpacing: number,
  desktopSpacing?: number
): number => {
  return responsive(phoneSpacing, tabletSpacing, desktopSpacing);
};

/**
 * Get responsive font size
 * @param phoneFontSize Font size for phone
 * @param tabletFontSize Font size for tablet
 * @param desktopFontSize Font size for desktop (optional)
 */
export const responsiveFontSize = (
  phoneFontSize: number,
  tabletFontSize: number,
  desktopFontSize?: number
): number => {
  return responsive(phoneFontSize, tabletFontSize, desktopFontSize);
};

/**
 * Get responsive columns for grid layouts
 */
export const getGridColumns = (): number => {
  return responsive(1, 2, 3);
};

/**
 * Get responsive max width for content
 */
export const getMaxContentWidth = (): number => {
  return responsive(width, 800, 1200);
};

/**
 * Get responsive padding for screens
 */
export const getScreenPadding = (): number => {
  return responsive(16, 24, 32);
};

/**
 * Get responsive card width
 */
export const getCardWidth = (): number => {
  const padding = getScreenPadding();
  const columns = getGridColumns();
  const gap = responsiveSpacing(12, 16, 20);
  return (width - padding * 2 - gap * (columns - 1)) / columns;
};

/**
 * Check if screen is small (phone in portrait)
 */
export const isSmallScreen = (): boolean => {
  return width < 375 || (isPhone && isPortrait());
};

/**
 * Check if screen is medium (large phone or tablet in portrait)
 */
export const isMediumScreen = (): boolean => {
  return (width >= 375 && width < BREAKPOINTS.tablet) || (isTablet && isPortrait());
};

/**
 * Check if screen is large (tablet in landscape or desktop)
 */
export const isLargeScreen = (): boolean => {
  return (isTablet && isLandscape()) || isDesktop;
};

/**
 * Get adaptive layout configuration for a screen
 */
export const getLayoutConfig = () => {
  const deviceType = getDeviceType();
  const orientation = isLandscape() ? 'landscape' : 'portrait';

  return {
    deviceType,
    orientation,
    columns: getGridColumns(),
    padding: getScreenPadding(),
    maxWidth: getMaxContentWidth(),
    isSmall: isSmallScreen(),
    isMedium: isMediumScreen(),
    isLarge: isLargeScreen(),
    showSidebar: isTablet || isDesktop,
    useSplitView: isTablet && isLandscape(),
  };
};

/**
 * Hook to get responsive dimensions
 * Note: For dynamic updates, use Dimensions.addEventListener in a component
 */
export const useDimensions = () => {
  return {
    width,
    height,
    isPhone,
    isTablet,
    isDesktop,
    isLandscape: isLandscape(),
    isPortrait: isPortrait(),
  };
};

// Export dimensions for direct access
export { width, height };
