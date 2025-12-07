/**
 * Application Configuration
 * Centralized config for API endpoints, app settings, and feature flags
 */

// Backend API Configuration
export const API_CONFIG = {
  // Default to localhost for development
  // In production, this should point to your deployed backend
  BASE_URL: __DEV__ ? 'http://localhost:800' : 'https://your-backend.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Jarvis',
  VERSION: '1.0.0',
  DEFAULT_TIMEZONE: 'America/Chicago',
  DEFAULT_CURRENCY: 'USD',
};

// Feature Flags
export const FEATURES = {
  AI_CHAT: true,
  VOICE_INPUT: true,
  CAMERA_VISION: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  BIOMETRIC_AUTH: false, // TODO: Implement in Phase 4
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/sessions',
  },

  // AI Features
  AI: {
    CHAT: '/api/ai/copilot',
    NL_CAPTURE: '/api/ai/nl-capture',
  },

  // Tasks & Projects
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },

  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
  },

  // Habits
  HABITS: {
    LIST: '/api/habits',
    CREATE: '/api/habits',
    UPDATE: (id: string) => `/api/habits/${id}`,
    DELETE: (id: string) => `/api/habits/${id}`,
    LOG: (id: string) => `/api/habits/${id}/log`,
    STREAK: (id: string) => `/api/habits/${id}/streak`,
  },

  // Calendar
  CALENDAR: {
    EVENTS: '/api/calendar/events',
    SYNC: '/api/calendar/sync',
    AVAILABLE_SLOTS: '/api/calendar/available-slots',
  },

  // Finance
  FINANCE: {
    SUMMARY: '/api/finance/summary',
    ASSETS: '/api/finance/assets',
    LIABILITIES: '/api/finance/liabilities',
    CASHFLOW: '/api/finance/cashflow',
    BUDGETS: '/api/finance/budgets',
  },

  // Metrics & Dashboard
  METRICS: {
    TODAY: '/api/metrics/today',
    TRENDS: '/api/metrics/trends',
  },
};
