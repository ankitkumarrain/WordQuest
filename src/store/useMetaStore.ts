import { create } from 'zustand';
import { StreakService, SEVEN_DAY_LADDER } from '../services/StreakService';
import { RewardService } from '../services/RewardService';
import { ProgressionRepository } from '../database/repositories/ProgressionRepository';
import { DailyChallengeRepository } from '../database/repositories/DailyChallengeRepository';
import { usePlayerStore } from './usePlayerStore';

interface MetaState {
  currentStreak: number;
  lastActiveDate: string | null;
  hasClaimedTodayStreak: boolean;
  totalStars: number;
  highestCompletedLevel: number;
  isDailyChallengeDone: boolean;

  refreshMeta: () => Promise<void>;
  claimDailyStreak: () => Promise<boolean>;
  completeDailyChallenge: (score: number, timeSeconds: number) => Promise<boolean>;
}

export const useMetaStore = create<MetaState>((set, get) => ({
  currentStreak: 1,
  lastActiveDate: null,
  hasClaimedTodayStreak: false,
  totalStars: 0,
  highestCompletedLevel: 0,
  isDailyChallengeDone: false,

  refreshMeta: async () => {
    try {
      const today = StreakService.formatDateKey();
      const stars = await ProgressionRepository.getTotalStars();
      const highestLevel = await ProgressionRepository.getHighestCompletedLevel();
      const todayChallenge = await DailyChallengeRepository.getChallenge(today);

      const { currentStreak, lastActiveDate } = get();
      const streakCalc = StreakService.calculateNewStreak(
        currentStreak,
        lastActiveDate,
        today
      );

      set({
        totalStars: stars,
        highestCompletedLevel: highestLevel,
        currentStreak: streakCalc.streak,
        isDailyChallengeDone: todayChallenge?.completed ?? false,
      });
    } catch (e) {
      console.warn('Meta store refresh fallback:', e);
    }
  },

  claimDailyStreak: async () => {
    const { currentStreak, hasClaimedTodayStreak } = get();
    if (hasClaimedTodayStreak) return false;

    const today = StreakService.formatDateKey();
    const reward = SEVEN_DAY_LADDER[(currentStreak - 1) % 7];

    const claim = await RewardService.claimDailyStreakReward(
      today,
      reward.day,
      reward.rewardType,
      reward.amount
    );

    if (claim.success) {
      if (reward.rewardType === 'coins') {
        usePlayerStore.getState().addCoins(reward.amount);
      } else {
        usePlayerStore.getState().addBooster(reward.rewardType, reward.amount);
      }

      set({
        hasClaimedTodayStreak: true,
        lastActiveDate: today,
      });
      return true;
    }

    return false;
  },

  completeDailyChallenge: async (score: number, timeSeconds: number) => {
    const today = StreakService.formatDateKey();
    await DailyChallengeRepository.saveCompletion(today, score, timeSeconds);

    const reward = await RewardService.claimDailyChallengeReward(today, 100);
    if (reward.success) {
      usePlayerStore.getState().addCoins(100);
      await DailyChallengeRepository.markRewardClaimed(today);
    }

    set({ isDailyChallengeDone: true });
    return true;
  },
}));
