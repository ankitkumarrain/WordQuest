import { getDatabase } from '../db';

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string;
  isAnonymous: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  updatedAt: number;
}

export class PlayerRepository {
  static async getProfile(): Promise<PlayerProfile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      id: string;
      username: string;
      avatar: string;
      is_anonymous: number;
      created_at: number;
      updated_at: number;
    }>(`SELECT * FROM player_profile LIMIT 1;`);

    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      avatar: row.avatar,
      isAnonymous: row.is_anonymous === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async updateProfile(username: string, avatar: string): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    const existing = await this.getProfile();
    if (existing) {
      await db.runAsync(
        `UPDATE player_profile SET username = ?, avatar = ?, updated_at = ? WHERE id = ?;`,
        username,
        avatar,
        now,
        existing.id
      );
    } else {
      const id = `guest_${Date.now()}`;
      await db.runAsync(
        `INSERT INTO player_profile (id, username, avatar, is_anonymous, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?);`,
        id,
        username,
        avatar,
        now,
        now
      );
    }
  }

  static async getInventory(): Promise<Record<string, number>> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ item_id: string; quantity: number }>(
      `SELECT item_id, quantity FROM inventory;`
    );

    const inventory: Record<string, number> = {};
    for (const r of rows) {
      inventory[r.item_id] = r.quantity;
    }
    return inventory;
  }

  static async getItemQuantity(itemId: string): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ quantity: number }>(
      `SELECT quantity FROM inventory WHERE item_id = ?;`,
      itemId
    );
    return row?.quantity ?? 0;
  }

  static async modifyItemQuantity(itemId: string, delta: number): Promise<number> {
    const db = await getDatabase();
    const now = Date.now();
    
    // Ensure item exists
    await db.runAsync(
      `INSERT OR IGNORE INTO inventory (item_id, quantity, updated_at) VALUES (?, 0, ?);`,
      itemId,
      now
    );

    await db.runAsync(
      `UPDATE inventory SET quantity = MAX(0, quantity + ?), updated_at = ? WHERE item_id = ?;`,
      delta,
      now,
      itemId
    );

    return this.getItemQuantity(itemId);
  }
}
