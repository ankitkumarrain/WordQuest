/**
 * Core Game Engine Type Definitions
 * 100% Pure TypeScript with zero React or DOM dependencies.
 */

export interface GridCoordinate {
  row: number;
  col: number;
}

export type WordDirection =
  | 'HORIZONTAL_LR'
  | 'HORIZONTAL_RL'
  | 'VERTICAL_TB'
  | 'VERTICAL_BT'
  | 'DIAGONAL_TL_BR'
  | 'DIAGONAL_BR_TL'
  | 'DIAGONAL_BL_TR'
  | 'DIAGONAL_TR_BL';

export interface DirectionVector {
  dRow: number;
  dCol: number;
  direction: WordDirection;
}

export const DIRECTION_VECTORS: Record<WordDirection, { dRow: number; dCol: number }> = {
  HORIZONTAL_LR: { dRow: 0, dCol: 1 },
  HORIZONTAL_RL: { dRow: 0, dCol: -1 },
  VERTICAL_TB: { dRow: 1, dCol: 0 },
  VERTICAL_BT: { dRow: -1, dCol: 0 },
  DIAGONAL_TL_BR: { dRow: 1, dCol: 1 },
  DIAGONAL_BR_TL: { dRow: -1, dCol: -1 },
  DIAGONAL_BL_TR: { dRow: -1, dCol: 1 },
  DIAGONAL_TR_BL: { dRow: 1, dCol: -1 },
};

export interface PlacedWord {
  word: string;
  start: GridCoordinate;
  end: GridCoordinate;
  direction: WordDirection;
  cells: GridCoordinate[];
  found: boolean;
  hinted: boolean;
}

export interface ActivePuzzle {
  id: string;
  seed: number;
  rows: number;
  cols: number;
  grid: string[][];
  words: PlacedWord[];
  foundWords: string[];
  totalWords: number;
}

export interface GenerationConfig {
  rows: number;
  cols: number;
  words: string[];
  seed: number;
  allowedDirections?: WordDirection[];
  maxRetries?: number;
}

export interface RaycastResult {
  valid: boolean;
  direction?: WordDirection;
  cells: GridCoordinate[];
  wordString: string;
}
