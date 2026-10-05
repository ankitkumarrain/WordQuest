export interface DailyChallengeInfo {
  dateKey: string;
  seed: number;
  themeTitle: string;
  themeSubtitle: string;
  words: string[];
  gridRows: number;
  gridCols: number;
  wordCount: number;
  initialTime: number;
}

const DAILY_THEMES = [
  {
    themeTitle: 'Galactic Odyssey',
    themeSubtitle: 'Search for celestial wonders across the cosmos.',
    words: ['NEBULA', 'GALAXY', 'METEOR', 'COMET', 'PULSAR', 'ORBIT', 'ZENITH', 'ECLIPSE', 'COSMOS', 'AURORA'],
  },
  {
    themeTitle: 'Abyssal Depths',
    themeSubtitle: 'Discover sunken mysteries in the deep ocean trench.',
    words: ['TRENCH', 'CORAL', 'KRAKEN', 'TRIDENT', 'ANEMONE', 'NAUTILUS', 'DOLPHIN', 'SUBMARINE', 'ABYSS', 'PEARL'],
  },
  {
    themeTitle: 'Verdant Canopy',
    themeSubtitle: 'Traverse lush rainforests and ancient flora.',
    words: ['JUNGLE', 'ORCHID', 'FERN', 'CANOPY', 'JAGUAR', 'BAMBOO', 'FOLIAGE', 'MONKEY', 'TOUCAN', 'SEQUOIA'],
  },
  {
    themeTitle: 'Cyberpunk Metropolis',
    themeSubtitle: 'Hack through neon data grids and digital skylines.',
    words: ['NEON', 'CYBER', 'ROBOT', 'LASER', 'MATRIX', 'SILICON', 'SYNTH', 'HOLOGRAM', 'CIRCUIT', 'DRONE'],
  },
  {
    themeTitle: 'Ancient Egypt',
    themeSubtitle: 'Unearth pharaoh treasures buried in golden sands.',
    words: ['PHARAOH', 'PYRAMID', 'SPHINX', 'PAPYRUS', 'SCARAB', 'TEMPLE', 'HIEROGLYPH', 'ANUBIS', 'MUMMY', 'DESERT'],
  },
  {
    themeTitle: 'Arctic Aurora',
    themeSubtitle: 'Brave freezing glaciers under shimmering northern lights.',
    words: ['GLACIER', 'BLIZZARD', 'TUNDRA', 'PENGUIN', 'WALRUS', 'IGLOO', 'FROST', 'AURORA', 'ICEBERG', 'ARCTIC'],
  },
  {
    themeTitle: 'Mythic Legends',
    themeSubtitle: 'Meet creatures of mythical folklore and power.',
    words: ['DRAGON', 'PHOENIX', 'PEGASUS', 'GRIFFIN', 'CENTAUR', 'VALKYRIE', 'HYDRA', 'TITAN', 'CHIMERA', 'WIZARD'],
  },
  {
    themeTitle: 'Volcanic Caldera',
    themeSubtitle: 'Trek active tectonic rifts and molten peaks.',
    words: ['MAGMA', 'VOLCANO', 'CRATER', 'BASALT', 'OBSIDIAN', 'GEYSER', 'EMBER', 'CINDERS', 'ASHES', 'FISSURE'],
  },
  {
    themeTitle: 'Culinary Delights',
    themeSubtitle: 'Savor gourmet delicacies from master kitchens.',
    words: ['SAFFRON', 'TRUFFLE', 'VANILLA', 'CINNAMON', 'CARAMEL', 'GINGER', 'NUTMEG', 'BASIL', 'PAPRIKA', 'ALMOND'],
  },
  {
    themeTitle: 'Renaissance Arts',
    themeSubtitle: 'Celebrate timeless masterpieces and classical architecture.',
    words: ['FRESCO', 'CANVAS', 'MARBLE', 'MOSAIC', 'STATUE', 'PALETTE', 'GALLERY', 'CHISEL', 'PORTRAIT', 'EASEL'],
  },
  {
    themeTitle: 'Highland Castles',
    themeSubtitle: 'Roam medieval fortress walls and royal battlements.',
    words: ['TURRET', 'DRAWBRIDGE', 'BASTION', 'SHIELD', 'KNIGHT', 'BANNER', 'ARMOR', 'DUNGEON', 'THRONE', 'MOAT'],
  },
  {
    themeTitle: 'Botanical Gardens',
    themeSubtitle: 'Breathe the fragrant blossoms of exotic gardens.',
    words: ['JASMINE', 'LAVENDER', 'BLOSSOM', 'PETALS', 'GARDENIA', 'MAGNOLIA', 'VIOLET', 'DAHLIA', 'LOTUS', 'HYDRANGEA'],
  },
  {
    themeTitle: 'Safari Adventure',
    themeSubtitle: 'Track majestic wildlife across the open savannah.',
    words: ['CHEETAH', 'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'ANTELOPE', 'GAZELLE', 'SAVANNAH', 'BUFFALO', 'LIONESS', 'RHINO'],
  },
  {
    themeTitle: 'Time Traveler',
    themeSubtitle: 'Navigate chrono-portals across forgotten eras.',
    words: ['PARADOX', 'CHRONOS', 'PORTAL', 'EPOCH', 'CENTURY', 'RELIC', 'FOSSIL', 'DYNASTY', 'VORTEX', 'MILLENNIUM'],
  },
];

export class DailyChallengeService {
  /**
   * Deterministic seed generator based on the given date (defaults to today).
   * Format: YYYYMMDD as an integer.
   */
  static getTodaySeed(date = new Date()): number {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return y * 10000 + m * 100 + d;
  }

  /**
   * Standardized date key for database storage: YYYY-MM-DD
   */
  static getTodayKey(date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Generates deterministic Daily Challenge metadata for any given day.
   */
  static getDailyChallengeInfo(date = new Date()): DailyChallengeInfo {
    const seed = this.getTodaySeed(date);
    const dateKey = this.getTodayKey(date);

    // Pick theme deterministically from seed
    const themeIndex = Math.abs(seed) % DAILY_THEMES.length;
    const theme = DAILY_THEMES[themeIndex];

    // Seeded deterministic pseudo-random generator
    let currentSeed = seed;
    const nextRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    // Deterministically shuffle theme words
    const shuffledWords = [...theme.words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }

    return {
      dateKey,
      seed,
      themeTitle: theme.themeTitle,
      themeSubtitle: theme.themeSubtitle,
      words: shuffledWords.slice(0, 7),
      gridRows: 10,
      gridCols: 10,
      wordCount: 7,
      initialTime: 180, // Generous 3 minutes for daily challenge
    };
  }
}
