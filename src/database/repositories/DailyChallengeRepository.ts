import { getDatabase } from '../db';

export interface DailyChallengeRecord {
  dateKey: string; // YYYY-MM-DD
  completed: boolean;
  score: number;
  timeSeconds: number;
  rewardClaimed: boolean;
  completedAt: number | null;
}

export class DailyChallengeRepository {
  static async getChallenge(dateKey: string): Promise<DailyChallengeRecord | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      date_key: string;
      completed: number;
      score: number;
      time_seconds: number;
      reward_claimed: number;
      completed_at: number | null;
    }>(`SELECT * FROM daily_challenges WHERE date_key = ?;`, dateKey);

    if (!row) return null;

    return {
      dateKey: row.date_key,
      completed: row.completed === 1,
      score: row.score,
      timeSeconds: row.time_seconds,
      rewardClaimed: row.reward_claimed === 1,
      completedAt: row.completed_at,
    };
  }

  static async saveCompletion(
    dateKey: string,
    score: number,
    timeSeconds: number
  ): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO daily_challenges (date_key, completed, score, time_seconds, reward_claimed, completed_at)
       VALUES (?, 1, ?, ?, 0, ?)
       ON CONFLICT(date_key) DO UPDATE SET
         completed = 1,
         score = MAX(daily_challenges.score, excluded.score),
         time_seconds = CASE WHEN daily_challenges.time_seconds > 0 THEN MIN(daily_challenges.time_seconds, excluded.time_seconds) ELSE excluded.time_seconds END,
         completed_at = excluded.completed_at;`,
      dateKey,
      score,
      timeSeconds,
      now
    );
  }

  static async markRewardClaimed(dateKey: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE daily_challenges SET reward_claimed = 1 WHERE date_key = ?;`,
      dateKey
    );
  }

  static async getCompletedCount(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM daily_challenges WHERE completed = 1;`
    );
    return row?.cnt ?? 0;
  }

  static async getAllCompletedDates(): Promise<string[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ date_key: string }>(
      `SELECT date_key FROM daily_challenges WHERE completed = 1;`
    );
    return rows.map((r) => r.date_key);
  }

  static async getHistory(): Promise<{ date: string; dateKey: string; completed: boolean; score: number }[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ date_key: string; completed: number; score: number }>(
      `SELECT date_key, completed, score FROM daily_challenges ORDER BY date_key ASC;`
    );
    return rows.map((r) => ({
      date: r.date_key,
      dateKey: r.date_key,
      completed: r.completed === 1,
      score: r.score,
    }));
  }
}
