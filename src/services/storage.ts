/**
 * Storage Service
 * Handles secure local storage using AsyncStorage and SecureStore
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AUTH_CONFIG } from '../constants/config';
import { User } from '../types';

// Sensitive data (tokens) stored in SecureStore
// Non-sensitive data (user info, cache) stored in AsyncStorage

/**
 * Token Management
 */
export const saveToken = async (token: string, type: 'access' | 'refresh' = 'access'): Promise<void> => {
  const key = type === 'access' ? AUTH_CONFIG.TOKEN_KEY : AUTH_CONFIG.REFRESH_TOKEN_KEY;
  await SecureStore.setItemAsync(key, token);
};

export const getToken = async (type: 'access' | 'refresh' = 'access'): Promise<string | null> => {
  const key = type === 'access' ? AUTH_CONFIG.TOKEN_KEY : AUTH_CONFIG.REFRESH_TOKEN_KEY;
  return await SecureStore.getItemAsync(key);
};

export const clearTokens = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_CONFIG.REFRESH_TOKEN_KEY);
};

/**
 * User Data Management
 */
export const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem(AUTH_CONFIG.USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_CONFIG.USER_KEY);
};

/**
 * Generic Storage Operations
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

export const getItem = async (key: string): Promise<string | null> => {
  return await AsyncStorage.getItem(key);
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const setObject = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getObject = async <T>(key: string): Promise<T | null> => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Cache Management for Offline Mode
 */
export const setCacheData = async <T>(key: string, data: T, expirationMinutes?: number): Promise<void> => {
  const cacheItem = {
    data,
    timestamp: Date.now(),
    expiration: expirationMinutes ? Date.now() + expirationMinutes * 60 * 1000 : null,
  };
  await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
};

export const getCacheData = async <T>(key: string): Promise<T | null> => {
  const cached = await AsyncStorage.getItem(`cache_${key}`);
  if (!cached) return null;

  const cacheItem = JSON.parse(cached);

  // Check if expired
  if (cacheItem.expiration && Date.now() > cacheItem.expiration) {
    await AsyncStorage.removeItem(`cache_${key}`);
    return null;
  }

  return cacheItem.data;
};

export const clearCache = async (): Promise<void> => {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter(key => key.startsWith('cache_'));
  await AsyncStorage.multiRemove(cacheKeys);
};

/**
 * Clear All Data (logout)
 */
export const clearAllData = async (): Promise<void> => {
  await clearTokens();
  await clearUser();
  await clearCache();
};
