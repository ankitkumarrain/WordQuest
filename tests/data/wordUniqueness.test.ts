import {
  WORLD_1_LEVELS,
  FUTURE_WORLDS_RESERVED,
  getLevelConfig,
} from '../../src/data/levels/world1';

describe('World 1 Word & Theme Uniqueness Tests', () => {
  it('contains exactly 20 levels', () => {
    expect(WORLD_1_LEVELS).toHaveLength(20);
    for (let i = 0; i < 20; i++) {
      expect(WORLD_1_LEVELS[i].level).toBe(i + 1);
    }
  });

  it('contains 20 completely unique theme names (parts)', () => {
    const themes = WORLD_1_LEVELS.map((lvl) => lvl.theme.trim().toLowerCase());
    const uniqueThemes = new Set(themes);
    expect(uniqueThemes.size).toBe(20);
  });

  it('each level has exactly 8 valid words', () => {
    for (const lvl of WORLD_1_LEVELS) {
      expect(lvl.words).toHaveLength(8);
      for (const word of lvl.words) {
        expect(word).toBe(word.toUpperCase());
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(10);
        expect(/^[A-Z]+$/.test(word)).toBe(true);
      }
    }
  });

  it('has ZERO duplicate words across all 20 levels (160 unique words)', () => {
    const allWords = WORLD_1_LEVELS.flatMap((lvl) => lvl.words);
    expect(allWords).toHaveLength(160);

    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const word of allWords) {
      if (seen.has(word)) {
        duplicates.push(word);
      }
      seen.add(word);
    }

    expect(duplicates).toEqual([]);
    expect(seen.size).toBe(160);
  });

  it('has ZERO overlap with Crystal Depths reserved words', () => {
    const world1WordSet = new Set(WORLD_1_LEVELS.flatMap((lvl) => lvl.words));
    const overlaps = FUTURE_WORLDS_RESERVED.crystalDepths.filter((w) => world1WordSet.has(w));
    expect(overlaps).toEqual([]);
  });

  it('has ZERO overlap with Sunken Atlantis reserved words', () => {
    const world1WordSet = new Set(WORLD_1_LEVELS.flatMap((lvl) => lvl.words));
    const overlaps = FUTURE_WORLDS_RESERVED.sunkenAtlantis.filter((w) => world1WordSet.has(w));
    expect(overlaps).toEqual([]);
  });

  it('has ZERO overlap with Cyberpunk Metropolis reserved words', () => {
    const world1WordSet = new Set(WORLD_1_LEVELS.flatMap((lvl) => lvl.words));
    const overlaps = FUTURE_WORLDS_RESERVED.cyberpunkMetropolis.filter((w) => world1WordSet.has(w));
    expect(overlaps).toEqual([]);
  });

  it('getLevelConfig returns correct level definition', () => {
    expect(getLevelConfig(1).theme).toBe('Forest Mammals');
    expect(getLevelConfig(20).theme).toBe('Verdant Sovereign');
  });
});
