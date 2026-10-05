import { getDatabase } from '../db';
import { PlayerRepository } from './PlayerRepository';

export interface RewardGrantRecord {
  grantId: string;
  rewardType: string;
  amount: number;
  source: string;
  grantedAt: number;
}

export class RewardLedgerRepository {
  static async hasGrant(grantId: string): Promise<boolean> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ grant_id: string }>(
      `SELECT grant_id FROM reward_grants WHERE grant_id = ?;`,
      grantId
    );
    return row !== null;
  }

  /**
   * Idempotently claims a reward.
   * If grantId was already recorded, skips crediting and returns success: false.
   */
  static async claimReward(
    grantId: string,
    rewardType: string,
    amount: number,
    source: string
  ): Promise<{ success: boolean; duplicate: boolean; newBalance: number }> {
    const db = await getDatabase();

    // Check if already claimed
    const alreadyClaimed = await this.hasGrant(grantId);
    if (alreadyClaimed) {
      const currentBalance = await PlayerRepository.getItemQuantity(rewardType);
      return { success: false, duplicate: true, newBalance: currentBalance };
    }

    const now = Date.now();

    // Insert into ledger and modify inventory
    await db.runAsync(
      `INSERT INTO reward_grants (grant_id, reward_type, amount, source, granted_at)
       VALUES (?, ?, ?, ?, ?);`,
      grantId,
      rewardType,
      amount,
      source,
      now
    );

    await db.runAsync(
      `INSERT OR IGNORE INTO inventory (item_id, quantity, updated_at) VALUES (?, 0, ?);`,
      rewardType,
      now
    );

    await db.runAsync(
      `UPDATE inventory SET quantity = quantity + ?, updated_at = ? WHERE item_id = ?;`,
      amount,
      now,
      rewardType
    );

    const newBalance = await PlayerRepository.getItemQuantity(rewardType);
    return { success: true, duplicate: false, newBalance };
  }

  static async getGrantHistory(limit = 50): Promise<RewardGrantRecord[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      grant_id: string;
      reward_type: string;
      amount: number;
      source: string;
      granted_at: number;
    }>(
      `SELECT grant_id, reward_type, amount, source, granted_at
       FROM reward_grants
       ORDER BY granted_at DESC
       LIMIT ?;`,
      limit
    );

    return rows.map((r) => ({
      grantId: r.grant_id,
      rewardType: r.reward_type,
      amount: r.amount,
      source: r.source,
      grantedAt: r.granted_at,
    }));
  }
}
