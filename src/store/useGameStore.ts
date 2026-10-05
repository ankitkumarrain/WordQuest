import { create } from 'zustand';
import { ActivePuzzle } from '../game-engine/types';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'failed';

interface GameState {
  levelId: number;
  categoryId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzle: ActivePuzzle | null;
  foundWords: string[];
  score: number;
  timeRemaining: number;
  status: GameStatus;

  initLevel: (
    levelId: number,
    categoryId: string,
    difficulty: 'easy' | 'medium' | 'hard',
    puzzle: ActivePuzzle,
    durationSeconds: number
  ) => void;
  wordFound: (word: string) => boolean;
  decrementTimer: () => void;
  setStatus: (status: GameStatus) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  levelId: 1,
  categoryId: 'animals',
  difficulty: 'easy',
  puzzle: null,
  foundWords: [],
  score: 0,
  timeRemaining: 180,
  status: 'idle',

  initLevel: (levelId, categoryId, difficulty, puzzle, durationSeconds) => {
    set({
      levelId,
      categoryId,
      difficulty,
      puzzle,
      foundWords: [],
      score: 0,
      timeRemaining: durationSeconds,
      status: 'playing',
    });
  },

  wordFound: (word: string) => {
    const { foundWords, puzzle } = get();
    const upper = word.toUpperCase();
    if (foundWords.includes(upper)) return false;

    const newFound = [...foundWords, upper];
    const wordBonus = upper.length * 50;
    const isCompleted =
      puzzle !== null && newFound.length >= puzzle.words.length;

    set((state) => ({
      foundWords: newFound,
      score: state.score + wordBonus,
      status: isCompleted ? 'completed' : state.status,
    }));

    return true;
  },

  decrementTimer: () => {
    set((state) => {
      if (state.status !== 'playing') return state;
      const nextTime = state.timeRemaining - 1;
      if (nextTime <= 0) {
        return { timeRemaining: 0, status: 'failed' };
      }
      return { timeRemaining: nextTime };
    });
  },

  setStatus: (status: GameStatus) => set({ status }),

  resetGame: () => {
    set({
      puzzle: null,
      foundWords: [],
      score: 0,
      timeRemaining: 180,
      status: 'idle',
    });
  },
}));
