import {
  GridCoordinate,
  WordDirection,
  PlacedWord,
  DIRECTION_VECTORS,
} from '../types';
import { SeededPRNG } from './SeededPRNG';

const ALL_DIRECTIONS: WordDirection[] = [
  'HORIZONTAL_LR',
  'HORIZONTAL_RL',
  'VERTICAL_TB',
  'VERTICAL_BT',
  'DIAGONAL_TL_BR',
  'DIAGONAL_BR_TL',
  'DIAGONAL_BL_TR',
  'DIAGONAL_TR_BL',
];

interface PlacementCandidate {
  start: GridCoordinate;
  end: GridCoordinate;
  direction: WordDirection;
  cells: GridCoordinate[];
  intersections: number;
}

export class WordPlacer {
  /**
   * Attempts to place a word on the grid.
   * Prioritizes positions with letter intersections to make puzzles dense and satisfying.
   */
  static placeWord(
    grid: string[][],
    rawWord: string,
    allowedDirections: WordDirection[] = ALL_DIRECTIONS,
    prng: SeededPRNG
  ): { placedWord: PlacedWord; updatedGrid: string[][] } | null {
    const word = rawWord.trim().toUpperCase();
    const rows = grid.length;
    const cols = grid[0].length;
    const len = word.length;

    if (len > Math.max(rows, cols)) {
      return null; // Word exceeds maximum grid dimension
    }

    const candidates: PlacementCandidate[] = [];

    // Evaluate all valid coordinates and directions
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (const dir of allowedDirections) {
          const { dRow, dCol } = DIRECTION_VECTORS[dir];
          const endRow = r + (len - 1) * dRow;
          const endCol = c + (len - 1) * dCol;

          // Check bounds
          if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
            continue;
          }

          let canPlace = true;
          let intersections = 0;
          const cells: GridCoordinate[] = [];

          for (let i = 0; i < len; i++) {
            const currRow = r + i * dRow;
            const currCol = c + i * dCol;
            const existingLetter = grid[currRow][currCol];
            const neededLetter = word[i];

            if (existingLetter && existingLetter !== neededLetter) {
              canPlace = false;
              break;
            }

            if (existingLetter === neededLetter) {
              intersections++;
            }

            cells.push({ row: currRow, col: currCol });
          }

          if (canPlace) {
            candidates.push({
              start: { row: r, col: c },
              end: { row: endRow, col: endCol },
              direction: dir,
              cells,
              intersections,
            });
          }
        }
      }
    }

    if (candidates.length === 0) {
      return null;
    }

    // Sort by intersection score descending, with random tie-breaking
    candidates.sort((a, b) => b.intersections - a.intersections);

    // Pick among the top tier of candidates to maintain variability while preferring intersections
    const maxIntersections = candidates[0].intersections;
    const topCandidates = candidates.filter(
      (c) => c.intersections >= Math.max(0, maxIntersections - 1)
    );
    const chosen = prng.choice(topCandidates);

    // Write letters to grid
    const updatedGrid = grid.map((row) => [...row]);
    for (let i = 0; i < len; i++) {
      const { row, col } = chosen.cells[i];
      updatedGrid[row][col] = word[i];
    }

    return {
      placedWord: {
        word,
        start: chosen.start,
        end: chosen.end,
        direction: chosen.direction,
        cells: chosen.cells,
        found: false,
        hinted: false,
      },
      updatedGrid,
    };
  }
}
