/**
 * Easter Eggs Utility
 * Fun hidden features for the Yarvi app
 */

import { Audio, AVPlaybackSource } from 'expo-av';
import * as storage from '../services/storage';
import { haptic } from './haptics';

// Storage key for funny mode preference
const FUNNY_MODE_KEY = 'funny_mode_enabled';

// Magic number for the N64 easter egg
const MAGIC_NUMBER = 64;

// Track if sound is currently playing to prevent spam
let isPlayingSound = false;

// Cached sound object for reuse
let cachedSound: Audio.Sound | null = null;

// Track if sound asset is available
let soundAssetAvailable: boolean | null = null;

/**
 * Try to load the sound asset
 * Returns the source if available, null otherwise
 */
const getSoundAsset = (): AVPlaybackSource | null => {
  if (soundAssetAvailable === false) return null;

  try {
    // Try to require the sound file (dynamic require for optional asset)
    const asset = require('../../assets/sounds/retro-startup.mp3');
    soundAssetAvailable = true;
    return asset;
  } catch {
    // Sound file not available - that's fine, use haptic fallback
    soundAssetAvailable = false;
    return null;
  }
};

/**
 * Check if Funny Mode is enabled
 */
export const isFunnyModeEnabled = async (): Promise<boolean> => {
  const value = await storage.getItem(FUNNY_MODE_KEY);
  return value === 'true';
};

/**
 * Set Funny Mode preference
 */
export const setFunnyModeEnabled = async (enabled: boolean): Promise<void> => {
  await storage.setItem(FUNNY_MODE_KEY, enabled ? 'true' : 'false');
};

/**
 * Check if an array of numbers sums to 64
 * @param numbers - Array of numbers to check (can be in cents, will be converted)
 * @param inCents - If true, numbers are treated as cents and converted to dollars
 */
export const sumEquals64 = (numbers: number[], inCents: boolean = false): boolean => {
  if (numbers.length === 0) return false;

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const normalizedSum = inCents ? Math.round(sum / 100) : Math.round(sum);

  return normalizedSum === MAGIC_NUMBER;
};

/**
 * Check multiple sum conditions for easter egg triggers
 * Returns true if any visible total equals 64
 */
export const checkForMagicNumber = (values: {
  income?: number;
  expenses?: number;
  net?: number;
  total?: number;
}, inCents: boolean = true): boolean => {
  const normalizer = inCents ? 100 : 1;

  // Check each value
  if (values.income && Math.round(values.income / normalizer) === MAGIC_NUMBER) return true;
  if (values.expenses && Math.round(values.expenses / normalizer) === MAGIC_NUMBER) return true;
  if (values.net !== undefined && Math.round(Math.abs(values.net) / normalizer) === MAGIC_NUMBER) return true;
  if (values.total && Math.round(values.total / normalizer) === MAGIC_NUMBER) return true;

  return false;
};

/**
 * Play the retro N64-style startup sound
 * Falls back to haptic feedback if sound file is not available
 * Only plays if not already playing to prevent spam
 */
export const playRetroSound = async (): Promise<void> => {
  if (isPlayingSound) return;

  try {
    isPlayingSound = true;

    const soundAsset = getSoundAsset();

    if (!soundAsset) {
      // Fallback: Play a distinctive haptic pattern instead
      await haptic.success();
      setTimeout(async () => {
        await haptic.light();
        setTimeout(async () => {
          await haptic.medium();
        }, 100);
      }, 100);

      setTimeout(() => {
        isPlayingSound = false;
      }, 500);
      return;
    }

    // Configure audio session for playback
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Create or reuse sound object
    if (!cachedSound) {
      const { sound } = await Audio.Sound.createAsync(
        soundAsset,
        { shouldPlay: false, volume: 0.5 }
      );
      cachedSound = sound;
    }

    // Play from the beginning
    await cachedSound.setPositionAsync(0);
    await cachedSound.playAsync();

    // Wait for playback to finish (approximately)
    setTimeout(() => {
      isPlayingSound = false;
    }, 2000);

  } catch (error) {
    // Silently fail - easter eggs should never break the app
    console.debug('[EasterEgg] Sound playback failed:', error);
    isPlayingSound = false;
  }
};

/**
 * Unload the cached sound when no longer needed
 * Call this on app background/unmount if desired
 */
export const unloadSound = async (): Promise<void> => {
  if (cachedSound) {
    try {
      await cachedSound.unloadAsync();
      cachedSound = null;
    } catch {
      // Ignore errors during cleanup
    }
  }
};

/**
 * Main easter egg trigger function
 * Checks if conditions are met and triggers the easter egg
 * @returns true if easter egg was triggered
 */
export const triggerEasterEggIfNeeded = async (values: {
  income?: number;
  expenses?: number;
  net?: number;
  total?: number;
}, inCents: boolean = true): Promise<boolean> => {
  // Check if funny mode is enabled first
  const funnyMode = await isFunnyModeEnabled();
  if (!funnyMode) return false;

  // Check if any value hits the magic number
  if (checkForMagicNumber(values, inCents)) {
    await playRetroSound();
    return true;
  }

  return false;
};

/**
 * Easter egg info for display
 */
export const EASTER_EGG_INFO = {
  name: 'N64 Mode',
  description: 'When transaction totals equal $64, you might hear something nostalgic...',
  hint: 'Remember the 64-bit era?',
};
