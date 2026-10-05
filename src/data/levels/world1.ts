export interface LevelConfig {
  level: number;
  worldId: string;
  theme: string;
  subtitle: string;
  words: string[];
}

/**
 * World 1: Verdant Forest (Levels 1 - 20)
 * 20 distinct themes, 8 curated words per level (160 unique words total).
 * Zero duplicate words within World 1.
 * Zero overlap with reserved vocabularies of future worlds (Crystal Depths, Sunken Atlantis, Cyberpunk).
 */
export const WORLD_1_LEVELS: LevelConfig[] = [
  {
    level: 1,
    worldId: 'world-1',
    theme: 'Forest Mammals',
    subtitle: 'Track agile creatures roaming the woodland floor',
    words: ['DEER', 'BEAR', 'WOLF', 'FOX', 'HARE', 'MOOSE', 'BADGER', 'OTTER'],
  },
  {
    level: 2,
    worldId: 'world-1',
    theme: 'Woodland Birds',
    subtitle: 'Spot sharp-eyed hunters perched across high boughs',
    words: ['EAGLE', 'HAWK', 'OWL', 'ROBIN', 'FALCON', 'RAVEN', 'SWIFT', 'FINCH'],
  },
  {
    level: 3,
    worldId: 'world-1',
    theme: 'Giant Trees',
    subtitle: 'Identify towering ancient timber stretching skyward',
    words: ['OAK', 'PINE', 'CEDAR', 'BIRCH', 'MAPLE', 'WILLOW', 'SPRUCE', 'ELM'],
  },
  {
    level: 4,
    worldId: 'world-1',
    theme: 'Wild Flowers',
    subtitle: 'Discover vibrant forest blossoms blooming along mossy clearings',
    words: ['ROSE', 'LILY', 'DAISY', 'TULIP', 'ORCHID', 'VIOLET', 'POPPY', 'CLOVER'],
  },
  {
    level: 5,
    worldId: 'world-1',
    theme: 'River & Streams',
    subtitle: 'Follow bubbling currents rushing over smooth stones',
    words: ['STREAM', 'BROOK', 'RIPPLE', 'CURRENT', 'PEBBLE', 'SPLASH', 'RAPIDS', 'SHORE'],
  },
  {
    level: 6,
    worldId: 'world-1',
    theme: 'Forest Insects',
    subtitle: 'Uncover tiny architects bustling beneath fallen bark',
    words: ['BEETLE', 'MOTH', 'WASP', 'ANT', 'CRICKET', 'MANTIS', 'FIREFLY', 'HORNET'],
  },
  {
    level: 7,
    worldId: 'world-1',
    theme: 'Wild Fruits & Berries',
    subtitle: 'Gather sweet forest harvests ripened under the sun',
    words: ['BERRY', 'CHERRY', 'ACORN', 'WALNUT', 'FIG', 'APPLE', 'PEACH', 'PLUM'],
  },
  {
    level: 8,
    worldId: 'world-1',
    theme: 'Fungi & Forest Floor',
    subtitle: 'Examine spongy clusters and velvet spores',
    words: ['MUSHROOM', 'MOSS', 'FERN', 'LICHEN', 'SPORE', 'TRUFFLE', 'FUNGUS', 'BARK'],
  },
  {
    level: 9,
    worldId: 'world-1',
    theme: 'Camping & Wilderness',
    subtitle: 'Prepare essential survival gear for the trek ahead',
    words: ['TENT', 'CAMP', 'TORCH', 'FLAME', 'COMPASS', 'LANTERN', 'CANTEEN', 'ROPE'],
  },
  {
    level: 10,
    worldId: 'world-1',
    theme: 'Weather & Sky',
    subtitle: 'Notice shifting mountain breezes and sudden rainfall',
    words: ['RAIN', 'STORM', 'BREEZE', 'CLOUD', 'THUNDER', 'SHADOW', 'SUNSET', 'MIST'],
  },
  {
    level: 11,
    worldId: 'world-1',
    theme: 'Forest Amphibians',
    subtitle: 'Seek out camouflaged marsh dwellers near the reeds',
    words: ['FROG', 'TOAD', 'LIZARD', 'GECKO', 'VIPER', 'TURTLE', 'NEWT', 'SKINK'],
  },
  {
    level: 12,
    worldId: 'world-1',
    theme: 'Rocky Cliffs & Hills',
    subtitle: 'Scale jagged bluffs and rugged canyon ridges',
    words: ['CLIFF', 'CANYON', 'BOULDER', 'RIDGE', 'VALLEY', 'SLOPE', 'SUMMIT', 'CRAG'],
  },
  {
    level: 13,
    worldId: 'world-1',
    theme: 'Forest Night',
    subtitle: 'Listen to midnight echoes under starry silver light',
    words: ['LUNAR', 'STARS', 'AURORA', 'ECHO', 'TWILIGHT', 'GLOW', 'DUSK', 'SILENCE'],
  },
  {
    level: 14,
    worldId: 'world-1',
    theme: 'Freshwater Life',
    subtitle: 'Glimpse darting scales in crystal mountain pools',
    words: ['TROUT', 'SALMON', 'CARP', 'BASS', 'PIKE', 'PERCH', 'MINNOW', 'CATFISH'],
  },
  {
    level: 15,
    worldId: 'world-1',
    theme: 'Forest Trails',
    subtitle: 'Navigate winding paths guiding scouts through the pines',
    words: ['PATH', 'TRACK', 'MARKER', 'BRIDGE', 'FOOTSTEP', 'OUTPOST', 'PASSAGE', 'ROUTE'],
  },
  {
    level: 16,
    worldId: 'world-1',
    theme: 'Autumn Canopy',
    subtitle: 'Witness golden leaves rustling in crisp autumn air',
    words: ['AMBER', 'GOLDEN', 'CRISP', 'RUSTLE', 'SEASON', 'FROST', 'FOLIAGE', 'HARVEST'],
  },
  {
    level: 17,
    worldId: 'world-1',
    theme: 'Forest Herbal & Flavors',
    subtitle: 'Savor wild herbal scents and amber tree sap',
    words: ['HONEY', 'NECTAR', 'HERB', 'SAP', 'GINGER', 'MINT', 'ROOT', 'THYME'],
  },
  {
    level: 18,
    worldId: 'world-1',
    theme: 'Woodcraft & Bushcraft',
    subtitle: 'Carve shelter timber with seasoned wilderness craft',
    words: ['AXE', 'LOG', 'TIMBER', 'BLADE', 'WHISTLE', 'CARVE', 'SHELTER', 'KNOT'],
  },
  {
    level: 19,
    worldId: 'world-1',
    theme: 'Forest Rangers',
    subtitle: 'Stand guard alongside vigilant woodland sentinels',
    words: ['BADGE', 'SHIELD', 'SCOUT', 'RANGER', 'WARDEN', 'SENTINEL', 'KEEPER', 'VALOR'],
  },
  {
    level: 20,
    worldId: 'world-1',
    theme: 'Verdant Sovereign',
    subtitle: 'Conquer the ancient realm and master the heart of the forest',
    words: ['KINGDOM', 'ANCIENT', 'SOVEREIGN', 'MYSTERY', 'LEGEND', 'NATURE', 'CHAMPION', 'TRIUMPH'],
  },
];

/**
 * Reserved vocabularies for future worlds to guarantee zero overlap.
 */
export const FUTURE_WORLDS_RESERVED: Record<string, string[]> = {
  // World 2: Subterranean, caves, gemstones, minerals
  crystalDepths: [
    'CRYSTAL', 'QUARTZ', 'DIAMOND', 'RUBY', 'GEM', 'CAVERN', 'GEODE',
    'STALACTITE', 'OBSIDIAN', 'MINERAL', 'JEWEL', 'OPAL', 'SAPPHIRE',
    'JADE', 'AMETHYST', 'TOPAZ', 'MINE', 'CHASM', 'FOSSIL', 'SHARD',
  ],
  // World 3: Ocean abyss, reefs, mythological undersea ruins
  sunkenAtlantis: [
    'OCEAN', 'CORAL', 'SHARK', 'WHALE', 'OCTOPUS', 'TRIDENT', 'PEARL',
    'SUBMARINE', 'TRENCH', 'ATLANTIS', 'DOLPHIN', 'JELLYFISH', 'SEAHORSE',
    'ANEMONE', 'ABYSS', 'MARINAS', 'REEF', 'SCUBA', 'DROWN', 'NAUTILUS',
  ],
  // World 4: High tech, futuristic city, cybernetics
  cyberpunkMetropolis: [
    'NEON', 'CYBER', 'ROBOT', 'MATRIX', 'LASER', 'CIRCUIT', 'DRONE',
    'HOLOGRAM', 'GLITCH', 'MAINFRAME', 'HACKER', 'SYNTH', 'ANDROID',
    'NETWORK', 'CYBORG', 'DIGITAL', 'BYTE', 'SILICON', 'CHIP', 'PULSE',
  ],
};

/**
 * Retrieves the level definition for a given level number.
 * Defaults gracefully to modular cycling if level exceeds World 1.
 */
export function getLevelConfig(levelNum: number): LevelConfig {
  const index = Math.max(0, (levelNum - 1) % WORLD_1_LEVELS.length);
  return WORLD_1_LEVELS[index];
}
