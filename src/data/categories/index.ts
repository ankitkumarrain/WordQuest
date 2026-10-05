import { colors } from '@/constants/colors';

export interface CategoryDefinition {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  levelsCount: number;
  words: string[];
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  'cat-animals': {
    id: 'cat-animals',
    name: 'Wildlife & Animals',
    subtitle: 'Search for majestic wild beasts and creatures across continents',
    color: colors.primary,
    levelsCount: 30,
    words: [
      'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA',
      'LEOPARD', 'CHEETAH', 'KANGAROO', 'DOLPHIN', 'PANDA',
      'GORILLA', 'FALCON', 'EAGLE', 'JAGUAR', 'BADGER',
      'GAZELLE', 'RHINO', 'BUFFALO', 'WALRUS', 'PENGUIN',
    ],
  },
  'cat-nature': {
    id: 'cat-nature',
    name: 'Flora & Landscapes',
    subtitle: 'Explore breathtaking terrain, ancient mountains, and wild biomes',
    color: colors.secondary,
    levelsCount: 25,
    words: [
      'FOREST', 'MOUNTAIN', 'VALLEY', 'CANYON', 'GLACIER',
      'VOLCANO', 'MEADOW', 'WATERFALL', 'REDWOOD', 'RIVER',
      'DESERT', 'TUNDRA', 'SAVANNA', 'JUNGLE', 'ISLAND',
      'PLATEAU', 'GEYSER', 'CLIFF', 'PRAIRIE', 'LAGOON',
    ],
  },
  'cat-science': {
    id: 'cat-science',
    name: 'Science & Cosmos',
    subtitle: 'Discover cosmic wonders, stellar phenomena, and fundamental physics',
    color: colors.gold,
    levelsCount: 20,
    words: [
      'GALAXY', 'PLANET', 'NEBULA', 'COMET', 'METEOR',
      'ORBIT', 'PULSAR', 'GRAVITY', 'ATOM', 'QUANTUM',
      'PHOTON', 'ENERGY', 'COSMOS', 'ECLIPSE', 'RADAR',
      'OPTICS', 'VACUUM', 'QUARK', 'PROTON', 'STELLAR',
    ],
  },
  'cat-food': {
    id: 'cat-food',
    name: 'Culinary Delights',
    subtitle: 'Feast on delicious global dishes and mouth-watering cuisine',
    color: colors.warning,
    levelsCount: 25,
    words: [
      'PIZZA', 'BURGER', 'SUSHI', 'PASTA', 'TACO',
      'NOODLE', 'WAFFLE', 'PANCAKE', 'SALAD', 'STEAK',
      'BAGEL', 'CHEESE', 'OMELET', 'BREAD', 'CURRY',
      'RISOTTO', 'MUFFIN', 'FONDUE', 'PASTRY', 'SORBET',
    ],
  },
  'cat-travel': {
    id: 'cat-travel',
    name: 'Cities & Monuments',
    subtitle: 'Tour legendary world capitals, iconic architecture, and wonders',
    color: colors.info,
    levelsCount: 20,
    words: [
      'PARIS', 'LONDON', 'TOKYO', 'ROME', 'BERLIN',
      'VENICE', 'MADRID', 'CAIRO', 'SYDNEY', 'DUBAI',
      'PRAGUE', 'VIENNA', 'ATHENS', 'PYRAMID', 'COLOSSEUM',
      'BEIJING', 'HAVANA', 'MOSCOW', 'ISTANBUL', 'TORONTO',
    ],
  },
  'cat-technology': {
    id: 'cat-technology',
    name: 'Tech & Inventions',
    subtitle: 'Decode modern computing, digital networks, and futuristic engineering',
    color: colors.danger,
    levelsCount: 20,
    words: [
      'COMPUTER', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'ROBOTICS',
      'DATABASE', 'NETWORK', 'WIRELESS', 'SENSOR', 'CIRCUIT',
      'DISPLAY', 'BATTERY', 'KEYBOARD', 'MONITOR', 'ANTENNA',
      'PROCESSOR', 'ALGORITHM', 'FIBER', 'SERVER', 'ROUTER',
    ],
  },
};

export function getCategoryConfig(categoryId?: string): CategoryDefinition | null {
  if (!categoryId) return null;
  return CATEGORY_DEFINITIONS[categoryId] ?? null;
}
