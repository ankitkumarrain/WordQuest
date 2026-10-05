# WordQuest 🌿

A premium, casual word search mobile game built with **Expo SDK 57**, **React Native 0.86**, and **React 19**. Features an organic **Greenery & Nature visual experience** with scenic backgrounds, tactile 3D wood tiles, offline persistence via SQLite, dynamic audio effects, and non-intrusive AdMob monetization.

---

## ✨ Features

- 🌲 **Lush Nature Visuals**: Sunlit forest canopies and alpine mountain meadows with frosted-glass scrims for optimal letter legibility.
- 🧩 **Pure TypeScript Game Engine**: Deterministic puzzle generation with seedable PRNG (Xoshiro128+), 8-directional word placement, and $O(1)$ vector raycasting for swipe selection.
- 🔊 **Dynamic Audio & Haptics**: 12 custom sound effects for word finding, tile dragging, level completion, and booster activations.
- 💾 **100% Offline-First**: Local database persistence powered by SQLite (`expo-sqlite`) and fast reactive state management via Zustand.
- 🎯 **Rich Progression**: 10 Unique Worlds, Daily Challenges with streaks, Categories, Achievements, and in-game Coin Economy.
- 🛡️ **Monetization & Privacy**: Google AdMob rewarded videos at natural reward points (no intrusive mid-game banners); guest-first onboarding with zero mandatory sign-up.

---

## 🛠️ Tech Stack

- **Framework**: Expo SDK 57, React Native 0.86, React 19
- **Navigation**: Expo Router (Typed file-based routing)
- **State Management**: Zustand
- **Database**: SQLite (`expo-sqlite`)
- **Audio & Haptics**: `expo-audio`, `expo-haptics`
- **Monetization**: `react-native-google-mobile-ads`
- **Testing**: Jest (70/70 tests passing across 14 test suites)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Android Studio / ADB for physical device testing

### Installation

```bash
# Clone the repository
git clone https://github.com/ankitkumarrain/WordQuest.git
cd WordQuest

# Install dependencies
npm install
```

### Running Locally

```bash
# Start dev server
npx expo start

# Run on connected Android device
npx expo run:android

# Run TypeScript checks
npx tsc --noEmit

# Run unit tests
npm test
```

---

## 📱 Release & Play Store Build

To compile a release Android App Bundle (`.aab`):

```bash
# Export bundled JS and assets
npx expo export:embed --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# Build release bundle
cd android && ./gradlew bundleRelease
```

---

## 📄 License

MIT License. See [LICENSE](file:///d:/Desktop/plugins/LICENSE) for details.
