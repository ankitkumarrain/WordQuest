import { SeededPRNG } from './SeededPRNG';

/**
 * Standard English letter frequency distribution (Scrabble/natural language weighted)
 */
const WEIGHTED_ALPHABET =
  'EEEEEEEEEEEE' +
  'AAAAAAAAA' +
  'IIIIIIIII' +
  'OOOOOOOO' +
  'NNNNNN' +
  'RRRRRR' +
  'TTTTTT' +
  'LLLL' +
  'SSSS' +
  'UUUU' +
  'DDDD' +
  'GGGG' +
  'BB' +
  'CC' +
  'MM' +
  'PP' +
  'FF' +
  'HH' +
  'VV' +
  'WW' +
  'YY' +
  'K' +
  'J' +
  'X' +
  'Q' +
  'Z';

export class LetterFiller {
  /**
   * Returns a pseudo-random uppercase letter based on English frequency
   */
  static getRandomLetter(prng: SeededPRNG): string {
    const idx = prng.nextInt(0, WEIGHTED_ALPHABET.length - 1);
    return WEIGHTED_ALPHABET[idx];
  }

  /**
   * Fills all empty cells in the grid with random weighted letters
   */
  static fillEmptyCells(grid: string[][], prng: SeededPRNG): string[][] {
    const rows = grid.length;
    const cols = grid[0].length;
    const filledGrid: string[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c] || grid[r][c] === ' ' || grid[r][c] === '') {
          row.push(this.getRandomLetter(prng));
        } else {
          row.push(grid[r][c]);
        }
      }
      filledGrid.push(row);
    }

    return filledGrid;
  }
}
