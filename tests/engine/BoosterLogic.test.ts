import { GridGenerator } from '../../src/game-engine/core/GridGenerator';
import { BoosterLogic } from '../../src/game-engine/mechanics/BoosterLogic';
import { SeededPRNG } from '../../src/game-engine/core/SeededPRNG';
import { PuzzleValidator } from '../../src/game-engine/validators/PuzzleValidator';

describe('BoosterLogic', () => {
  const puzzle = GridGenerator.generate({
    rows: 8,
    cols: 8,
    words: ['SUN', 'STAR', 'MOON'],
    seed: 555,
  });

  it('Hint returns the starting coordinate of an unfound word', () => {
    const hint = BoosterLogic.getHint(puzzle);
    expect(hint).not.toBeNull();
    if (!hint) return;

    expect(['SUN', 'STAR', 'MOON']).toContain(hint.word);
    expect(hint.cell).toBeDefined();
    // Verify the grid character at that cell matches the word's first character
    expect(puzzle.grid[hint.cell.row][hint.cell.col]).toBe(hint.word[0]);
  });

  it('Reveal returns one complete remaining word', () => {
    const reveal = BoosterLogic.getReveal(puzzle);
    expect(reveal).not.toBeNull();
    if (!reveal) return;

    expect(['SUN', 'STAR', 'MOON']).toContain(reveal.word);
  });

  it('Consecutive Hints return different starting coordinates', () => {
    const hint1 = BoosterLogic.getHint(puzzle, [], []);
    expect(hint1).not.toBeNull();
    const hint2 = BoosterLogic.getHint(puzzle, [], [hint1!.cell]);
    expect(hint2).not.toBeNull();
    expect(hint2!.word).not.toBe(hint1!.word);
    expect(hint2!.cell).not.toEqual(hint1!.cell);
  });

  it('Consecutive Reveals return different remaining words', () => {
    const r1 = BoosterLogic.getReveal(puzzle, []);
    expect(r1).not.toBeNull();
    const r2 = BoosterLogic.getReveal(puzzle, [r1!.word]);
    expect(r2).not.toBeNull();
    expect(r2!.word).not.toBe(r1!.word);
  });

  it('Level 1 puzzle produces 5 distinct hints in sequence', () => {
    const p1 = GridGenerator.generate({
      rows: 8,
      cols: 8,
      words: ['TIGER', 'EAGLE', 'DOLPHIN', 'PANDA', 'ZEBRA'],
      seed: 1042,
    });
    console.log('Words placed:', p1.words.map((w) => ({ word: w.word, start: w.start })));
    const hinted: any[] = [];
    for (let i = 0; i < 5; i++) {
      const h = BoosterLogic.getHint(p1, [], hinted.map((x) => x.cell));
      console.log(`Hint ${i + 1}:`, h);
      expect(h).not.toBeNull();
      // Ensure each hint is a new cell!
      expect(hinted.some((prev) => prev.cell.row === h!.cell.row && prev.cell.col === h!.cell.col)).toBe(false);
      hinted.push(h);
    }
  });

  it('Shuffle filler scrambles the grid while preserving 100% of word cells', () => {
    const prng = new SeededPRNG(999);
    const shuffledGrid = BoosterLogic.shuffleFiller(puzzle, prng);

    const shuffledPuzzle = {
      ...puzzle,
      grid: shuffledGrid,
    };

    // The puzzle MUST still be 100% valid after shuffle!
    const report = PuzzleValidator.validate(shuffledPuzzle);
    expect(report.isValid).toBe(true);
    expect(report.verifiedWords).toBe(puzzle.words.length);
  });
});
