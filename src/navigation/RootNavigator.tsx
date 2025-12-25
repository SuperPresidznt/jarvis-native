/**
 * Root Navigator
 * Handles authentication flow and main app navigation
 */

import React, { useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { RootStackParamList } from '../types';
import { FEATURES } from '../constants/config';
import { linking } from './linking';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainNavigator from './MainNavigator';
import SearchScreen from '../screens/SearchScreen';
import OnboardingFlow from '../screens/onboarding/OnboardingFlow';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  navigationRef?: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
}

export default function RootNavigator({ navigationRef }: RootNavigatorProps) {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const { isOnboardingComplete, isLoading: isOnboardingLoading } = useOnboarding();

  useEffect(() => {
    // Skip session restore in demo mode
    if (!FEATURES.DEMO_MODE) {
      restoreSession();
    }
  }, []);

  // Show loading while checking onboarding and auth status
  if ((isLoading && !FEATURES.DEMO_MODE) || isOnboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show onboarding flow for first-time users
  if (!isOnboardingComplete) {
    return (
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding">
            {() => (
              <OnboardingFlow
                onComplete={() => {
                  // Navigation will automatically update when onboarding completes
                  console.log('[RootNavigator] Onboarding completed');
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 250,
        }}
      >
        {(isAuthenticated || FEATURES.DEMO_MODE) ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{
                presentation: 'modal',
                headerShown: false,
                animation: 'slide_from_bottom',
                animationDuration: 300,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
