import { colors } from '@/constants/colors';
import { LevelProgress } from '@/database/repositories/ProgressionRepository';

export interface WorldDefinition {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  startLevel: number;
  endLevel: number;
  totalLevels: number;
  unlockRequirementLevel: number; // level required to unlock this world (0 = default unlocked)
  themeColor: string;
  badgeText: string;
}

export const WORLDS_CONFIG: WorldDefinition[] = [
  {
    id: 'world-1',
    index: 1,
    name: 'Verdant Forest',
    subtitle: 'Conquer the ancient woodland and discover forest wildlife',
    startLevel: 1,
    endLevel: 20,
    totalLevels: 20,
    unlockRequirementLevel: 0,
    themeColor: colors.primary,
    badgeText: 'WORLD 1: VERDANT FOREST',
  },
  {
    id: 'world-2',
    index: 2,
    name: 'Crystal Depths',
    subtitle: 'Explore subterranean caverns and luminous gemstones',
    startLevel: 21,
    endLevel: 45,
    totalLevels: 25,
    unlockRequirementLevel: 20, // Unlocks after beating World 1 (Level 20)
    themeColor: colors.secondary,
    badgeText: 'WORLD 2: CRYSTAL DEPTHS',
  },
  {
    id: 'world-3',
    index: 3,
    name: 'Sunken Atlantis',
    subtitle: 'Dive into mythical underwater ruins and oceanic trenches',
    startLevel: 46,
    endLevel: 75,
    totalLevels: 30,
    unlockRequirementLevel: 45, // Unlocks after beating World 2 (Level 45)
    themeColor: colors.gold,
    badgeText: 'WORLD 3: SUNKEN ATLANTIS',
  },
  {
    id: 'world-4',
    index: 4,
    name: 'Cyberpunk Metropolis',
    subtitle: 'Infiltrate neon skylines, cybernetic nodes, and digital grids',
    startLevel: 76,
    endLevel: 110,
    totalLevels: 35,
    unlockRequirementLevel: 75, // Unlocks after beating World 3 (Level 75)
    themeColor: colors.danger,
    badgeText: 'WORLD 4: CYBERPUNK METROPOLIS',
  },
];

export class WorldService {
  /**
   * Returns world configuration by ID
   */
  static getWorldById(worldId: string): WorldDefinition {
    return WORLDS_CONFIG.find((w) => w.id === worldId) ?? WORLDS_CONFIG[0];
  }

  /**
   * Returns the world corresponding to a level number
   */
  static getWorldForLevel(levelNum: number): WorldDefinition {
    for (const world of WORLDS_CONFIG) {
      if (levelNum >= world.startLevel && levelNum <= world.endLevel) {
        return world;
      }
    }
    return WORLDS_CONFIG[WORLDS_CONFIG.length - 1];
  }

  /**
   * Checks whether a world is unlocked based on highest level completed
   */
  static isWorldUnlocked(world: WorldDefinition, highestCompletedLevel: number): boolean {
    if (world.unlockRequirementLevel === 0) return true;
    return highestCompletedLevel >= world.unlockRequirementLevel;
  }

  /**
   * Calculates world progress statistics from SQLite progress records
   */
  static getWorldProgress(
    world: WorldDefinition,
    progressList: LevelProgress[]
  ): { completedLevels: number; totalStars: number; maxStars: number } {
    const progressMap = new Map<number, LevelProgress>();
    for (const p of progressList) {
      progressMap.set(p.levelId, p);
    }

    let completedLevels = 0;
    let totalStars = 0;

    for (let lvl = world.startLevel; lvl <= world.endLevel; lvl++) {
      const record = progressMap.get(lvl);
      if (record && record.stars > 0) {
        completedLevels++;
        totalStars += record.stars;
      }
    }

    return {
      completedLevels,
      totalStars,
      maxStars: world.totalLevels * 3,
    };
  }
}
