/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../services/auth.api';
import { saveToken, saveUser, clearAllData, getUser, getToken } from '../services/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authApi.login(credentials);

      // Save tokens and user data
      await saveToken(tokens.accessToken, 'access');
      await saveToken(tokens.refreshToken, 'refresh');
      await saveUser(user);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, tokens } = await authApi.register(data);

      // Save tokens and user data
      await saveToken(tokens.accessToken, 'access');
      await saveToken(tokens.refreshToken, 'refresh');
      await saveUser(user);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (error) {
      // Continue logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      await clearAllData();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const [user, token] = await Promise.all([getUser(), getToken('access')]);

      if (user && token) {
        // Verify token is still valid by fetching session
        try {
          const sessionUser = await authApi.getSession();
          set({ user: sessionUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          // Token invalid, clear data
          await clearAllData();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Session restore error:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
