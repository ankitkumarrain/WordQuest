import * as SQLite from 'expo-sqlite';
import {
  CREATE_TABLE_PLAYER_PROFILE,
  CREATE_TABLE_INVENTORY,
  CREATE_TABLE_LEVEL_PROGRESSION,
  CREATE_TABLE_REWARD_GRANTS,
  CREATE_TABLE_DAILY_CHALLENGES,
  CREATE_TABLE_SYNC_QUEUE,
  CREATE_INDEXES,
  INITIAL_INVENTORY_ITEMS,
} from './schema';

let cachedDb: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  return initializeDatabase();
}

async function configureDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  } catch {
    // Ignore PRAGMA WAL warning on certain Android storage configurations
  }
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');
  } catch {
    // Ignore PRAGMA foreign keys warning
  }
}

export function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const db = await SQLite.openDatabaseAsync('wordquest.db', { useNewConnection: true });
        await configureDatabase(db);

        await db.execAsync(`
          ${CREATE_TABLE_PLAYER_PROFILE}
          ${CREATE_TABLE_INVENTORY}
          ${CREATE_TABLE_LEVEL_PROGRESSION}
          ${CREATE_TABLE_REWARD_GRANTS}
          ${CREATE_TABLE_DAILY_CHALLENGES}
          ${CREATE_TABLE_SYNC_QUEUE}
          ${CREATE_INDEXES}
        `);

        // Initialize starting inventory if not already present
        const now = Date.now();
        for (const item of INITIAL_INVENTORY_ITEMS) {
          try {
            await db.runAsync(
              `INSERT OR IGNORE INTO inventory (item_id, quantity, updated_at) VALUES (?, ?, ?);`,
              item.item_id,
              item.quantity,
              now
            );
          } catch {
            // Already present or constraint met
          }
        }

        // Ensure default guest profile exists
        try {
          const existingProfile = await db.getFirstAsync<{ id: string }>(
            `SELECT id FROM player_profile LIMIT 1;`
          );

          if (!existingProfile) {
            const guestId = `guest_${Math.random().toString(36).substring(2, 10)}`;
            await db.runAsync(
              `INSERT INTO player_profile (id, username, avatar, is_anonymous, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`,
              guestId,
              'WordMaster',
              'avatar_adventurer',
              1,
              now,
              now
            );
          }
        } catch {
          // Profile check fallback
        }

        cachedDb = db;
        return db;
      } catch (err: any) {
        initPromise = null;
        console.error('DATABASE_INIT_ERROR:', err?.message || err, err?.stack);
        throw err;
      }
    })();
  }
  return initPromise;
}
