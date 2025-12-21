/**
 * Keyboard Shortcuts Framework
 * Provides a unified way to handle keyboard shortcuts across the app
 * Works with iOS/Android hardware keyboards and web
 */

import { useEffect, useCallback, useRef } from 'react';
import { Platform, Keyboard } from 'react-native';

export interface ShortcutConfig {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean; // Command on macOS, Windows key on Windows
  };
  description: string;
  action: () => void;
  enabled?: boolean;
}

export interface ShortcutGroup {
  name: string;
  shortcuts: ShortcutConfig[];
}

/**
 * Normalize key code to a standard format
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().trim();
}

/**
 * Check if modifiers match
 */
function modifiersMatch(
  event: KeyboardEvent,
  modifiers?: ShortcutConfig['modifiers']
): boolean {
  if (!modifiers) {
    return !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
  }

  return (
    (modifiers.ctrl ? event.ctrlKey : !event.ctrlKey) &&
    (modifiers.alt ? event.altKey : !event.altKey) &&
    (modifiers.shift ? event.shiftKey : !event.shiftKey) &&
    (modifiers.meta ? event.metaKey : !event.metaKey)
  );
}

/**
 * Format shortcut for display (e.g., "Cmd+N", "Ctrl+Shift+P")
 */
export function formatShortcut(shortcut: ShortcutConfig): string {
  const parts: string[] = [];
  const isMac = Platform.OS === 'ios' || Platform.OS === 'macos';

  if (shortcut.modifiers?.meta) {
    parts.push(isMac ? '⌘' : 'Win');
  }
  if (shortcut.modifiers?.ctrl) {
    parts.push(isMac ? '⌃' : 'Ctrl');
  }
  if (shortcut.modifiers?.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (shortcut.modifiers?.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }

  // Capitalize single letters, use as-is for special keys
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  parts.push(key);

  return parts.join(isMac ? '' : '+');
}

/**
 * Hook to register keyboard shortcuts
 * Only works on platforms with keyboard support (iOS/Android with hardware keyboard, web)
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: Event) => {
    const keyEvent = event as KeyboardEvent;
    const key = normalizeKey(keyEvent.key);

    // Find matching shortcut
    const matchedShortcut = shortcutsRef.current.find((shortcut) => {
      const enabled = shortcut.enabled !== false;
      const keyMatches = normalizeKey(shortcut.key) === key;
      const modifiersMatched = modifiersMatch(keyEvent, shortcut.modifiers);

      return enabled && keyMatches && modifiersMatched;
    });

    if (matchedShortcut) {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      matchedShortcut.action();
    }
  }, []);

  useEffect(() => {
    // Only add keyboard listener on web or when hardware keyboard is available
    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // On native platforms, keyboard events are handled differently
    // This is a placeholder for future implementation with react-native-keyboard-controller
    // or similar library for hardware keyboard support on iOS/Android

    return () => {};
  }, [handleKeyDown]);
}

/**
 * Common shortcut presets
 */
export const CommonShortcuts = {
  // Navigation
  goBack: (action: () => void): ShortcutConfig => ({
    key: 'Escape',
    description: 'Go back',
    action,
  }),

  // Search
  search: (action: () => void): ShortcutConfig => ({
    key: 'k',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Search',
    action,
  }),

  // Creation
  new: (action: () => void): ShortcutConfig => ({
    key: 'n',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Create new item',
    action,
  }),

  // Editing
  save: (action: () => void): ShortcutConfig => ({
    key: 's',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Save',
    action,
  }),

  delete: (action: () => void): ShortcutConfig => ({
    key: 'Delete',
    description: 'Delete',
    action,
  }),

  // Selection
  selectAll: (action: () => void): ShortcutConfig => ({
    key: 'a',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Select all',
    action,
  }),

  // Refresh
  refresh: (action: () => void): ShortcutConfig => ({
    key: 'r',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Refresh',
    action,
  }),

  // Toggle
  toggleComplete: (action: () => void): ShortcutConfig => ({
    key: 'Enter',
    modifiers: { meta: Platform.OS === 'ios', ctrl: Platform.OS !== 'ios' },
    description: 'Toggle completion',
    action,
  }),

  // Focus
  focusSearch: (action: () => void): ShortcutConfig => ({
    key: '/',
    description: 'Focus search',
    action,
  }),
};

/**
 * Hook to show keyboard shortcuts help
 */
export function useShortcutHelp(groups: ShortcutGroup[]) {
  return {
    groups,
    hasKeyboardSupport: Platform.OS === 'web',
    formatShortcut,
  };
}
