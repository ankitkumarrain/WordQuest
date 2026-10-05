import { StreakService, SEVEN_DAY_LADDER } from '../../src/services/StreakService';

describe('StreakService', () => {
  it('formats dates consistently as YYYY-MM-DD', () => {
    const fixedDate = new Date('2026-09-27T10:00:00Z');
    const formatted = StreakService.formatDateKey(fixedDate);
    expect(formatted).toBe('2026-09-27');
  });

  it('computes exact day difference between date keys', () => {
    expect(StreakService.getDayDifference('2026-09-25', '2026-09-27')).toBe(2);
    expect(StreakService.getDayDifference('2026-09-26', '2026-09-27')).toBe(1);
    expect(StreakService.getDayDifference('2026-09-27', '2026-09-27')).toBe(0);
  });

  it('starts streak at 1 for brand new players without prior activity', () => {
    const result = StreakService.calculateNewStreak(0, null, '2026-09-27');
    expect(result.streak).toBe(1);
    expect(result.isNewDay).toBe(true);
    expect(result.isStreakBroken).toBe(false);
  });

  it('preserves existing streak on same day login', () => {
    const result = StreakService.calculateNewStreak(4, '2026-09-27', '2026-09-27');
    expect(result.streak).toBe(4);
    expect(result.isNewDay).toBe(false);
    expect(result.isStreakBroken).toBe(false);
  });

  it('increments streak on consecutive day login', () => {
    const result = StreakService.calculateNewStreak(3, '2026-09-26', '2026-09-27');
    expect(result.streak).toBe(4);
    expect(result.isNewDay).toBe(true);
    expect(result.isStreakBroken).toBe(false);
  });

  it('cycles streak back to 1 after reaching day 7', () => {
    const result = StreakService.calculateNewStreak(7, '2026-09-26', '2026-09-27');
    expect(result.streak).toBe(1);
    expect(result.isNewDay).toBe(true);
  });

  it('resets streak to 1 when a day is missed', () => {
    const result = StreakService.calculateNewStreak(5, '2026-09-24', '2026-09-27');
    expect(result.streak).toBe(1);
    expect(result.isNewDay).toBe(true);
    expect(result.isStreakBroken).toBe(true);
  });

  it('retrieves distinct rewards across all 7 days of the ladder', () => {
    expect(SEVEN_DAY_LADDER.length).toBe(7);
    for (let day = 1; day <= 7; day++) {
      const reward = StreakService.getRewardForDay(day);
      expect(reward.day).toBe(day);
      expect(reward.amount).toBeGreaterThan(0);
      expect(reward.rewardType).toBeDefined();
    }
  });
});
