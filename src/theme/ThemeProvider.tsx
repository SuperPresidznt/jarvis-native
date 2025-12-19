/**
 * Theme Provider
 * Re-exports the useTheme hook for convenience
 * NOTE: The actual theme hook is in src/hooks/useTheme.ts
 */

import React from 'react';

// Re-export the existing useTheme hook
export { useTheme } from '../hooks/useTheme';

// Simple provider that does nothing (theme is managed by Zustand store)
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
