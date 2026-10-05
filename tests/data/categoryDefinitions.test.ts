import {
  CATEGORY_DEFINITIONS,
  getCategoryConfig,
} from '../../src/data/categories';

describe('Category Definitions and Word Banks', () => {
  const expectedCategories = [
    'cat-animals',
    'cat-nature',
    'cat-science',
    'cat-food',
    'cat-travel',
    'cat-technology',
  ];

  it('contains all 6 expected categories', () => {
    for (const catId of expectedCategories) {
      expect(CATEGORY_DEFINITIONS[catId]).toBeDefined();
      expect(CATEGORY_DEFINITIONS[catId].id).toBe(catId);
    }
  });

  it('each category has at least 20 valid words with no internal duplicates', () => {
    for (const catId of expectedCategories) {
      const cat = CATEGORY_DEFINITIONS[catId];
      expect(cat.words.length).toBeGreaterThanOrEqual(20);

      const uniqueSet = new Set(cat.words);
      expect(uniqueSet.size).toBe(cat.words.length);

      for (const word of cat.words) {
        expect(word).toBe(word.toUpperCase());
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(10);
        expect(/^[A-Z]+$/.test(word)).toBe(true);
      }
    }
  });

  it('getCategoryConfig retrieves the correct category', () => {
    const science = getCategoryConfig('cat-science');
    expect(science).not.toBeNull();
    expect(science?.name).toBe('Science & Cosmos');
    expect(science?.words).toContain('GALAXY');
    expect(science?.words).toContain('ATOM');

    const invalid = getCategoryConfig('non-existent');
    expect(invalid).toBeNull();
  });
});
