import { AdPlacement, AdRewardResult, IAdService } from './types';

export class MockAdService implements IAdService {
  private isLoaded = true;
  private shouldFailNextAd = false;
  private simulatedDelayMs = 50;

  constructor(simulatedDelayMs = 50) {
    this.simulatedDelayMs = simulatedDelayMs;
  }

  async preloadRewardedAd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    this.isLoaded = true;
  }

  isRewardedReady(): boolean {
    return this.isLoaded;
  }

  async showRewardedAd(
    placement: AdPlacement,
    rewardType = 'coins',
    amount = 50
  ): Promise<AdRewardResult> {
    if (this.shouldFailNextAd) {
      this.shouldFailNextAd = false;
      return {
        rewarded: false,
        placement,
        rewardType,
        amount: 0,
        error: 'Simulated Ad Network timeout',
      };
    }

    // Simulate short video playback duration
    await new Promise((resolve) => setTimeout(resolve, this.simulatedDelayMs));

    return {
      rewarded: true,
      placement,
      rewardType,
      amount,
    };
  }

  private isInterstitialLoaded = true;
  private lastInterstitialTimestamp = 0;
  private cooldownSeconds = 150; // 2.5 minutes cooldown

  async preloadInterstitialAd(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    this.isInterstitialLoaded = true;
  }

  isInterstitialReady(): boolean {
    return this.isInterstitialLoaded;
  }

  async showInterstitialAd(_placement = 'level_complete'): Promise<boolean> {
    if (!this.isInterstitialLoaded) {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, this.simulatedDelayMs));
    this.recordInterstitialShown();
    return true;
  }

  shouldShowPacedInterstitial(options: {
    currentLevel: number;
    userWatchedRewarded: boolean;
  }): boolean {
    // 1. Skip if user already watched a rewarded video on this screen
    if (options.userWatchedRewarded) {
      return false;
    }

    // 2. Pace every 3 levels (level 3, 6, 9, etc.)
    if (options.currentLevel % 3 !== 0) {
      return false;
    }

    // 3. Check cooldown between interstitial impressions
    const now = Date.now();
    const elapsedSeconds = (now - this.lastInterstitialTimestamp) / 1000;
    if (this.lastInterstitialTimestamp > 0 && elapsedSeconds < this.cooldownSeconds) {
      return false;
    }

    return true;
  }

  recordInterstitialShown(): void {
    this.lastInterstitialTimestamp = Date.now();
  }

  setShouldFailNextAd(fail: boolean): void {
    this.shouldFailNextAd = fail;
  }
}
