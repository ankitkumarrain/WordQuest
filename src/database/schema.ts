/**
 * WordQuest SQLite Database Schemas and DDL
 */

export const CREATE_TABLE_PLAYER_PROFILE = `
  CREATE TABLE IF NOT EXISTS player_profile (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT NOT NULL,
    is_anonymous INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

export const CREATE_TABLE_INVENTORY = `
  CREATE TABLE IF NOT EXISTS inventory (
    item_id TEXT PRIMARY KEY NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
  );
`;

export const CREATE_TABLE_LEVEL_PROGRESSION = `
  CREATE TABLE IF NOT EXISTS level_progression (
    level_id INTEGER PRIMARY KEY NOT NULL,
    category_id TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 0,
    high_score INTEGER NOT NULL DEFAULT 0,
    best_time_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER NOT NULL
  );
`;

export const CREATE_TABLE_REWARD_GRANTS = `
  CREATE TABLE IF NOT EXISTS reward_grants (
    grant_id TEXT PRIMARY KEY NOT NULL,
    reward_type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    granted_at INTEGER NOT NULL
  );
`;

export const CREATE_TABLE_DAILY_CHALLENGES = `
  CREATE TABLE IF NOT EXISTS daily_challenges (
    date_key TEXT PRIMARY KEY NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    time_seconds INTEGER NOT NULL DEFAULT 0,
    reward_claimed INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER
  );
`;

export const CREATE_TABLE_SYNC_QUEUE = `
  CREATE TABLE IF NOT EXISTS sync_queue (
    mutation_id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_progression_category ON level_progression(category_id);
  CREATE INDEX IF NOT EXISTS idx_reward_source ON reward_grants(source);
`;

export const INITIAL_INVENTORY_ITEMS = [
  { item_id: 'coins', quantity: 150 },
  { item_id: 'booster_hint', quantity: 3 },
  { item_id: 'booster_shuffle', quantity: 2 },
  { item_id: 'booster_reveal', quantity: 1 },
];
