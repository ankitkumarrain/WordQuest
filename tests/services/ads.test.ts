import { MockAdService } from '@/services/ads/MockAdService';
import { AdFactory } from '@/services/ads/AdFactory';

describe('Ad Service (Monetization)', () => {
  let adService: MockAdService;

  beforeEach(() => {
    adService = new MockAdService(10);
  });

  it('checks rewarded readiness and preloads ad assets', async () => {
    expect(adService.isRewardedReady()).toBe(true);
    await adService.preloadRewardedAd();
    expect(adService.isRewardedReady()).toBe(true);
  });

  it('shows rewarded ad and returns reward payload on success', async () => {
    const result = await adService.showRewardedAd('double_coins', 'coins', 100);

    expect(result.rewarded).toBe(true);
    expect(result.placement).toBe('double_coins');
    expect(result.rewardType).toBe('coins');
    expect(result.amount).toBe(100);
    expect(result.error).toBeUndefined();
  });

  it('handles simulated network or ad fill failure gracefully', async () => {
    adService.setShouldFailNextAd(true);

    const result = await adService.showRewardedAd('revive');

    expect(result.rewarded).toBe(false);
    expect(result.placement).toBe('revive');
    expect(result.amount).toBe(0);
    expect(result.error).toContain('Simulated Ad Network timeout');

    // Next ad should succeed normally
    const nextResult = await adService.showRewardedAd('revive');
    expect(nextResult.rewarded).toBe(true);
  });

  it('provides singleton instance via AdFactory', () => {
    const factoryInstance = AdFactory.getInstance();
    expect(factoryInstance).toBeDefined();
    expect(typeof factoryInstance.showRewardedAd).toBe('function');
    expect(typeof factoryInstance.showInterstitialAd).toBe('function');
  });

  it('checks interstitial readiness and shows interstitial ad', async () => {
    expect(adService.isInterstitialReady()).toBe(true);
    await adService.preloadInterstitialAd();
    const shown = await adService.showInterstitialAd('level_complete');
    expect(shown).toBe(true);
  });

  describe('Pacing and frequency capping loop', () => {
    it('skips interstitial if user watched a rewarded ad on the same screen', () => {
      const shouldShow = adService.shouldShowPacedInterstitial({
        currentLevel: 3,
        userWatchedRewarded: true,
      });
      expect(shouldShow).toBe(false);
    });

    it('only triggers on 3-level intervals (e.g. level 3, 6, 9)', () => {
      // Level 1 and 2 should not trigger
      expect(
        adService.shouldShowPacedInterstitial({ currentLevel: 1, userWatchedRewarded: false })
      ).toBe(false);
      expect(
        adService.shouldShowPacedInterstitial({ currentLevel: 2, userWatchedRewarded: false })
      ).toBe(false);

      // Level 3 should trigger
      expect(
        adService.shouldShowPacedInterstitial({ currentLevel: 3, userWatchedRewarded: false })
      ).toBe(true);
    });

    it('enforces cooldown between consecutive interstitial ads', async () => {
      // First ad shows
      await adService.showInterstitialAd('level_complete');

      // Next level immediately should be blocked by cooldown even if level % 3 === 0
      const blockedByCooldown = adService.shouldShowPacedInterstitial({
        currentLevel: 6,
        userWatchedRewarded: false,
      });
      expect(blockedByCooldown).toBe(false);
    });
  });
});
