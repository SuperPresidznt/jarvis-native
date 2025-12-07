/**
 * Authentication API Service
 * Handles login, register, and session management
 */

import { ENDPOINTS } from '../constants/config';
import { LoginCredentials, RegisterData, User, AuthTokens } from '../types';
import apiService from './api';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    return await apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    return await apiService.post(ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Get current user session
   */
  getSession: async (): Promise<User> => {
    return await apiService.get(ENDPOINTS.AUTH.SESSION);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    return await apiService.post(ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    return await apiService.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },
};
