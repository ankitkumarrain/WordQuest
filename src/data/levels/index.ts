import { LevelConfig, WORLD_1_LEVELS } from './world1';
import { WORLD_2_LEVELS } from './world2';
import { WORLD_3_LEVELS } from './world3';
import { WORLD_4_LEVELS } from './world4';

export * from './world1';
export * from './world2';
export * from './world3';
export * from './world4';

/**
 * Complete list of all 110 levels across all 4 worlds.
 */
export const ALL_LEVELS: LevelConfig[] = [
  ...WORLD_1_LEVELS,
  ...WORLD_2_LEVELS,
  ...WORLD_3_LEVELS,
  ...WORLD_4_LEVELS,
];

const LEVEL_MAP = new Map<number, LevelConfig>();
for (const lvl of ALL_LEVELS) {
  LEVEL_MAP.set(lvl.level, lvl);
}

/**
 * Retrieves the level definition for any level number (1 - 110+).
 */
export function getLevelConfig(levelNum: number): LevelConfig {
  const config = LEVEL_MAP.get(levelNum);
  if (config) return config;

  // Gracefully fallback to cycling if beyond 110:
  const index = Math.max(0, (levelNum - 1) % ALL_LEVELS.length);
  return ALL_LEVELS[index];
}

/**
 * Returns all levels belonging to a specific world ID.
 */
export function getWorldLevels(worldId: string): LevelConfig[] {
  switch (worldId) {
    case 'world-1':
      return WORLD_1_LEVELS;
    case 'world-2':
      return WORLD_2_LEVELS;
    case 'world-3':
      return WORLD_3_LEVELS;
    case 'world-4':
      return WORLD_4_LEVELS;
    default:
      return WORLD_1_LEVELS;
  }
}
