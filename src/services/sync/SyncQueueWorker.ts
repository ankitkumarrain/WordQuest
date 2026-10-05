import { SyncQueueRepository } from '@/database/repositories/SyncQueueRepository';
import { ProgressionRepository } from '@/database/repositories/ProgressionRepository';
import { PlayerRepository } from '@/database/repositories/PlayerRepository';
import { RewardLedgerRepository } from '@/database/repositories/RewardLedgerRepository';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { AuthFactory } from '@/services/auth/AuthFactory';
import { SyncFactory } from './SyncFactory';
import { ConflictResolver } from './ConflictResolver';
import { CloudSyncPayload } from './types';
import { useSyncStore } from '@/store/useSyncStore';

export class SyncQueueWorker {
  private static isSyncing = false;

  /**
   * Triggers processing of the offline mutation queue and syncs local state with Cloud.
   */
  static async processQueue(targetUid?: string): Promise<{
    success: boolean;
    syncedCount: number;
    error?: string;
  }> {
    if (this.isSyncing) {
      return { success: false, syncedCount: 0, error: 'Sync already in progress' };
    }

    const uid = targetUid || AuthFactory.getInstance().getCurrentUser()?.uid;
    if (!uid) {
      // Not logged in or guest not initialized yet
      return { success: true, syncedCount: 0 };
    }

    this.isSyncing = true;
    useSyncStore.getState().setStatus('syncing');

    try {
      const syncService = SyncFactory.getInstance();
      const pendingMutations = await SyncQueueRepository.getPending(50);
      useSyncStore.getState().setPendingMutations(pendingMutations.length);

      // 1. Gather Local SQLite Snapshot
      const localProgression = await ProgressionRepository.getAllProgress();
      const localInventory = await PlayerRepository.getInventory();
      const localGrants = await RewardLedgerRepository.getGrantHistory(100);
      const localDailyDates = await DailyChallengeRepository.getAllCompletedDates();
      const localProfile = await PlayerRepository.getProfile();

      // 2. Fetch Remote Snapshot from Cloud
      const remoteSnapshot = await syncService.fetchCloudData(uid);

      let finalPayload: CloudSyncPayload;

      if (remoteSnapshot) {
        // 3. Resolve potential conflicts using deterministic rules
        const resolution = ConflictResolver.resolveAll(
          {
            progression: localProgression,
            inventory: localInventory,
            grants: localGrants,
            dailyChallenges: localDailyDates,
          },
          {
            progression: remoteSnapshot.progression,
            inventory: remoteSnapshot.inventory,
            grants: remoteSnapshot.grants,
            dailyChallenges: remoteSnapshot.dailyChallenges,
          }
        );

        // Apply any higher-ranking remote levels to local SQLite
        for (const record of resolution.mergedProgression) {
          await ProgressionRepository.upsertLevelProgress(record);
        }

        finalPayload = {
          profile: localProfile
            ? {
                username: localProfile.username,
                avatar: localProfile.avatar,
                isAnonymous: localProfile.isAnonymous,
                updatedAt: localProfile.updatedAt,
              }
            : undefined,
          progression: resolution.mergedProgression,
          inventory: resolution.mergedInventory,
          grants: resolution.mergedGrants,
          dailyChallenges: resolution.mergedDailyChallenges,
          syncedAt: Date.now(),
        };
      } else {
        // First cloud upload for this user
        finalPayload = {
          profile: localProfile
            ? {
                username: localProfile.username,
                avatar: localProfile.avatar,
                isAnonymous: localProfile.isAnonymous,
                updatedAt: localProfile.updatedAt,
              }
            : undefined,
          progression: localProgression,
          inventory: localInventory,
          grants: localGrants,
          dailyChallenges: localDailyDates,
          syncedAt: Date.now(),
        };
      }

      // 4. Upload merged state to Cloud
      await syncService.uploadCloudData(uid, finalPayload);

      // 5. Acknowledge and clear processed queue items
      if (pendingMutations.length > 0) {
        const mutationIds = pendingMutations.map((m) => m.mutationId);
        await SyncQueueRepository.removeBatch(mutationIds);
      }

      useSyncStore.getState().recordSyncSuccess();
      return { success: true, syncedCount: pendingMutations.length };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown sync error';
      useSyncStore.getState().setSyncError(errorMsg);
      return { success: false, syncedCount: 0, error: errorMsg };
    } finally {
      this.isSyncing = false;
    }
  }
}
