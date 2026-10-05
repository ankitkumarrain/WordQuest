import { WordPlacer } from '../../src/game-engine/core/WordPlacer';
import { SeededPRNG } from '../../src/game-engine/core/SeededPRNG';
import { WordDirection } from '../../src/game-engine/types';

describe('WordPlacer', () => {
  const createEmptyGrid = (rows: number, cols: number): string[][] =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));

  it('places a horizontal word on an empty grid', () => {
    const grid = createEmptyGrid(8, 8);
    const prng = new SeededPRNG(1);
    const result = WordPlacer.placeWord(grid, 'QUEST', ['HORIZONTAL_LR'], prng);

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.placedWord.word).toBe('QUEST');
    expect(result.placedWord.direction).toBe('HORIZONTAL_LR');
    expect(result.placedWord.cells.length).toBe(5);

    // Verify letters in updatedGrid
    const { start } = result.placedWord;
    for (let i = 0; i < 5; i++) {
      expect(result.updatedGrid[start.row][start.col + i]).toBe('QUEST'[i]);
    }
  });

  it('places words across all 8 directions', () => {
    const allDirs: WordDirection[] = [
      'HORIZONTAL_LR',
      'HORIZONTAL_RL',
      'VERTICAL_TB',
      'VERTICAL_BT',
      'DIAGONAL_TL_BR',
      'DIAGONAL_BR_TL',
      'DIAGONAL_BL_TR',
      'DIAGONAL_TR_BL',
    ];

    for (const dir of allDirs) {
      const grid = createEmptyGrid(10, 10);
      const prng = new SeededPRNG(42);
      const result = WordPlacer.placeWord(grid, 'TEST', [dir], prng);

      expect(result).not.toBeNull();
      expect(result?.placedWord.direction).toBe(dir);
    }
  });

  it('allows valid letter intersections', () => {
    const grid = createEmptyGrid(6, 6);
    // Manually place "CAT" horizontally at [2, 1], [2, 2], [2, 3]
    grid[2][1] = 'C';
    grid[2][2] = 'A';
    grid[2][3] = 'T';

    const prng = new SeededPRNG(10);
    // Place "ACT" which shares 'A' at [2, 2]
    const result = WordPlacer.placeWord(grid, 'ACT', ['VERTICAL_TB'], prng);

    expect(result).not.toBeNull();
    if (!result) return;

    // Must still contain the existing letters
    expect(result.updatedGrid[2][1]).toBe('C');
    expect(result.updatedGrid[2][2]).toBe('A');
    expect(result.updatedGrid[2][3]).toBe('T');
  });

  it('rejects placement when a word conflicts with existing letters', () => {
    const grid = createEmptyGrid(3, 3);
    // Fill with 'Z'
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        grid[r][c] = 'Z';
      }
    }

    const prng = new SeededPRNG(99);
    // Placing "CAT" should fail because no 'Z' exists in "CAT"
    const result = WordPlacer.placeWord(grid, 'CAT', undefined, prng);
    expect(result).toBeNull();
  });
});
