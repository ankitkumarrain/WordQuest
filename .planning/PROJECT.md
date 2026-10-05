# WordQuest — Project Context & Architecture Contract

## Vision & Product Goal
WordQuest is a commercial-quality casual Android word-search puzzle game. Players explore themed worlds, solve deterministic seed-based word search puzzles, maintain daily streaks, complete missions, and unlock achievements. 

The visual identity is based on **Google Stitch UI/UX specifications**:
- High-contrast Cyber-Arcade Dark Navy theme (`#0B0E1E`)
- Electric Neon Teal accents (`#00F5D4`)
- Arcade Violet highlights (`#9D4EDD`)
- Victory Gold rewards (`#FFD166`)
- Friendly rounded card surfaces (`#161B33`)

## Architecture Principles
1. **Offline-First**: All puzzles, progression, and daily challenges are 100% playable without an internet connection.
2. **Guest-First Onboarding**: No forced account creation; instant anonymous play with optional Google Cloud Save linking later.
3. **Engine Isolation**: Game engine (`/game-engine`) is pure TypeScript with zero React/DOM dependencies, fully testable in Jest.
4. **Virtual Economy Integrity**: Virtual coins only (NO real-money withdrawal, cash-out, or gambling). Coin grants use deterministic idempotent UUIDs (`grant_id`) to prevent duplication.
5. **Non-Intrusive Monetization**: Rewarded video ads are strictly optional at transition checkpoints (2x win coins, second-chance revive, free hints). Zero mid-puzzle popups.
6. **Steady 60 FPS Performance**: Isolated gesture vector raycasting and memoized cells to prevent grid re-rendering during touches.

## Technology Stack
- **Framework**: Expo SDK 57 (React Native 0.86, React 19)
- **Routing**: Expo Router (typed routes in `src/app/`)
- **Language**: TypeScript 6.x (Strict mode)
- **State Management**: Zustand
- **Local Storage**: `expo-sqlite` (new next API)
- **Backend / Cloud**: Firebase Auth (Anonymous + Google Credential Linking), Cloud Firestore, Firebase Analytics & Crashlytics
- **Monetization**: Google AdMob (`react-native-google-mobile-ads`)
- **Icons & Styling**: `@expo/vector-icons`, `expo-font`, centralized design tokens
