# Phase 5 Plan: Firebase Auth & Cloud Sync (Adapter & Offline-First Sync Engine)

## Objective
Implement a robust, production-ready Cloud Authentication and Data Synchronization architecture for WordQuest. The system operates on an **Adapter Pattern** that seamlessly runs on **Mock Services** during development (with zero API keys required) and smoothly switches to **Live Firebase/Firestore** once valid API keys are configured in `.env`.

## Planned Architecture

### 1. Authentication Layer (`src/services/auth/`)
- `types.ts`:
  - `AuthUser`: User profile with `uid`, `isAnonymous`, `displayName`, `email`, `photoURL`, `providerId`.
  - `IAuthService`: Standard contract (`signInGuest`, `signInGoogle`, `linkGoogleAccount`, `signOut`, `getCurrentUser`, `onAuthStateChanged`).
- `MockAuthService.ts`:
  - Fully simulated offline/local auth manager with persistence.
  - Supports anonymous guest generation (`guest_<uuid>`), credential upgrade/linking to Google (`user_<uuid>`), realistic async delays.
- `FirebaseAuthService.ts`:
  - Firebase JS/REST integration for production.
- `AuthFactory.ts`:
  - Automatic detection: If `ENV.firebase.apiKey` contains the dev placeholder or keys are unconfigured, initializes `MockAuthService`; otherwise connects to `FirebaseAuthService`.

### 2. Cloud Sync & Conflict Resolution (`src/services/sync/`)
- `ConflictResolver.ts`:
  - Pure deterministic algorithm resolving multi-device discrepancies:
    - **Level Progression**: Highest Stars win; for equal stars, lowest Best Time wins.
    - **Virtual Inventory & Ledger**: Idempotent union based on unique `grant_id`.
    - **Daily Challenges**: Union of distinct completion dates (`YYYY-MM-DD`).
- `SyncQueueRepository.ts` (`src/database/repositories/`):
  - Manages SQLite `sync_queue` table (enqueue mutations, fetch pending items, acknowledge/delete synced items).
- `types.ts` & `ICloudSyncService.ts`:
  - Standard sync interface (`uploadProgression`, `downloadProgression`, `pushMutationBatch`).
- `MockCloudSyncService.ts` & `FirestoreSyncService.ts`:
  - Remote storage simulation vs production Firestore collection (`users/{uid}/...`).
- `SyncQueueWorker.ts`:
  - Background process that flushes local pending mutations to cloud and updates `useSyncStore`.

### 3. Screen Integration & UI Wireup
- `src/app/auth-choice.tsx`:
  - Connect "Play as Guest" to `AuthFactory.getInstance().signInGuest()`.
  - Connect "Continue with Google" to `AuthFactory.getInstance().signInGoogle()`.
- `src/app/settings.tsx` & Profile:
  - Display active user badge (Guest vs Google Linked).
  - "Link Google Account" button for guest players to safeguard progress.
  - "Sync Now" button with reactive status indicator.

### 4. Firestore Production Security Rules (`firestore.rules`)
- Declarative rules enforcing:
  - User documents: `request.auth.uid == uid`.
  - Immutable grants: `allow create` only if ID not existing, `allow update, delete: if false`.

### 5. Automated Testing & Verification
- `tests/services/auth.test.ts`: Guest login, account upgrading, session listener.
- `tests/services/conflictResolver.test.ts`: Deterministic progression comparison, star/time ties, reward deduplication.
- `tests/services/syncQueue.test.ts`: Queue lifecycle, batching, error recovery.
- Verification pipeline: `npm test`, `npx tsc --noEmit`.
