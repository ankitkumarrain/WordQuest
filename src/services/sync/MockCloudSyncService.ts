import {
  CloudSyncPayload,
  CloudRewardGrant,
  ICloudSyncService,
} from './types';

export class MockCloudSyncService implements ICloudSyncService {
  private cloudDatabase: Map<string, CloudSyncPayload> = new Map();

  async fetchCloudData(uid: string): Promise<CloudSyncPayload | null> {
    // Simulate cloud round-trip
    await new Promise((resolve) => setTimeout(resolve, 60));
    const data = this.cloudDatabase.get(uid);
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
  }

  async uploadCloudData(uid: string, payload: CloudSyncPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    this.cloudDatabase.set(uid, JSON.parse(JSON.stringify(payload)));
  }

  async appendRewardGrant(uid: string, grant: CloudRewardGrant): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    let data = this.cloudDatabase.get(uid);
    if (!data) {
      data = {
        progression: [],
        inventory: {},
        grants: [],
        dailyChallenges: [],
        syncedAt: Date.now(),
      };
      this.cloudDatabase.set(uid, data);
    }

    const alreadyExists = data.grants.some((g) => g.grantId === grant.grantId);
    if (alreadyExists) {
      return false; // Idempotently reject duplicate grant
    }

    data.grants.push({ ...grant });
    return true;
  }

  /**
   * Helper to seed cloud data for testing scenarios
   */
  seedCloudData(uid: string, payload: CloudSyncPayload): void {
    this.cloudDatabase.set(uid, JSON.parse(JSON.stringify(payload)));
  }

  clear(): void {
    this.cloudDatabase.clear();
  }
}
