import { getDatabase } from '../db';

export interface LevelProgress {
  levelId: number;
  categoryId: string;
  difficulty: string;
  stars: number;
  highScore: number;
  bestTimeSeconds: number;
  completedAt: number;
}

export class ProgressionRepository {
  static async getLevel(levelId: number): Promise<LevelProgress | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      level_id: number;
      category_id: string;
      difficulty: string;
      stars: number;
      high_score: number;
      best_time_seconds: number;
      completed_at: number;
    }>(`SELECT * FROM level_progression WHERE level_id = ?;`, levelId);

    if (!row) return null;

    return {
      levelId: row.level_id,
      categoryId: row.category_id,
      difficulty: row.difficulty,
      stars: row.stars,
      highScore: row.high_score,
      bestTimeSeconds: row.best_time_seconds,
      completedAt: row.completed_at,
    };
  }

  static async getAllProgress(): Promise<LevelProgress[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      level_id: number;
      category_id: string;
      difficulty: string;
      stars: number;
      high_score: number;
      best_time_seconds: number;
      completed_at: number;
    }>(`SELECT * FROM level_progression ORDER BY level_id ASC;`);

    return rows.map((r) => ({
      levelId: r.level_id,
      categoryId: r.category_id,
      difficulty: r.difficulty,
      stars: r.stars,
      highScore: r.high_score,
      bestTimeSeconds: r.best_time_seconds,
      completedAt: r.completed_at,
    }));
  }

  static async saveLevelResult(
    levelId: number,
    categoryId: string,
    difficulty: string,
    stars: number,
    score: number,
    timeSeconds: number
  ): Promise<LevelProgress> {
    const db = await getDatabase();
    const existing = await this.getLevel(levelId);
    const now = Date.now();

    if (!existing) {
      await db.runAsync(
        `INSERT INTO level_progression (level_id, category_id, difficulty, stars, high_score, best_time_seconds, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        levelId,
        categoryId,
        difficulty,
        stars,
        score,
        timeSeconds,
        now
      );
      return {
        levelId,
        categoryId,
        difficulty,
        stars,
        highScore: score,
        bestTimeSeconds: timeSeconds,
        completedAt: now,
      };
    }

    // Merge: highest stars, highest score, best time (minimum if > 0)
    const newStars = Math.max(existing.stars, stars);
    const newHighScore = Math.max(existing.highScore, score);
    const newBestTime =
      existing.bestTimeSeconds > 0
        ? Math.min(existing.bestTimeSeconds, timeSeconds)
        : timeSeconds;

    await db.runAsync(
      `UPDATE level_progression
       SET stars = ?, high_score = ?, best_time_seconds = ?, completed_at = ?
       WHERE level_id = ?;`,
      newStars,
      newHighScore,
      newBestTime,
      now,
      levelId
    );

    return {
      levelId,
      categoryId,
      difficulty,
      stars: newStars,
      highScore: newHighScore,
      bestTimeSeconds: newBestTime,
      completedAt: now,
    };
  }

  static async getTotalStars(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ total_stars: number }>(
      `SELECT SUM(stars) as total_stars FROM level_progression;`
    );
    return row?.total_stars ?? 0;
  }

  static async getHighestCompletedLevel(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ max_level: number }>(
      `SELECT MAX(level_id) as max_level FROM level_progression;`
    );
    return row?.max_level ?? 0;
  }

  static async upsertLevelProgress(record: LevelProgress): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO level_progression (level_id, category_id, difficulty, stars, high_score, best_time_seconds, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(level_id) DO UPDATE SET
         stars = excluded.stars,
         high_score = excluded.high_score,
         best_time_seconds = excluded.best_time_seconds,
         completed_at = excluded.completed_at;`,
      record.levelId,
      record.categoryId,
      record.difficulty,
      record.stars,
      record.highScore,
      record.bestTimeSeconds,
      record.completedAt
    );
  }
}
