export interface CloudProgressionRecord {
  levelId: number;
  categoryId: string;
  difficulty: string;
  stars: number;
  highScore: number;
  bestTimeSeconds: number;
  completedAt: number;
}

export interface CloudRewardGrant {
  grantId: string;
  rewardType: string;
  amount: number;
  source: string;
  grantedAt: number;
}

export interface CloudSyncPayload {
  profile?: {
    username: string;
    avatar: string;
    isAnonymous: boolean;
    updatedAt: number;
  };
  progression: CloudProgressionRecord[];
  inventory: Record<string, number>;
  grants: CloudRewardGrant[];
  dailyChallenges: string[]; // List of YYYY-MM-DD
  syncedAt: number;
}

export interface ConflictResolutionResult {
  mergedProgression: CloudProgressionRecord[];
  mergedInventory: Record<string, number>;
  mergedGrants: CloudRewardGrant[];
  mergedDailyChallenges: string[];
}

export interface ICloudSyncService {
  /**
   * Fetch current cloud snapshot for a given user UID.
   */
  fetchCloudData(uid: string): Promise<CloudSyncPayload | null>;

  /**
   * Upload whole snapshot or merged payload to cloud.
   */
  uploadCloudData(uid: string, payload: CloudSyncPayload): Promise<void>;

  /**
   * Append a single grant idempotently to the cloud ledger.
   */
  appendRewardGrant(uid: string, grant: CloudRewardGrant): Promise<boolean>;
}
