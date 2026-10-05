/**
 * StreakService - 7-day Daily Streak Engine
 * Evaluates consecutive calendar day logins and completions.
 */

export interface StreakDayReward {
  day: number;
  rewardType: 'coins' | 'booster_hint' | 'booster_shuffle' | 'booster_reveal';
  amount: number;
  label: string;
}

export const SEVEN_DAY_LADDER: StreakDayReward[] = [
  { day: 1, rewardType: 'coins', amount: 50, label: '50 Coins' },
  { day: 2, rewardType: 'coins', amount: 75, label: '75 Coins' },
  { day: 3, rewardType: 'booster_hint', amount: 2, label: '2 Hints' },
  { day: 4, rewardType: 'coins', amount: 120, label: '120 Coins' },
  { day: 5, rewardType: 'booster_shuffle', amount: 2, label: '2 Shuffles' },
  { day: 6, rewardType: 'coins', amount: 200, label: '200 Coins' },
  { day: 7, rewardType: 'booster_reveal', amount: 2, label: 'Super Chest (2 Reveals + 300 Coins)' },
];

export class StreakService {
  /**
   * Formats a timestamp or date into YYYY-MM-DD
   */
  static formatDateKey(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Computes the day difference between two YYYY-MM-DD keys.
   */
  static getDayDifference(dateKey1: string, dateKey2: string): number {
    const d1 = new Date(`${dateKey1}T00:00:00Z`).getTime();
    const d2 = new Date(`${dateKey2}T00:00:00Z`).getTime();
    const diffMs = d2 - d1;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculates new streak count based on last active date and today's date.
   *
   * @param currentStreak The player's existing streak count
   * @param lastActiveDate The date of their last logged action ('YYYY-MM-DD')
   * @param todayDate The current date ('YYYY-MM-DD')
   * @returns Updated streak count (1 to 7 cycle)
   */
  static calculateNewStreak(
    currentStreak: number,
    lastActiveDate: string | null,
    todayDate: string = this.formatDateKey()
  ): { streak: number; isNewDay: boolean; isStreakBroken: boolean } {
    if (!lastActiveDate) {
      return { streak: 1, isNewDay: true, isStreakBroken: false };
    }

    const diff = this.getDayDifference(lastActiveDate, todayDate);

    if (diff === 0) {
      // Same day, streak unchanged
      return { streak: currentStreak, isNewDay: false, isStreakBroken: false };
    } else if (diff === 1) {
      // Consecutive day! Advance streak, wrapping 7 back to 1
      const nextStreak = currentStreak >= 7 ? 1 : currentStreak + 1;
      return { streak: nextStreak, isNewDay: true, isStreakBroken: false };
    } else {
      // Missed one or more days, streak resets to 1
      return { streak: 1, isNewDay: true, isStreakBroken: true };
    }
  }

  /**
   * Returns the reward for a given streak day (1 to 7).
   */
  static getRewardForDay(day: number): StreakDayReward {
    const normalizedDay = ((day - 1) % 7) + 1;
    return SEVEN_DAY_LADDER[normalizedDay - 1];
  }

  /**
   * Calculates current and longest consecutive streak from a list of YYYY-MM-DD date strings.
   */
  static calculateStreak(dates: string[] = []): { currentStreak: number; longestStreak: number } {
    if (!dates || dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const uniqueSorted = Array.from(new Set(dates)).sort();
    if (uniqueSorted.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let longest = 1;
    let currentRun = 1;

    for (let i = 1; i < uniqueSorted.length; i++) {
      const diff = this.getDayDifference(uniqueSorted[i - 1], uniqueSorted[i]);
      if (diff === 1) {
        currentRun++;
        if (currentRun > longest) longest = currentRun;
      } else if (diff > 1) {
        currentRun = 1;
      }
    }

    const today = this.formatDateKey();
    const lastDate = uniqueSorted[uniqueSorted.length - 1];
    const diffFromToday = this.getDayDifference(lastDate, today);

    // If latest completion is today (0) or yesterday (1), streak is active
    const activeStreak = diffFromToday <= 1 ? currentRun : 0;

    return {
      currentStreak: activeStreak,
      longestStreak: Math.max(longest, activeStreak),
    };
  }
}
