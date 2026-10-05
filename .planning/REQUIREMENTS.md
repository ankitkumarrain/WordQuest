# WordQuest — Scoped Requirements Matrix

## 1. Project Foundation (Phase 1)
- [x] **REQ-FND-01**: Expo SDK 57 + React Native 0.86 + React 19 setup.
- [x] **REQ-FND-02**: Expo Router file-based typed navigation skeleton.
- [x] **REQ-FND-03**: Strict TypeScript configuration (`npx tsc --noEmit` passing with 0 errors).
- [x] **REQ-FND-04**: ESLint flat config & Prettier formatting (0 errors, 0 warnings).
- [x] **REQ-FND-05**: Centralized Stitch design tokens (colors, typography, spacing, radius, shadows).
- [x] **REQ-FND-06**: Reusable atomic UI components (Button, Card, CoinBadge, ProgressBar, Avatar, BottomTabBar, Modal).
- [x] **REQ-FND-07**: Reusable feedback components (LoadingState, EmptyState, ErrorState).
- [x] **REQ-FND-08**: 24-Screen navigation skeleton with valid deep-link paths.
- [x] **REQ-FND-09**: Native build readiness (`app.json` Android package `com.wordquest.casualgame`, permissions, `expo-doctor` 21/21 checks passing).

## 2. Pure Game Engine Core (Phase 2)
- [ ] **REQ-ENG-01**: Seedable PRNG (Xoshiro128+/PCG) for deterministic puzzles.
- [ ] **REQ-ENG-02**: 8-Directional word placer (Horizontal, Vertical, Diagonal forward & backward).
- [ ] **REQ-ENG-03**: Character collision & intersection detection algorithm.
- [ ] **REQ-ENG-04**: Weighted alphabet filler for balanced letter distribution.
- [ ] **REQ-ENG-05**: Vector raycaster calculating start-to-end swipe line in $O(1)$ without zig-zags.
- [ ] **REQ-ENG-06**: Solvability validator & word density analyzer.
- [ ] **REQ-ENG-07**: Booster logic (Hint letter locator, Shuffle filler re-arranger, Reveal solver).
- [ ] **REQ-ENG-08**: 100% Jest unit test coverage for engine modules.

## 3. Gestures & Gameplay Arena (Phase 3)
- [ ] **REQ-GMP-01**: 60 FPS gesture-driven swipe grid with touch tolerance.
- [ ] **REQ-GMP-02**: Vector capsule selection overlay (SVG/Skia).
- [ ] **REQ-GMP-03**: Real-time letter highlighting and word completion detection.
- [ ] **REQ-GMP-04**: Audio chord synthesis / pitch progression upon finding consecutive words.
- [ ] **REQ-GMP-05**: Tactile haptic click on crossing each letter coordinate.
- [ ] **REQ-GMP-06**: Word goal chips strikethrough animation.
- [ ] **REQ-GMP-07**: Arena pause, resume, and restart controls.

## 4. State Management & Offline SQLite (Phase 4)
- [ ] **REQ-STA-01**: Zustand stores (`useGameStore`, `usePlayerStore`, `useMetaStore`, `useSyncStore`).
- [ ] **REQ-STA-02**: SQLite schema & migrations (player_profile, level_progression, reward_grants, daily_challenges).
- [ ] **REQ-STA-03**: Idempotent coin reward ledger with UUID keys.
- [ ] **REQ-STA-04**: 7-Day daily streak & challenge state persistence.
- [ ] **REQ-STA-05**: Mission and achievement progress evaluator.

## 5. Firebase Authentication & Cloud Sync (Phase 5)
- [x] **REQ-CLD-01**: Anonymous authentication for instant guest gameplay.
- [x] **REQ-CLD-02**: Optional Google Sign-In with credential linking (`linkWithCredential`).
- [x] **REQ-CLD-03**: Firestore cloud save synchronization with conflict resolution (Highest Star / Best Time wins).
- [x] **REQ-CLD-04**: Production Firestore security rules enforcing owner-only and immutable ledgers.
- [x] **REQ-CLD-05**: Offline queue worker synchronizing when network reconnects.

## 6. Monetization, Analytics & Release Polish (Phase 6)
- [x] **REQ-MON-01**: Abstracted `IAdService` with `AdMobManager` and `MockAdService`.
- [x] **REQ-MON-02**: Rewarded video ad flows (Level complete 2x coins, Second chance revive, Free hint).
- [x] **REQ-MON-03**: Firebase Analytics tracking key gameplay telemetry.
- [x] **REQ-MON-04**: Firebase Crashlytics error boundary and crash reporter.
- [x] **REQ-MON-05**: Android release profiling and APK/AAB build readiness.
