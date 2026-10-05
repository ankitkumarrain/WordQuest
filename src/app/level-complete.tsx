import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, BackHandler, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { AdFactory } from '@/services/ads/AdFactory';
import { RewardService } from '@/services/RewardService';
import { AnalyticsService } from '@/services/analytics/AnalyticsService';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AudioService } from '@/services/AudioService';

export default function LevelCompleteScreen() {
  const { level = '1', stars: starsParam = '3', score = '500' } = useLocalSearchParams<{
    level?: string;
    stars?: string;
    score?: string;
  }>();
  const starCount = Math.max(1, Math.min(3, parseInt(starsParam, 10) || 3));
  const [coinsEarned, setCoinsEarned] = useState(50);
  const [adWatched, setAdWatched] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);

  const starScale1 = useRef(new Animated.Value(0)).current;
  const starScale2 = useRef(new Animated.Value(0)).current;
  const starScale3 = useRef(new Animated.Value(0)).current;

  const addCoins = usePlayerStore((s) => s.addCoins);

  useEffect(() => {
    AudioService.playLevelComplete();
    Animated.stagger(180, [
      Animated.spring(starScale1, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(starScale2, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(starScale3, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
  }, [starScale1, starScale2, starScale3]);

  const handleHome = useCallback(async () => {
    const currentLvl = parseInt(level, 10);
    const adService = AdFactory.getInstance();

    if (
      adService.shouldShowPacedInterstitial({
        currentLevel: currentLvl,
        userWatchedRewarded: adWatched,
      })
    ) {
      try {
        await adService.showInterstitialAd('level_complete_home');
      } catch (err) {
        console.warn('Interstitial ad failed:', err);
      }
    }

    router.replace('/(tabs)');
  }, [adWatched, level]);

  // Android hardware back button → go home safely
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleHome();
      return true;
    });
    return () => backHandler.remove();
  }, [handleHome]);

  const handleDoubleCoins = async () => {
    try {
      setLoadingAd(true);
      const adService = AdFactory.getInstance();
      const result = await adService.showRewardedAd('double_coins', 'coins', coinsEarned);

      if (result.rewarded) {
        await RewardService.claimAdReward('coins', coinsEarned, `level_${level}_2x`);
        await addCoins(coinsEarned);
        AudioService.playCoinCollect();

        await AnalyticsService.getInstance().logEvent('ad_rewarded', {
          placement: 'double_coins',
          level: Number(level),
          reward_amount: coinsEarned,
        });

        setCoinsEarned((prev) => prev * 2);
        setAdWatched(true);
      }
    } catch (e) {
      console.warn('Ad playback error:', e);
    } finally {
      setLoadingAd(false);
    }
  };

  const handleNextLevel = async () => {
    const currentLvl = parseInt(level, 10);
    const adService = AdFactory.getInstance();

    // Smart pacing loop: checks 3-level cadence, cooldown, and skips if rewarded ad was watched
    if (
      adService.shouldShowPacedInterstitial({
        currentLevel: currentLvl,
        userWatchedRewarded: adWatched,
      })
    ) {
      try {
        await adService.showInterstitialAd('level_complete');
      } catch (err) {
        console.warn('Interstitial ad failed:', err);
      }
    }

    const nextLevel = currentLvl + 1;
    router.replace({
      pathname: '/gameplay',
      params: { level: String(nextLevel) },
    });
  };

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.celebrationArea}>
          <Text style={[typography.caption, styles.eyebrow]}>VICTORY!</Text>
          <Text style={[typography.hero, styles.title]}>Level {level} Clear</Text>

          {/* 3 Animated Bouncy Stars */}
          <View style={styles.starsRow}>
            <Animated.View style={{ transform: [{ scale: starScale1 }] }}>
              <Icon name="star" size={48} color={starCount >= 1 ? colors.gold : colors.surfaceBorder} />
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: starScale2 }], marginHorizontal: 8 }}>
              <Icon name="star" size={62} color={starCount >= 2 ? colors.gold : colors.surfaceBorder} />
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: starScale3 }] }}>
              <Icon name="star" size={48} color={starCount >= 3 ? colors.gold : colors.surfaceBorder} />
            </Animated.View>
          </View>

          {/* Reward Card */}
          <Card variant="glowGold" style={styles.rewardCard}>
            <Text style={[typography.caption, styles.rewardLabel]}>SCORE: {score} PTS</Text>
            <View style={styles.coinAmountRow}>
              <Icon name="coin" size={32} color={colors.gold} />
              <Text style={[typography.display, styles.coinNumber]}>+{coinsEarned}</Text>
            </View>
            <Text style={[typography.bodySmall, styles.coinSub]}>COINS COLLECTED</Text>
          </Card>

          {/* Rewarded Ad Double Bonus */}
          {!adWatched && (
            <Card variant="elevated" style={styles.adBonusCard}>
              <View style={styles.adBonusHeader}>
                <View style={styles.adIconBox}>
                  <Icon name="ad-video" size={24} color={colors.primary} />
                </View>
                <View style={styles.adTextGroup}>
                  <Text style={[typography.h3, styles.adTitle]}>Double Your Reward!</Text>
                  <Text style={[typography.caption, styles.adSubtitle]}>
                    Watch a short sponsor video to get +{coinsEarned} extra coins
                  </Text>
                </View>
              </View>
              <Button
                title={loadingAd ? 'Playing Sponsor Video...' : 'Watch Ad (2x Coins)'}
                onPress={handleDoubleCoins}
                variant="gold"
                size="md"
                fullWidth
                loading={loadingAd}
                icon="ad-video"
              />
            </Card>
          )}
        </View>

        <View style={styles.footerActions}>
          <Button
            title="Next Level"
            onPress={handleNextLevel}
            variant="primary"
            size="lg"
            icon="play"
            fullWidth
          />
          <Button
            title="Back to Home"
            onPress={handleHome}
            variant="ghost"
            size="md"
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  celebrationArea: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  rewardCard: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  rewardLabel: {
    color: colors.gold,
    letterSpacing: 1,
  },
  coinAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  coinNumber: {
    color: colors.gold,
  },
  coinSub: {
    color: colors.textSecondary,
  },
  adBonusCard: {
    width: '100%',
    padding: spacing.md,
    borderColor: colors.surfaceBorderLight,
  },
  adBonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  adIconBox: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  adTextGroup: {
    flex: 1,
  },
  adTitle: {
    color: colors.text,
  },
  adSubtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  footerActions: {
    gap: spacing.xs,
    width: '100%',
  },
});
