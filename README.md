# Jarvis Mobile - React Native App

A production-ready React Native mobile app (iOS + Android) that connects to the claude-dash backend for AI-powered personal productivity.

## Overview

**Jarvis Mobile** is a native mobile companion to the claude-dash web application. It provides full access to:

- AI Chat Assistant (Claude/GPT integration)
- Task & Project Management
- Habit Tracking with Streaks
- Calendar Integration (Google Calendar)
- Finance Dashboard
- Voice Input/Output
- Camera for AI Vision
- Push Notifications
- Offline Mode with Sync

## Architecture

```
┌─────────────────────────────────┐
│   React Native Mobile App       │
│   (jarvis-native)               │
│   - iOS & Android               │
│   - Offline Capable             │
│   - Native Features             │
└─────────────┬───────────────────┘
              │ HTTP/REST
              │ JWT Auth
              ↓
┌─────────────────────────────────┐
│   Next.js Backend               │
│   (claude-dash)                 │
│   - API Routes                  │
│   - NextAuth                    │
│   - AI Integration              │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│   PostgreSQL Database           │
│   - User Data                   │
│   - Tasks, Habits, Finance      │
│   - Calendar Events             │
└─────────────────────────────────┘
```

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** Zustand
- **API Client:** Axios
- **Data Fetching:** TanStack Query (React Query)
- **UI Components:** React Native Paper (Material Design)
- **Storage:** AsyncStorage + Expo SecureStore
- **Native Features:**
  - expo-camera (Camera access)
  - expo-av (Audio/Video)
  - expo-speech (Text-to-speech)
  - expo-notifications (Push notifications)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Running claude-dash backend on `localhost:800`

### Installation

```bash
cd /mnt/d/claude\ dash/jarvis-native
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android

# Run on web (for testing)
npm run web
```

### Connecting to Backend

1. Make sure the claude-dash backend is running on `http://localhost:800`
2. For Android emulator, the backend URL should be `http://10.0.2.2:800`
3. For physical devices, use your computer's local IP address

Update the API base URL in `/src/constants/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://YOUR_IP:800' : 'https://your-production-backend.com',
  // ...
};
```

## Project Structure

```
jarvis-native/
├── App.tsx                 # Main app entry point
├── src/
│   ├── constants/          # App configuration
│   │   └── config.ts       # API endpoints, feature flags
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── services/           # API services
│   │   ├── api.ts          # Base API client with interceptors
│   │   ├── auth.api.ts     # Authentication API
│   │   ├── ai.api.ts       # AI chat API
│   │   └── storage.ts      # Local storage utilities
│   ├── store/              # Global state (Zustand)
│   │   └── authStore.ts    # Authentication state
│   ├── navigation/         # React Navigation
│   │   ├── RootNavigator.tsx   # Auth flow navigation
│   │   └── MainNavigator.tsx   # Bottom tabs navigation
│   ├── screens/            # Screen components
│   │   ├── auth/           # Login, Register
│   │   └── main/           # Dashboard, AI Chat, Tasks, etc.
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, icons
└── docs/                   # Additional documentation
```

## Features

### Phase 1: Core Infrastructure (COMPLETED)

- Expo React Native project setup
- Navigation structure (Stack + Bottom Tabs)
- API client with JWT authentication
- Local storage with AsyncStorage and SecureStore
- Authentication screens (Login/Register)
- TypeScript type system

### Phase 2: Authentication (COMPLETED)

- Login/Register screens
- JWT token management
- Secure token storage
- Session restoration
- Auth state management with Zustand

### Phase 3: AI Chat (COMPLETED)

- Chat interface with message bubbles
- Real-time AI responses
- Text-to-speech for AI responses
- Voice input button (placeholder)
- Session management

### Phase 4: Main Features (IN PROGRESS)

- Dashboard screen with widgets
- Tasks screen (placeholder)
- Habits screen (placeholder)
- Calendar screen (placeholder)
- Finance screen (placeholder)
- Settings screen

### Phase 5: Native Features (TODO)

- Voice input with speech recognition
- Camera integration for AI vision
- Push notifications
- Biometric authentication
- Background sync

### Phase 6: Offline Mode (TODO)

- Cache API responses
- Offline data access
- Sync queue for offline changes
- Conflict resolution

## Development Workflow

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Add route to navigation (`MainNavigator.tsx` or `RootNavigator.tsx`)
3. Create API service if needed in `src/services/`
4. Add types in `src/types/index.ts`

### Adding an API Endpoint

1. Add endpoint to `src/constants/config.ts` in `ENDPOINTS`
2. Create API function in appropriate service file (e.g., `tasks.api.ts`)
3. Use in component with React Query or directly

Example:

```typescript
// src/services/tasks.api.ts
export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    return await apiService.get(ENDPOINTS.TASKS.LIST);
  },
};

// In component
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../services/tasks.api';

const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: tasksApi.getTasks,
});
```

## Backend Integration

### Required Backend Changes

The claude-dash backend needs JWT authentication for mobile clients. Current implementation uses NextAuth with session cookies, which doesn't work for mobile.

**Option 1: Add JWT endpoints** (Recommended)

Add new API routes:
- `POST /api/auth/mobile/login` - Returns JWT tokens
- `POST /api/auth/mobile/register` - Creates user and returns JWT
- `POST /api/auth/mobile/refresh` - Refreshes access token

**Option 2: Use NextAuth with credentials provider**

Configure NextAuth to support JWT mode for mobile clients while keeping session mode for web.

### API Response Format

All API responses should follow this format:

```typescript
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional success message"
}

// Error response
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Testing

### Running on Emulator/Simulator

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android
```

### Testing on Physical Device

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

### Testing API Integration

Use the Settings screen to verify:
- User email and timezone are displayed
- Logout works properly

Use the AI Chat screen to verify:
- Messages send successfully
- Responses are received
- Session ID persists across messages

## Building for Production

### Android APK

```bash
# Build APK for Android
expo build:android

# Or with EAS Build (recommended)
eas build --platform android
```

### iOS App

```bash
# Build for iOS (requires Mac and Apple Developer account)
eas build --platform ios
```

### Environment Variables

Create `.env` file:

```env
API_BASE_URL=https://your-backend.com
SENTRY_DSN=your-sentry-dsn
```

## Troubleshooting

### Cannot connect to backend

- Verify backend is running on `localhost:800`
- For Android emulator, use `http://10.0.2.2:800`
- For physical device, use computer's local IP
- Check firewall settings

### Authentication errors

- Verify backend has JWT endpoints
- Check token expiration
- Clear app data: Settings > Clear Storage

### Build errors

```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

1. **Implement Backend JWT Auth**
   - Add JWT authentication endpoints to claude-dash
   - Test login/register from mobile app

2. **Complete Core Features**
   - Tasks CRUD operations
   - Habits tracking and streaks
   - Calendar event sync
   - Finance data display

3. **Add Native Features**
   - Voice input integration
   - Camera for AI vision
   - Push notifications
   - Biometric auth

4. **Offline Support**
   - Implement caching strategy
   - Add sync queue
   - Handle conflicts

5. **Polish & Testing**
   - Error handling
   - Loading states
   - Performance optimization
   - User testing

## Contributing

This is a personal productivity app. For bug reports or feature requests, please create an issue.

## License

Private - Not for distribution

---

**Status:** Phase 1 Complete - Ready for backend integration testing

**Last Updated:** December 7, 2025
