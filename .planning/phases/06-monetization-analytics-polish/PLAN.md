# Phase 6 Plan: Google AdMob, Analytics & Release Polish

## Objective
Deliver production-grade, non-intrusive monetization via rewarded video ads (`IAdService`), gameplay telemetry & crash tracking (`AnalyticsService`), and finalize Android release configuration.

## Planned Architecture

### 1. Abstracted Ad Services (`src/services/ads/`)
- `types.ts`:
  - `AdPlacement`: `'double_coins' | 'revive' | 'free_hint' | 'shop_coins'`.
  - `AdRewardResult`: `{ rewarded: boolean; type?: string; amount?: number; error?: string }`.
  - `IAdService`: `isRewardedReady()`, `showRewardedAd(placement)`, `preloadRewardedAd()`.
- `MockAdService.ts`:
  - Simulated video player timer with guaranteed deterministic completion for dev & testing.
- `AdMobManager.ts`:
  - Configured with official Google AdMob test IDs from `ENV.admob`.
- `AdFactory.ts`:
  - Returns singleton instance of `IAdService`.

### 2. Analytics & Crashlytics (`src/services/analytics/`)
- `types.ts`:
  - Standard gameplay telemetry events:
    - `level_start`: `{ level, category, difficulty }`
    - `level_complete`: `{ level, score, stars, time_seconds }`
    - `level_fail`: `{ level, words_found, time_expired }`
    - `booster_used`: `{ booster_type, level }`
    - `ad_rewarded`: `{ placement, reward_amount }`
    - `streak_claimed`: `{ day, streak_count }`
- `AnalyticsService.ts`:
  - Telemetry pipeline logging events with structured payloads and Crashlytics breadcrumb recording.

### 3. Screen Integrations
- `src/app/level-complete.tsx`:
  - Wire "Watch Ad (2x Coins)" to `AdFactory.getInstance().showRewardedAd('double_coins')`.
  - Atomically credit bonus coins through `RewardService.claimReward()`.
- `src/app/level-failed.tsx`:
  - Wire "Watch Ad & Continue" to `AdFactory.getInstance().showRewardedAd('revive')`.
- `src/app/coin-shop.tsx`:
  - Wire free rewarded video coins to `RewardService`.

### 4. Verification & Testing
- `tests/services/ads.test.ts`: Verifies rewarded ad flow, reward completion, placement tracking.
- `tests/services/analytics.test.ts`: Verifies event formatting, parameter validation, and user property setting.
- Clean pipeline: `npm test`, `npm run typecheck`, `npx expo-doctor`.
