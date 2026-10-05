/**
 * Environment configuration with safe fallbacks.
 * Uses EXPO_PUBLIC_* variables in accordance with Expo standards.
 */

export interface EnvConfig {
  appEnv: 'development' | 'staging' | 'production';
  appName: string;
  appVersion: string;
  isDev: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  admob: {
    appId: string;
    rewardedAdUnitId: string;
    bannerAdUnitId: string;
    interstitialAdUnitId: string;
  };
}

export const ENV: EnvConfig = {
  appEnv: (process.env.EXPO_PUBLIC_APP_ENV as EnvConfig['appEnv']) || 'development',
  appName: process.env.EXPO_PUBLIC_APP_NAME || 'WordQuest',
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  isDev: (process.env.EXPO_PUBLIC_APP_ENV || 'development') === 'development',
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyFakeKeyForDevPlaceholder',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wordquest-dev.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'wordquest-dev',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'wordquest-dev.appspot.com',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789012:android:abcdef1234567890',
  },
  admob: {
    // Official Google AdMob sample test IDs for Android development
    appId: process.env.EXPO_PUBLIC_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
    rewardedAdUnitId:
      process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID ||
      'ca-app-pub-3940256099942544/5224354917',
    bannerAdUnitId:
      process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID ||
      'ca-app-pub-3940256099942544/6300978111',
    interstitialAdUnitId:
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID ||
      'ca-app-pub-3940256099942544/1033173712',
  },
};
