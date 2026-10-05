import { getDatabase } from '../db';

export interface SyncMutation {
  mutationId: string;
  entityType: 'progression' | 'inventory' | 'reward_grant' | 'daily_challenge' | 'profile';
  entityId: string;
  payload: string;
  createdAt: number;
  retryCount: number;
}

export class SyncQueueRepository {
  /**
   * Enqueue a new mutation for cloud synchronization.
   */
  static async enqueue(
    mutationId: string,
    entityType: SyncMutation['entityType'],
    entityId: string,
    payload: unknown
  ): Promise<void> {
    const db = await getDatabase();
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const now = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO sync_queue (mutation_id, entity_type, entity_id, payload, created_at, retry_count)
       VALUES (?, ?, ?, ?, ?, 0);`,
      mutationId,
      entityType,
      entityId,
      payloadStr,
      now
    );
  }

  /**
   * Retrieve pending mutations up to a specific limit.
   */
  static async getPending(limit = 50): Promise<SyncMutation[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      mutation_id: string;
      entity_type: string;
      entity_id: string;
      payload: string;
      created_at: number;
      retry_count: number;
    }>(
      `SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT ?;`,
      limit
    );

    return rows.map((r) => ({
      mutationId: r.mutation_id,
      entityType: r.entity_type as SyncMutation['entityType'],
      entityId: r.entity_id,
      payload: r.payload,
      createdAt: r.created_at,
      retryCount: r.retry_count,
    }));
  }

  /**
   * Remove successfully synchronized mutations from the queue.
   */
  static async removeBatch(mutationIds: string[]): Promise<void> {
    if (mutationIds.length === 0) return;
    const db = await getDatabase();
    const placeholders = mutationIds.map(() => '?').join(',');
    await db.runAsync(
      `DELETE FROM sync_queue WHERE mutation_id IN (${placeholders});`,
      ...mutationIds
    );
  }

  /**
   * Increment retry count for failed mutations.
   */
  static async incrementRetry(mutationIds: string[]): Promise<void> {
    if (mutationIds.length === 0) return;
    const db = await getDatabase();
    const placeholders = mutationIds.map(() => '?').join(',');
    await db.runAsync(
      `UPDATE sync_queue SET retry_count = retry_count + 1 WHERE mutation_id IN (${placeholders});`,
      ...mutationIds
    );
  }

  /**
   * Count how many mutations are currently waiting in the queue.
   */
  static async getQueueCount(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sync_queue;`
    );
    return row?.count ?? 0;
  }
}
