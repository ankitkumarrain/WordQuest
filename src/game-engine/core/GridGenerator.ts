import {
  ActivePuzzle,
  GenerationConfig,
  PlacedWord,
} from '../types';
import { SeededPRNG } from './SeededPRNG';
import { WordPlacer } from './WordPlacer';
import { LetterFiller } from './LetterFiller';

export class GridGenerator {
  /**
   * Generates a fully populated, deterministic word search puzzle.
   */
  static generate(config: GenerationConfig): ActivePuzzle {
    const {
      rows,
      cols,
      words: inputWords,
      seed,
      allowedDirections,
      maxRetries = 10,
    } = config;

    if (rows <= 0 || cols <= 0) {
      throw new Error(`Invalid grid dimensions: ${rows}x${cols}`);
    }

    if (!inputWords || inputWords.length === 0) {
      throw new Error('Word list cannot be empty');
    }

    const prng = new SeededPRNG(seed);
    const normalizedWords = inputWords.map((w) => w.trim().toUpperCase());

    // Sort words by length descending (longest words are hardest to place, so place them first)
    normalizedWords.sort((a, b) => b.length - a.length);

    let bestGrid: string[][] | null = null;
    let bestPlacedWords: PlacedWord[] = [];

    // Try multiple attempts with permuted sub-seeds if needed
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const attemptPRNG = new SeededPRNG(seed + attempt * 1000);
      let currentGrid: string[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => '')
      );
      const placedWords: PlacedWord[] = [];
      let allPlaced = true;

      for (const word of normalizedWords) {
        const result = WordPlacer.placeWord(
          currentGrid,
          word,
          allowedDirections,
          attemptPRNG
        );

        if (!result) {
          allPlaced = false;
          break;
        }

        currentGrid = result.updatedGrid;
        placedWords.push(result.placedWord);
      }

      if (allPlaced) {
        bestGrid = currentGrid;
        bestPlacedWords = placedWords;
        break;
      }

      // If partial, keep the attempt that placed the most words
      if (placedWords.length > bestPlacedWords.length) {
        bestGrid = currentGrid;
        bestPlacedWords = placedWords;
      }
    }

    if (!bestGrid) {
      throw new Error('Failed to generate word search grid within constraints');
    }

    // Fill remaining empty cells with weighted random alphabet
    const finalGrid = LetterFiller.fillEmptyCells(bestGrid, prng);

    return {
      id: `puzzle_${seed}_${rows}x${cols}`,
      seed,
      rows,
      cols,
      grid: finalGrid,
      words: bestPlacedWords,
      foundWords: [],
      totalWords: bestPlacedWords.length,
    };
  }
}
