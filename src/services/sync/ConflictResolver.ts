import {
  CloudProgressionRecord,
  CloudRewardGrant,
  ConflictResolutionResult,
} from './types';

export class ConflictResolver {
  /**
   * Resolves progression conflict between local SQLite records and remote Cloud records.
   * Rule:
   * 1. Higher stars always win.
   * 2. If stars tie, lower best time wins (excluding 0).
   * 3. If best time ties, higher high score wins.
   */
  static resolveProgression(
    local: CloudProgressionRecord[],
    remote: CloudProgressionRecord[]
  ): CloudProgressionRecord[] {
    const map = new Map<number, CloudProgressionRecord>();

    // Index all local records
    for (const record of local) {
      map.set(record.levelId, { ...record });
    }

    // Compare with remote records
    for (const remoteRecord of remote) {
      const existing = map.get(remoteRecord.levelId);
      if (!existing) {
        map.set(remoteRecord.levelId, { ...remoteRecord });
        continue;
      }

      // Check Stars
      if (remoteRecord.stars > existing.stars) {
        map.set(remoteRecord.levelId, { ...remoteRecord });
        continue;
      } else if (remoteRecord.stars < existing.stars) {
        continue;
      }

      // Stars are equal -> Check Best Time (lower is better, but > 0)
      const existingTime = existing.bestTimeSeconds > 0 ? existing.bestTimeSeconds : Infinity;
      const remoteTime = remoteRecord.bestTimeSeconds > 0 ? remoteRecord.bestTimeSeconds : Infinity;

      if (remoteTime < existingTime) {
        map.set(remoteRecord.levelId, { ...remoteRecord });
        continue;
      } else if (remoteTime > existingTime) {
        continue;
      }

      // Time is equal -> Check High Score (higher is better)
      if (remoteRecord.highScore > existing.highScore) {
        map.set(remoteRecord.levelId, { ...remoteRecord });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.levelId - b.levelId);
  }

  /**
   * Deduplicates reward grants using their unique idempotent grant UUIDs.
   */
  static resolveGrants(
    local: CloudRewardGrant[],
    remote: CloudRewardGrant[]
  ): CloudRewardGrant[] {
    const map = new Map<string, CloudRewardGrant>();

    for (const grant of local) {
      map.set(grant.grantId, grant);
    }
    for (const grant of remote) {
      if (!map.has(grant.grantId)) {
        map.set(grant.grantId, grant);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.grantedAt - b.grantedAt);
  }

  /**
   * Merges inventory counts conservatively by taking the maximum verified quantity.
   */
  static resolveInventory(
    local: Record<string, number>,
    remote: Record<string, number>
  ): Record<string, number> {
    const merged: Record<string, number> = { ...local };

    for (const [key, remoteQty] of Object.entries(remote)) {
      const localQty = merged[key] ?? 0;
      merged[key] = Math.max(localQty, remoteQty);
    }

    return merged;
  }

  /**
   * Merges daily completed challenge dates (unique set union).
   */
  static resolveDailyChallenges(localDates: string[], remoteDates: string[]): string[] {
    const set = new Set([...localDates, ...remoteDates]);
    return Array.from(set).sort();
  }

  /**
   * Complete all-tier resolution between local state and cloud snapshot.
   */
  static resolveAll(
    local: {
      progression: CloudProgressionRecord[];
      inventory: Record<string, number>;
      grants: CloudRewardGrant[];
      dailyChallenges: string[];
    },
    remote: {
      progression: CloudProgressionRecord[];
      inventory: Record<string, number>;
      grants: CloudRewardGrant[];
      dailyChallenges: string[];
    }
  ): ConflictResolutionResult {
    return {
      mergedProgression: this.resolveProgression(local.progression, remote.progression),
      mergedInventory: this.resolveInventory(local.inventory, remote.inventory),
      mergedGrants: this.resolveGrants(local.grants, remote.grants),
      mergedDailyChallenges: this.resolveDailyChallenges(
        local.dailyChallenges,
        remote.dailyChallenges
      ),
    };
  }
}
