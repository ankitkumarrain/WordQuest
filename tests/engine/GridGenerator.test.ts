import { GridGenerator } from '../../src/game-engine/core/GridGenerator';
import { PuzzleValidator } from '../../src/game-engine/validators/PuzzleValidator';

describe('GridGenerator', () => {
  const sampleWords = ['FOREST', 'RIVER', 'MOUNTAIN', 'LEAF', 'TRAIL'];

  it('generates a complete valid 10x10 puzzle', () => {
    const puzzle = GridGenerator.generate({
      rows: 10,
      cols: 10,
      words: sampleWords,
      seed: 42,
    });

    expect(puzzle.rows).toBe(10);
    expect(puzzle.cols).toBe(10);
    expect(puzzle.words.length).toBe(sampleWords.length);

    // Ensure all grid cells are populated with uppercase letters
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        expect(puzzle.grid[r][c]).toMatch(/^[A-Z]$/);
      }
    }

    // Comprehensive validation
    const report = PuzzleValidator.validate(puzzle);
    expect(report.isValid).toBe(true);
    expect(report.errors).toHaveLength(0);
    expect(report.verifiedWords).toBe(sampleWords.length);
    expect(report.wordDensity).toBeGreaterThan(0.2);
  });

  it('generates 100% identical puzzles with the same seed', () => {
    const puzzleA = GridGenerator.generate({
      rows: 8,
      cols: 8,
      words: ['APPLE', 'PEACH', 'BERRY'],
      seed: 888,
    });

    const puzzleB = GridGenerator.generate({
      rows: 8,
      cols: 8,
      words: ['APPLE', 'PEACH', 'BERRY'],
      seed: 888,
    });

    expect(puzzleA.grid).toEqual(puzzleB.grid);
    expect(puzzleA.words).toEqual(puzzleB.words);
  });

  it('generates Grandmaster 14x14 puzzle with 16 science words', () => {
    const scienceWords = [
      'GALAXY', 'PLANET', 'NEBULA', 'COMET', 'METEOR',
      'ORBIT', 'PULSAR', 'GRAVITY', 'ATOM', 'QUANTUM',
      'PHOTON', 'ENERGY', 'COSMOS', 'ECLIPSE', 'RADAR', 'OPTICS',
    ];
    const start = Date.now();
    const puzzle = GridGenerator.generate({
      rows: 14,
      cols: 14,
      words: scienceWords,
      seed: 12345,
    });
    const elapsed = Date.now() - start;
    console.log('14x14 Grandmaster generated in:', elapsed, 'ms, placed:', puzzle.words.length);
    expect(puzzle.words.length).toBe(16);
  });

  it('generates Grandmaster 16x14 puzzle with 16 science words', () => {
    const scienceWords = [
      'GALAXY', 'PLANET', 'NEBULA', 'COMET', 'METEOR',
      'ORBIT', 'PULSAR', 'GRAVITY', 'ATOM', 'QUANTUM',
      'PHOTON', 'ENERGY', 'COSMOS', 'ECLIPSE', 'RADAR', 'OPTICS',
    ];
    const puzzle = GridGenerator.generate({
      rows: 16,
      cols: 14,
      words: scienceWords,
      seed: 98765,
    });
    expect(puzzle.rows).toBe(16);
    expect(puzzle.cols).toBe(14);
    expect(puzzle.words.length).toBe(16);
  });
});
