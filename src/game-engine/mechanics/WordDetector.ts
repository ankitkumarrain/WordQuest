import { PlacedWord } from '../types';

export class WordDetector {
  /**
   * Checks if the user's selected word string matches an unfound word in the puzzle.
   * Handles forward and reverse swipes.
   */
  static matchWord(
    selectedString: string,
    puzzleWords: PlacedWord[],
    foundWords: string[]
  ): PlacedWord | null {
    if (!selectedString) return null;

    const normalized = selectedString.trim().toUpperCase();
    const reversed = normalized.split('').reverse().join('');

    for (const placed of puzzleWords) {
      if (foundWords.includes(placed.word)) {
        continue; // Already found
      }

      if (placed.word === normalized || placed.word === reversed) {
        return placed;
      }
    }

    return null;
  }
}
