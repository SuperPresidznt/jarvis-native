/**
 * Application Configuration
 * Centralized config for API endpoints, app settings, and feature flags
 */

// Backend API Configuration
export const API_CONFIG = {
  // Use local IP for both dev and release builds during testing
  // Change this to your deployed backend URL when ready for production
  BASE_URL: 'http://172.27.178.137:800',
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
  NAME: '[APP_NAME]', // TODO: Replace with final app name
  VERSION: '1.0.0',
  DEFAULT_TIMEZONE: 'America/Chicago',
  DEFAULT_CURRENCY: 'USD',
};

// Legal URLs (TODO: Replace with your hosted URLs)
export const LEGAL_URLS = {
  PRIVACY_POLICY: 'https://example.com/privacy', // TODO: Replace with actual URL
  TERMS_OF_SERVICE: 'https://example.com/terms', // TODO: Replace with actual URL
  SUPPORT_EMAIL: 'support@example.com', // TODO: Replace with actual email
};

// Feature Flags
export const FEATURES = {
  AI_CHAT: true,
  VOICE_INPUT: true,
  CAMERA_VISION: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  BIOMETRIC_AUTH: false, // TODO: Implement in Phase 4
  DEMO_MODE: true, // Skip login and use mock data for testing
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/mobile/login',
    REGISTER: '/api/auth/mobile/register',
    REFRESH: '/api/auth/mobile/refresh',
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
