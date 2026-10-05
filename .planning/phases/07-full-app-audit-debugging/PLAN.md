# Phase 7 Plan: Full App End-to-End Audit & Interactive Feature Debugging

## Objective
Execute a comprehensive, systematic audit and debugging cycle across all 25 screens and subsystems of WordQuest to ensure zero runtime exceptions, seamless navigation, responsive touch/gesture interactions (including drag and tap-to-toggle word selection), reliable persistence (SQLite + Zustand), working monetization/ads, and audio-tactile feedback on live Android hardware.

---

## Screen & Feature Audit Matrix

### Wave 1: Onboarding, Authentication & Core Shell
| Screen / Module | Route | Critical Paths & Verification Points | Target Status |
| :--- | :--- | :--- | :--- |
| **Root Router** | `src/app/index.tsx` | Route to onboarding or home based on profile existence in SQLite. | ⬜ Ready to test |
| **Onboarding** | `src/app/onboarding.tsx` | 3-step carousel, pagination dots, "Get Started" navigation to auth-choice. | ⬜ Ready to test |
| **Auth Choice** | `src/app/auth-choice.tsx` | "Play as Guest" creates guest profile; "Continue with Google" runs mock/firebase flow and routes to `/(tabs)`. | ⬜ Ready to test |
| **Tab Shell** | `src/app/(tabs)/_layout.tsx` | Custom `BottomTabBar`, active indicator glow, haptic feedback on tab press. | ⬜ Ready to test |
| **Home Screen** | `src/app/(tabs)/index.tsx` | Daily greeting, level card CTA, streak pill, coin badge, navigation to all game modes. | ⬜ Ready to test |

### Wave 2: Gameplay Arena & Gesture Mechanics
| Screen / Module | Route | Critical Paths & Verification Points | Target Status |
| :--- | :--- | :--- | :--- |
| **Level Start** | `src/app/level-start.tsx` | Difficulty badge, boosters inventory count, "START PUZZLE" button passing level params. | ⬜ Ready to test |
| **Gameplay Arena** | `src/app/gameplay.tsx` | Puzzle generation, countdown timer, pause button, word chips checkmarks. | ⬜ Ready to test |
| **Word Search Grid** | `src/game/GridView.tsx` | **Drag-to-select** (smooth diagonal/straight ray selection) & **Tap-to-toggle** (tap start cell, tap end cell to select; tap again to deselect). | ⬜ Ready to test |
| **Selection Overlay**| `src/game/SelectionOverlay.tsx` | Centered vector capsules, permanent found words lines, active drag line. | ⬜ Ready to test |
| **Booster Controls** | `src/game/BoosterControls.tsx` | Hint (highlights letter), Shuffle (re-arranges filler), Reveal (solves full word). | ⬜ Ready to test |
| **Pause Screen** | `src/app/pause.tsx` | Timer stop, "Resume", "Restart Level", "Settings", "Quit to Menu" modal confirmation. | ⬜ Ready to test |

### Wave 3: Game Outcomes & Economy Loop
| Screen / Module | Route | Critical Paths & Verification Points | Target Status |
| :--- | :--- | :--- | :--- |
| **Level Complete** | `src/app/level-complete.tsx` | Star rating calculation, score summary, "Claim 2x Coins" with rewarded video ad, "Next Level" navigation. | ⬜ Ready to test |
| **Level Failed** | `src/app/level-failed.tsx` | Timer expired modal, "Watch Ad (+60s Revive)", "Retry Level" navigation. | ⬜ Ready to test |
| **Coin Shop** | `src/app/coin-shop.tsx` | Coin balance display, free daily coins (ad rewarded), booster bundle purchases using virtual coins. | ⬜ Ready to test |
| **Reward Ledger** | `src/database/repositories/RewardLedgerRepository.ts` | Idempotent UUID reward grants, no double-credit exploits across runs. | ⬜ Ready to test |

### Wave 4: Game Modes & Progression
| Screen / Module | Route | Critical Paths & Verification Points | Target Status |
| :--- | :--- | :--- | :--- |
| **World Map** | `src/app/(tabs)/world-map.tsx` | World nodes (Forest, Ocean, Cosmos, Desert), unlock thresholds, star counts. | ⬜ Ready to test |
| **Daily Challenge** | `src/app/daily-challenge.tsx` | Calendar date-seeded puzzle, 7-day streak tracker, daily rewards claim. | ⬜ Ready to test |
| **Category Mode** | `src/app/category.tsx` | Category cards (Animals, Nature, Cosmos, Science), level progression per category. | ⬜ Ready to test |
| **Difficulty Picker**| `src/app/difficulty.tsx` | Easy (8x8), Medium (9x9), Hard (10x10), Expert (11x11) grid configurations. | ⬜ Ready to test |
| **Missions** | `src/app/missions.tsx` | Daily and weekly mission objectives, progress bars, claimable coin rewards. | ⬜ Ready to test |
| **Achievements** | `src/app/achievements.tsx` | Milestone badges, tier unlocks, progress counters. | ⬜ Ready to test |
| **Statistics** | `src/app/statistics.tsx` | Puzzles solved, words found, win rate, best time per difficulty. | ⬜ Ready to test |

### Wave 5: Meta, Audio/Haptics & Settings
| Screen / Module | Route | Critical Paths & Verification Points | Target Status |
| :--- | :--- | :--- | :--- |
| **Profile** | `src/app/(tabs)/profile.tsx` | Avatar customization, player statistics overview, Google account link CTA. | ⬜ Ready to test |
| **Rewards Hub** | `src/app/(tabs)/rewards.tsx` | Streak calendar, daily login chest, mission shortcuts. | ⬜ Ready to test |
| **Settings** | `src/app/settings.tsx` | Sound FX toggle, Ambient Music toggle, Vibration Haptic toggle, Cloud Sync Now button, account linking. | ⬜ Ready to test |
| **Support Pages** | `how-to-play`, `help`, `privacy`, `terms` | Static content render, back button navigation stack integrity. | ⬜ Ready to test |

---

## Systematic Execution Steps

### Step 1: Automated Health & Architecture Verification
- Run `npx tsc --noEmit` to verify type safety across all files.
- Run `npx expo lint` to guarantee clean AST with zero rule violations.
- Run `npm test` to execute all 50 unit tests across the 12 test suites.

### Step 2: Live Device Navigation & Screen Crawl
- Execute live navigation traversal across all routes using `adb shell am start` and UI automation taps.
- Verify screen mounting without React console warnings or `Cannot update component during render` errors.
- Confirm Android back navigation (`hardwareBackPress`) correctly pops modal screens and stacks without crashing.

### Step 3: Interactive Gameplay & Input Mechanics Audit
- Validate dual input modes:
  - **Swipe / Drag mode**: Touch down, drag across straight lines, lift to match.
  - **Tap-to-select / Toggle mode**: Tap start cell (highlights), tap end cell (matches word), tap same cell (unselects/toggles off).
- Test booster interactions: Hint highlights a remaining letter, Shuffle updates filler letters, Reveal completes a target word.
- Test game timer countdown and zero-second transition to Level Failed screen.

### Step 4: Storage & State Persistence Verification
- Verify SQLite database reads/writes (`player_profile`, `inventory`, `level_progression`, `reward_grants`).
- Test state persistence across app reloads (coins, inventory, streak count).
- Test Settings audio/haptic toggles reflecting immediately in `AudioService` and `HapticService`.

### Step 5: Production Build Readiness
- Verify `app.json` configuration, permissions (`INTERNET`, `ACCESS_NETWORK_STATE`, `VIBRATE`), icon assets, and splash screens.
- Run `npx expo-doctor` to ensure 100% dependency compatibility.
