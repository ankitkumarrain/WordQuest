# Phase 4 Plan: Local Database & State Persistence (SQLite + Zustand)

## Objective
Establish an offline-first, idempotent persistence tier for WordQuest combining high-speed reactive UI state (Zustand) with durable, transactional SQL storage (`expo-sqlite`).

## Planned Architecture

### 1. SQLite Relational Schema (`src/database/`)
- `schema.ts`: DDL statements and migration versioning.
  - `player_profile`: Guest ID, username, avatar, creation date.
  - `inventory`: Coins, hint boosters, shuffle boosters, reveal boosters.
  - `level_progression`: Level ID, category, stars (1-3), high score, best time, completion timestamp.
  - `reward_grants`: Idempotent UUID-keyed ledger preventing duplicate coins or reward fraud across re-launches.
  - `daily_challenges`: Daily puzzle completion records by `YYYY-MM-DD`.
  - `sync_queue`: Offline-first mutations ready to flush to Firestore in Phase 5.
- `db.ts`: Async database initialization with PRAGMA `journal_mode = WAL` and foreign key enforcement.
- Repositories:
  - `PlayerRepository.ts`: CRUD for player profile & inventory.
  - `ProgressionRepository.ts`: Level score, stars, unlock progression queries.
  - `RewardLedgerRepository.ts`: Transactional idempotent grant insertion.
  - `DailyChallengeRepository.ts`: Daily streak & challenge tracking.

### 2. Reactive Zustand Stores (`src/store/`)
- `usePlayerStore.ts`: Coins, boosters, sound/haptic toggles, player profile, hydrating on app launch.
- `useGameStore.ts`: In-game active puzzle session, timer, found words, streak multiplier.
- `useMetaStore.ts`: 7-day daily streak status, missions, achievements.
- `useSyncStore.ts`: Offline queue status, syncing flag, last sync timestamp.

### 3. Business Logic Engines (`src/services/`)
- `StreakService.ts`: Calendar-aware consecutive day calculator for the 7-day reward ladder.
- `RewardService.ts`: Atomic coin credit verifying grant uniqueness against SQLite ledger.

### 4. Verification & Testing
- Unit tests:
  - `tests/services/streak.test.ts`: Consecutive days, missed days reset, day-rollover edge cases.
  - `tests/services/rewardLedger.test.ts`: Idempotency verification (double-credit rejection).
- Lint & TypeScript verification: `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor`.
