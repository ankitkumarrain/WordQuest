import { RewardLedgerRepository } from '../database/repositories/RewardLedgerRepository';

export interface ClaimResult {
  success: boolean;
  duplicate: boolean;
  newBalance: number;
}

export class RewardService {
  /**
   * Generates a unique, collision-resistant transaction ID.
   */
  static generateGrantId(prefix: string): string {
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${timestamp}_${randomHex}`;
  }

  /**
   * Idempotently claims level completion coins.
   */
  static async claimLevelCompletionReward(
    levelId: number,
    baseCoins: number
  ): Promise<ClaimResult> {
    const grantId = `level_complete_${levelId}`;
    return RewardLedgerRepository.claimReward(
      grantId,
      'coins',
      baseCoins,
      `level_${levelId}`
    );
  }

  /**
   * Idempotently claims daily challenge coins.
   */
  static async claimDailyChallengeReward(
    dateKey: string,
    coins: number
  ): Promise<ClaimResult> {
    const grantId = `daily_challenge_${dateKey}`;
    return RewardLedgerRepository.claimReward(
      grantId,
      'coins',
      coins,
      `daily_${dateKey}`
    );
  }

  /**
   * Idempotently claims daily streak bonus.
   */
  static async claimDailyStreakReward(
    dateKey: string,
    day: number,
    rewardType: string,
    amount: number
  ): Promise<ClaimResult> {
    const grantId = `streak_${dateKey}_d${day}`;
    return RewardLedgerRepository.claimReward(
      grantId,
      rewardType,
      amount,
      `streak_day_${day}`
    );
  }

  /**
   * Idempotently claims rewarded video bonus (e.g. 2x coins).
   */
  static async claimAdReward(
    rewardType: string,
    amount: number,
    placement: string
  ): Promise<ClaimResult> {
    const grantId = this.generateGrantId(`ad_${placement}`);
    return RewardLedgerRepository.claimReward(
      grantId,
      rewardType,
      amount,
      `ad_placement_${placement}`
    );
  }
}
