import { ActivePuzzle } from '../types';

export interface ValidationReport {
  isValid: boolean;
  totalWords: number;
  verifiedWords: number;
  wordDensity: number; // Ratio of word characters to total grid cells
  errors: string[];
}

export class PuzzleValidator {
  /**
   * Performs an exhaustive integrity audit of a generated puzzle.
   */
  static validate(puzzle: ActivePuzzle): ValidationReport {
    const errors: string[] = [];
    const rows = puzzle.rows;
    const cols = puzzle.cols;
    let verifiedCount = 0;

    const uniqueWordCells = new Set<string>();

    for (const placed of puzzle.words) {
      const len = placed.word.length;

      if (placed.cells.length !== len) {
        errors.push(
          `Word "${placed.word}" has cell length mismatch: expected ${len}, got ${placed.cells.length}`
        );
        continue;
      }

      let wordMatches = true;

      for (let i = 0; i < len; i++) {
        const { row, col } = placed.cells[i];

        if (row < 0 || row >= rows || col < 0 || col >= cols) {
          errors.push(
            `Word "${placed.word}" cell [${row}, ${col}] is out of grid bounds`
          );
          wordMatches = false;
          break;
        }

        const letterInGrid = puzzle.grid[row][col];
        const expectedLetter = placed.word[i];

        if (letterInGrid !== expectedLetter) {
          errors.push(
            `Word "${placed.word}" character mismatch at [${row}, ${col}]: expected "${expectedLetter}", found "${letterInGrid}"`
          );
          wordMatches = false;
          break;
        }

        uniqueWordCells.add(`${row}_${col}`);
      }

      if (wordMatches) {
        verifiedCount++;
      }
    }

    const totalCells = rows * cols;
    const wordDensity = totalCells > 0 ? uniqueWordCells.size / totalCells : 0;

    return {
      isValid: errors.length === 0 && verifiedCount === puzzle.words.length,
      totalWords: puzzle.words.length,
      verifiedWords: verifiedCount,
      wordDensity,
      errors,
    };
  }
}
