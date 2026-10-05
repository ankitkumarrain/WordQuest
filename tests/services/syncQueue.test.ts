import { MockCloudSyncService } from '@/services/sync/MockCloudSyncService';
import { CloudSyncPayload, CloudRewardGrant } from '@/services/sync/types';
import { SyncQueueRepository } from '@/database/repositories/SyncQueueRepository';

describe('Cloud Sync & Offline Queue', () => {
  let cloudSync: MockCloudSyncService;

  beforeEach(() => {
    cloudSync = new MockCloudSyncService();
  });

  it('stores and retrieves cloud snapshots accurately', async () => {
    const payload: CloudSyncPayload = {
      progression: [
        {
          levelId: 1,
          categoryId: 'food',
          difficulty: 'easy',
          stars: 3,
          highScore: 1000,
          bestTimeSeconds: 25,
          completedAt: Date.now(),
        },
      ],
      inventory: { coins: 500, booster_hint: 4 },
      grants: [],
      dailyChallenges: ['2026-09-27'],
      syncedAt: Date.now(),
    };

    await cloudSync.uploadCloudData('user_test_123', payload);
    const retrieved = await cloudSync.fetchCloudData('user_test_123');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.inventory.coins).toBe(500);
    expect(retrieved?.progression[0].stars).toBe(3);
    expect(retrieved?.dailyChallenges).toContain('2026-09-27');
  });

  it('idempotently appends reward grants and rejects duplicates', async () => {
    const grant: CloudRewardGrant = {
      grantId: 'grant_idempotent_abc',
      rewardType: 'coins',
      amount: 100,
      source: 'level_complete',
      grantedAt: Date.now(),
    };

    const firstResult = await cloudSync.appendRewardGrant('user_test_123', grant);
    expect(firstResult).toBe(true);

    const duplicateResult = await cloudSync.appendRewardGrant('user_test_123', grant);
    expect(duplicateResult).toBe(false); // Rejected duplicate!
  });

  it('enqueues offline mutations and reads pending batch', async () => {
    await SyncQueueRepository.enqueue('mut_1', 'progression', 'level_1', { stars: 3 });
    await SyncQueueRepository.enqueue('mut_2', 'inventory', 'coins', { delta: 50 });

    const pending = await SyncQueueRepository.getPending(10);
    expect(pending.length).toBeGreaterThanOrEqual(2);

    const ids = pending.map((p) => p.mutationId);
    expect(ids).toContain('mut_1');
    expect(ids).toContain('mut_2');

    // Clean up
    await SyncQueueRepository.removeBatch(['mut_1', 'mut_2']);
  });
});
