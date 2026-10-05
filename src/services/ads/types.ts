export type AdPlacement =
  | 'double_coins'
  | 'revive'
  | 'free_hint'
  | 'shop_coins'
  | 'daily_bonus';

export interface AdRewardResult {
  rewarded: boolean;
  placement: AdPlacement;
  rewardType: string;
  amount: number;
  error?: string;
}

export interface InterstitialPacingOptions {
  currentLevel: number;
  userWatchedRewarded: boolean;
}

export interface IAdService {
  /**
   * Preload rewarded video ad asset into memory.
   */
  preloadRewardedAd(): Promise<void>;

  /**
   * Check if a rewarded video ad is loaded and ready to present.
   */
  isRewardedReady(): boolean;

  /**
   * Show rewarded video ad for a specific gameplay reward placement.
   */
  showRewardedAd(
    placement: AdPlacement,
    rewardType?: string,
    amount?: number
  ): Promise<AdRewardResult>;

  /**
   * Preload interstitial full-screen ad into memory.
   */
  preloadInterstitialAd(): Promise<void>;

  /**
   * Check if interstitial ad is loaded and ready.
   */
  isInterstitialReady(): boolean;

  /**
   * Show interstitial full-screen ad.
   */
  showInterstitialAd(placement?: string): Promise<boolean>;

  /**
   * Evaluate whether a paced interstitial ad should be displayed.
   * Enforces 3-level interval, time cooldown, and skips if rewarded ad was already watched.
   */
  shouldShowPacedInterstitial(options: InterstitialPacingOptions): boolean;

  /**
   * Record that an interstitial ad was displayed to update cooldown timers.
   */
  recordInterstitialShown(): void;
}
