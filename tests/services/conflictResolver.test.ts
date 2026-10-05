import { ConflictResolver } from '@/services/sync/ConflictResolver';
import {
  CloudProgressionRecord,
  CloudRewardGrant,
} from '@/services/sync/types';

describe('ConflictResolver Engine', () => {
  describe('Progression resolution (Highest Star / Best Time Wins)', () => {
    it('picks remote record when remote has higher stars', () => {
      const local: CloudProgressionRecord[] = [
        {
          levelId: 1,
          categoryId: 'animals',
          difficulty: 'easy',
          stars: 2,
          highScore: 800,
          bestTimeSeconds: 40,
          completedAt: 1000,
        },
      ];

      const remote: CloudProgressionRecord[] = [
        {
          levelId: 1,
          categoryId: 'animals',
          difficulty: 'easy',
          stars: 3,
          highScore: 700,
          bestTimeSeconds: 50,
          completedAt: 2000,
        },
      ];

      const resolved = ConflictResolver.resolveProgression(local, remote);
      expect(resolved).toHaveLength(1);
      expect(resolved[0].stars).toBe(3);
    });

    it('picks faster time when stars are equal', () => {
      const local: CloudProgressionRecord[] = [
        {
          levelId: 2,
          categoryId: 'nature',
          difficulty: 'medium',
          stars: 3,
          highScore: 900,
          bestTimeSeconds: 65,
          completedAt: 1000,
        },
      ];

      const remote: CloudProgressionRecord[] = [
        {
          levelId: 2,
          categoryId: 'nature',
          difficulty: 'medium',
          stars: 3,
          highScore: 900,
          bestTimeSeconds: 48, // Faster!
          completedAt: 2000,
        },
      ];

      const resolved = ConflictResolver.resolveProgression(local, remote);
      expect(resolved[0].bestTimeSeconds).toBe(48);
    });

    it('picks higher score when stars and time are equal', () => {
      const local: CloudProgressionRecord[] = [
        {
          levelId: 3,
          categoryId: 'space',
          difficulty: 'hard',
          stars: 3,
          highScore: 1200,
          bestTimeSeconds: 50,
          completedAt: 1000,
        },
      ];

      const remote: CloudProgressionRecord[] = [
        {
          levelId: 3,
          categoryId: 'space',
          difficulty: 'hard',
          stars: 3,
          highScore: 1450, // Higher score
          bestTimeSeconds: 50,
          completedAt: 2000,
        },
      ];

      const resolved = ConflictResolver.resolveProgression(local, remote);
      expect(resolved[0].highScore).toBe(1450);
    });

    it('unions distinct levels solved on different devices', () => {
      const local: CloudProgressionRecord[] = [
        {
          levelId: 1,
          categoryId: 'animals',
          difficulty: 'easy',
          stars: 3,
          highScore: 800,
          bestTimeSeconds: 30,
          completedAt: 1000,
        },
      ];

      const remote: CloudProgressionRecord[] = [
        {
          levelId: 2,
          categoryId: 'animals',
          difficulty: 'easy',
          stars: 2,
          highScore: 600,
          bestTimeSeconds: 45,
          completedAt: 2000,
        },
      ];

      const resolved = ConflictResolver.resolveProgression(local, remote);
      expect(resolved).toHaveLength(2);
      expect(resolved.map((r) => r.levelId)).toEqual([1, 2]);
    });
  });

  describe('Reward Grants deduplication', () => {
    it('idempotently merges grants without duplicate entries', () => {
      const local: CloudRewardGrant[] = [
        {
          grantId: 'grant-uuid-1',
          rewardType: 'coins',
          amount: 50,
          source: 'level_complete',
          grantedAt: 1000,
        },
        {
          grantId: 'grant-uuid-2',
          rewardType: 'booster_hint',
          amount: 1,
          source: 'streak_day_1',
          grantedAt: 2000,
        },
      ];

      const remote: CloudRewardGrant[] = [
        {
          grantId: 'grant-uuid-1', // Same grant
          rewardType: 'coins',
          amount: 50,
          source: 'level_complete',
          grantedAt: 1000,
        },
        {
          grantId: 'grant-uuid-3', // New remote grant
          rewardType: 'coins',
          amount: 100,
          source: 'streak_day_2',
          grantedAt: 3000,
        },
      ];

      const resolved = ConflictResolver.resolveGrants(local, remote);
      expect(resolved).toHaveLength(3);
      expect(resolved.map((g) => g.grantId)).toEqual([
        'grant-uuid-1',
        'grant-uuid-2',
        'grant-uuid-3',
      ]);
    });
  });

  describe('Inventory & Daily Challenges resolution', () => {
    it('takes max verified inventory counts', () => {
      const local = { coins: 200, booster_hint: 5, booster_reveal: 1 };
      const remote = { coins: 350, booster_hint: 3, booster_shuffle: 2 };

      const resolved = ConflictResolver.resolveInventory(local, remote);
      expect(resolved).toEqual({
        coins: 350,
        booster_hint: 5,
        booster_reveal: 1,
        booster_shuffle: 2,
      });
    });

    it('unions completed daily challenge date keys', () => {
      const local = ['2026-09-25', '2026-09-26'];
      const remote = ['2026-09-26', '2026-09-27'];

      const resolved = ConflictResolver.resolveDailyChallenges(local, remote);
      expect(resolved).toEqual(['2026-09-25', '2026-09-26', '2026-09-27']);
    });
  });
});
