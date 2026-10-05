import {
  GridCoordinate,
  WordDirection,
  RaycastResult,
} from '../types';

export class Raycaster {
  /**
   * Projects a continuous straight ray from startCell to currentCell.
   * Enforces 8 strict discrete directions: Horizontal, Vertical, Diagonal.
   * Returns in O(N) where N is the line length.
   */
  static projectLine(
    start: GridCoordinate,
    current: GridCoordinate,
    grid?: string[][]
  ): RaycastResult {
    const dRow = current.row - start.row;
    const dCol = current.col - start.col;

    // Single cell selected
    if (dRow === 0 && dCol === 0) {
      const letter = grid && grid[start.row] ? grid[start.row][start.col] : '';
      return {
        valid: true,
        cells: [start],
        wordString: letter,
      };
    }

    const absRow = Math.abs(dRow);
    const absCol = Math.abs(dCol);

    let direction: WordDirection | undefined;
    let stepRow = 0;
    let stepCol = 0;
    let length = 0;

    // 1. Horizontal
    if (dRow === 0 && dCol !== 0) {
      stepRow = 0;
      stepCol = dCol > 0 ? 1 : -1;
      direction = dCol > 0 ? 'HORIZONTAL_LR' : 'HORIZONTAL_RL';
      length = absCol + 1;
    }
    // 2. Vertical
    else if (dCol === 0 && dRow !== 0) {
      stepRow = dRow > 0 ? 1 : -1;
      stepCol = 0;
      direction = dRow > 0 ? 'VERTICAL_TB' : 'VERTICAL_BT';
      length = absRow + 1;
    }
    // 3. Diagonal
    else if (absRow === absCol) {
      stepRow = dRow > 0 ? 1 : -1;
      stepCol = dCol > 0 ? 1 : -1;
      length = absRow + 1;

      if (stepRow === 1 && stepCol === 1) direction = 'DIAGONAL_TL_BR';
      else if (stepRow === -1 && stepCol === -1) direction = 'DIAGONAL_BR_TL';
      else if (stepRow === -1 && stepCol === 1) direction = 'DIAGONAL_BL_TR';
      else direction = 'DIAGONAL_TR_BL';
    } else {
      // Non-straight drag angle
      return {
        valid: false,
        cells: [],
        wordString: '',
      };
    }

    const cells: GridCoordinate[] = [];
    let wordString = '';

    for (let i = 0; i < length; i++) {
      const r = start.row + i * stepRow;
      const c = start.col + i * stepCol;
      cells.push({ row: r, col: c });

      if (grid && grid[r] && grid[r][c] !== undefined) {
        wordString += grid[r][c];
      }
    }

    return {
      valid: true,
      direction,
      cells,
      wordString,
    };
  }

  /**
   * Snaps a non-straight coordinate to the closest of the 8 canonical rays.
   * Crucial for mobile touch tolerance when a player's finger slightly drifts off-axis.
   */
  static snapToCanonical(
    start: GridCoordinate,
    current: GridCoordinate
  ): GridCoordinate {
    const dRow = current.row - start.row;
    const dCol = current.col - start.col;

    if (dRow === 0 || dCol === 0) {
      return current; // Already strictly axis-aligned
    }

    const absRow = Math.abs(dRow);
    const absCol = Math.abs(dCol);

    if (absRow === absCol) {
      return current; // Already strictly diagonal
    }

    // If angle is closer to diagonal (ratio > 0.5 and < 1.5)
    if (absRow / absCol > 0.45 && absRow / absCol < 1.8) {
      const commonDelta = Math.round((absRow + absCol) / 2);
      return {
        row: start.row + Math.sign(dRow) * commonDelta,
        col: start.col + Math.sign(dCol) * commonDelta,
      };
    }

    // Closer to pure horizontal
    if (absCol > absRow) {
      return {
        row: start.row,
        col: current.col,
      };
    }

    // Closer to pure vertical
    return {
      row: current.row,
      col: start.col,
    };
  }
}
