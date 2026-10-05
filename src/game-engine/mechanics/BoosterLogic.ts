import {
  ActivePuzzle,
  GridCoordinate,
  PlacedWord,
} from '../types';
import { SeededPRNG } from '../core/SeededPRNG';
import { LetterFiller } from '../core/LetterFiller';

export class BoosterLogic {
  /**
   * Hint Booster: Returns the first cell coordinate of an unfound word.
   */
  static getHint(
    puzzle: ActivePuzzle,
    foundWordsList?: string[],
    alreadyHintedCells?: GridCoordinate[]
  ): { word: string; cell: GridCoordinate } | null {
    const foundList = foundWordsList ?? puzzle.foundWords ?? [];
    const unfound = puzzle.words.filter(
      (w) => !foundList.includes(w.word)
    );

    if (unfound.length === 0) return null;

    const hintedSet = new Set(
      (alreadyHintedCells ?? []).map((c) => `${c.row}_${c.col}`)
    );

    // 1. First priority: find an unfound word whose starting cell has not been hinted yet
    for (const w of unfound) {
      const key = `${w.start.row}_${w.start.col}`;
      if (!hintedSet.has(key)) {
        return {
          word: w.word,
          cell: w.start,
        };
      }
    }

    // 2. Second priority: if all start cells are already hinted, find ANY unhinted cell from unfound words
    for (const w of unfound) {
      for (const cell of w.cells) {
        const key = `${cell.row}_${cell.col}`;
        if (!hintedSet.has(key)) {
          return {
            word: w.word,
            cell,
          };
        }
      }
    }

    // 3. Fallback: all cells are already hinted
    return {
      word: unfound[0].word,
      cell: unfound[0].start,
    };
  }

  /**
   * Reveal Booster: Auto-selects and completes one remaining word.
   */
  static getReveal(
    puzzle: ActivePuzzle,
    foundWordsList?: string[]
  ): PlacedWord | null {
    const foundList = foundWordsList ?? puzzle.foundWords ?? [];
    const unfound = puzzle.words.filter(
      (w) => !foundList.includes(w.word)
    );

    if (unfound.length === 0) return null;
    return unfound[0];
  }

  /**
   * Shuffle Booster: Re-scrambles random filler letters across the grid
   * while strictly protecting every cell belonging to any placed word.
   */
  static shuffleFiller(puzzle: ActivePuzzle, prng: SeededPRNG): string[][] {
    const rows = puzzle.rows;
    const cols = puzzle.cols;
    const isWordCell: boolean[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => false)
    );

    // Mark all cells that belong to any placed word
    for (const placed of puzzle.words) {
      for (const cell of placed.cells) {
        isWordCell[cell.row][cell.col] = true;
      }
    }

    // Create updated grid where only filler cells receive new letters
    const updatedGrid: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        if (isWordCell[r][c]) {
          row.push(puzzle.grid[r][c]); // Preserve original word letter
        } else {
          row.push(LetterFiller.getRandomLetter(prng)); // Fresh random letter
        }
      }
      updatedGrid.push(row);
    }

    return updatedGrid;
  }
}
