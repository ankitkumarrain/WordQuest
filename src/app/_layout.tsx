import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useMetaStore } from '@/store/useMetaStore';
import { AudioService } from '@/services/AudioService';

export default function RootLayout() {
  useEffect(() => {
    usePlayerStore.getState().hydrate();
    useMetaStore.getState().refreshMeta();
    AudioService.startAmbientMusic().catch((err) =>
      console.warn('BGM start warning:', err)
    );

    if (process.env.NODE_ENV !== 'test') {
      mobileAds()
        .setRequestConfiguration({
          testDeviceIdentifiers: ['B7E3DC467CFDEF6627CCFEC1C5F9391B'],
        })
        .then(() => mobileAds().initialize())
        .catch((err) => console.warn('MobileAds init error:', err));
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth-choice" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="category" />
        <Stack.Screen name="difficulty" />
        <Stack.Screen name="level-start" options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="gameplay" options={{ gestureEnabled: false }} />
        <Stack.Screen name="pause" options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="level-complete" options={{ presentation: 'modal' }} />
        <Stack.Screen name="level-failed" options={{ presentation: 'modal' }} />
        <Stack.Screen name="daily-challenge" />
        <Stack.Screen name="missions" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="coin-shop" options={{ presentation: 'modal' }} />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="how-to-play" />
        <Stack.Screen name="help" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
      </Stack>
    </>
  );
}
