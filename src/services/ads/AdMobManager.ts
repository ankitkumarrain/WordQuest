import {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  TestIds,
  AdsConsent,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';
import {
  AdPlacement,
  AdRewardResult,
  IAdService,
  InterstitialPacingOptions,
} from './types';
import { ENV } from '@/config/env';

/**
 * AdMobManager provides real Google Mobile Ads Rewarded Video and Interstitial management.
 * Preloads ads in memory for instant display and handles pacing loops.
 * Integrates Google UMP (User Messaging Platform) for GDPR/EEA policy compliance.
 */
export class AdMobManager implements IAdService {
  private rewardedAdUnitId: string;
  private interstitialAdUnitId: string;

  private rewardedAd: RewardedAd | null = null;
  private interstitialAd: InterstitialAd | null = null;

  private isLoaded = false;
  private isPreloading = false;

  private isInterstitialLoaded = false;
  private isInterstitialPreloading = false;

  private lastInterstitialTimestamp = 0;
  private cooldownSeconds = 150; // 2.5 minutes cooldown between full-screen ads

  constructor() {
    this.rewardedAdUnitId = ENV.isDev
      ? TestIds.REWARDED
      : (ENV.admob.rewardedAdUnitId || TestIds.REWARDED);

    this.interstitialAdUnitId = ENV.isDev
      ? TestIds.INTERSTITIAL
      : (ENV.admob.interstitialAdUnitId || TestIds.INTERSTITIAL);

    // Request Google UMP GDPR Consent flow before preloading ads
    this.requestConsentAndInit().catch(() => {
      this.preloadRewardedAd();
      this.preloadInterstitialAd();
    });
  }

  async requestConsentAndInit(): Promise<void> {
    try {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (
        consentInfo.isConsentFormAvailable &&
        (consentInfo.status === AdsConsentStatus.REQUIRED ||
          consentInfo.status === AdsConsentStatus.UNKNOWN)
      ) {
        await AdsConsent.loadAndShowConsentFormIfRequired();
      }
    } catch (e) {
      console.warn('[AdMobManager] UMP Consent update skipped or failed:', e);
    } finally {
      this.preloadRewardedAd();
      this.preloadInterstitialAd();
    }
  }

  static async showPrivacyOptionsForm(): Promise<void> {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch (e) {
      console.warn('[AdMobManager] Failed to show privacy options form:', e);
    }
  }

  async preloadRewardedAd(): Promise<void> {
    if (this.isPreloading || this.isLoaded) return;
    this.isPreloading = true;

    try {
      const rewarded = RewardedAd.createForAdRequest(this.rewardedAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isPreloading = false;
        this.rewardedAd = rewarded;
      });

      rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('[AdMobManager] Rewarded ad failed to load:', error);
        this.isLoaded = false;
        this.isPreloading = false;
        this.rewardedAd = null;
      });

      rewarded.load();
    } catch (e) {
      console.warn('[AdMobManager] Rewarded preload error:', e);
      this.isPreloading = false;
    }
  }

  async preloadInterstitialAd(): Promise<void> {
    if (this.isInterstitialPreloading || this.isInterstitialLoaded) return;
    this.isInterstitialPreloading = true;

    try {
      const interstitial = InterstitialAd.createForAdRequest(
        this.interstitialAdUnitId,
        {
          requestNonPersonalizedAdsOnly: true,
        }
      );

      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialLoaded = true;
        this.isInterstitialPreloading = false;
        this.interstitialAd = interstitial;
      });

      interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('[AdMobManager] Interstitial ad failed to load:', error);
        this.isInterstitialLoaded = false;
        this.isInterstitialPreloading = false;
        this.interstitialAd = null;
      });

      interstitial.load();
    } catch (e) {
      console.warn('[AdMobManager] Interstitial preload error:', e);
      this.isInterstitialPreloading = false;
    }
  }

  isRewardedReady(): boolean {
    return this.isLoaded && this.rewardedAd !== null;
  }

  isInterstitialReady(): boolean {
    return this.isInterstitialLoaded && this.interstitialAd !== null;
  }

  async showRewardedAd(
    placement: AdPlacement,
    rewardType = 'coins',
    amount = 50
  ): Promise<AdRewardResult> {
    return new Promise((resolve) => {
      if (!this.isRewardedReady() || !this.rewardedAd) {
        this.preloadRewardedAd();
        resolve({
          rewarded: false,
          placement,
          rewardType,
          amount: 0,
          error: 'Ad is loading, please try again in a few seconds.',
        });
        return;
      }

      const ad = this.rewardedAd;
      let earnedReward = false;

      const unsubscribeEarned = ad.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          earnedReward = true;
        }
      );

      const unsubscribeClosed = ad.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubscribeEarned();
          unsubscribeClosed();
          unsubscribeError();
          this.isLoaded = false;
          this.rewardedAd = null;
          this.preloadRewardedAd();

          resolve({
            rewarded: earnedReward,
            placement,
            rewardType,
            amount: earnedReward ? amount : 0,
          });
        }
      );

      const unsubscribeError = ad.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          unsubscribeEarned();
          unsubscribeClosed();
          unsubscribeError();
          this.isLoaded = false;
          this.rewardedAd = null;
          this.preloadRewardedAd();

          resolve({
            rewarded: false,
            placement,
            rewardType,
            amount: 0,
            error: error.message || 'Ad playback error',
          });
        }
      );

      ad.show();
    });
  }

  async showInterstitialAd(_placement = 'level_complete'): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isInterstitialReady() || !this.interstitialAd) {
        this.preloadInterstitialAd();
        resolve(false);
        return;
      }

      const ad = this.interstitialAd;

      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribeClosed();
        unsubscribeError();
        this.isInterstitialLoaded = false;
        this.interstitialAd = null;
        this.recordInterstitialShown();
        this.preloadInterstitialAd();
        resolve(true);
      });

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
        unsubscribeClosed();
        unsubscribeError();
        console.warn('[AdMobManager] Interstitial playback error:', error);
        this.isInterstitialLoaded = false;
        this.interstitialAd = null;
        this.preloadInterstitialAd();
        resolve(false);
      });

      ad.show();
    });
  }

  shouldShowPacedInterstitial(options: InterstitialPacingOptions): boolean {
    // 1. Skip if user already watched a rewarded video on this screen
    if (options.userWatchedRewarded) {
      return false;
    }

    // 2. Pace every 3 levels (level 3, 6, 9, etc.)
    if (options.currentLevel % 3 !== 0) {
      return false;
    }

    // 3. Check cooldown between interstitial impressions (2.5 mins)
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

  getRewardedAdUnitId(): string {
    return this.rewardedAdUnitId;
  }

  getInterstitialAdUnitId(): string {
    return this.interstitialAdUnitId;
  }
}

