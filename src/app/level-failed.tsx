import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
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
import { AnalyticsService } from '@/services/analytics/AnalyticsService';
import { AudioService } from '@/services/AudioService';

export default function LevelFailedScreen() {
  const { level = '1' } = useLocalSearchParams<{ level?: string }>();
  const [loadingAd, setLoadingAd] = useState(false);

  useEffect(() => {
    AudioService.playLevelFailed();
  }, []);

  // Android hardware back button → go home safely
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/(tabs)');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSecondChanceAd = async () => {
    try {
      setLoadingAd(true);
      const adService = AdFactory.getInstance();
      const result = await adService.showRewardedAd('revive');

      if (result.rewarded) {
        await AnalyticsService.getInstance().logEvent('ad_rewarded', {
          placement: 'revive',
          level: Number(level),
        });

        // Return to gameplay with extra 60 seconds
        router.replace({
          pathname: '/gameplay',
          params: { level, revived: 'true' },
        });
      }
    } catch (e) {
      console.warn('Revive ad error:', e);
    } finally {
      setLoadingAd(false);
    }
  };

  const handleRetry = () => {
    router.replace({
      pathname: '/gameplay',
      params: { level },
    });
  };

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.statusArea}>
          <View style={styles.iconCircle}>
            <Icon name="timer" size={48} color={colors.danger} />
          </View>
          <Text style={[typography.h1, styles.title]}>Time&apos;s Up!</Text>
          <Text style={[typography.body, styles.subtitle]}>
            You were so close! Don&apos;t give up on Level {level}.
          </Text>

          {/* Second Chance Ad Card */}
          <Card variant="glowTeal" style={styles.secondChanceCard}>
            <View style={styles.adHeader}>
              <View style={styles.adIconCircle}>
                <Icon name="ad-video" size={24} color={colors.primary} />
              </View>
              <View style={styles.adTextGroup}>
                <Text style={[typography.h3, styles.adTitle]}>Second Chance</Text>
                <Text style={[typography.caption, styles.adSubtitle]}>
                  Watch a short video to get +60s and keep your progress!
                </Text>
              </View>
            </View>
            <Button
              title={loadingAd ? 'Loading Video...' : 'Watch Ad & Continue'}
              onPress={handleSecondChanceAd}
              variant="primary"
              size="md"
              fullWidth
              loading={loadingAd}
              icon="ad-video"
            />
          </Card>
        </View>

        <View style={styles.footerActions}>
          <Button
            title="Retry Level"
            onPress={handleRetry}
            variant="outline"
            size="lg"
            icon="refresh"
            fullWidth
          />
          <Button
            title="Exit to Home"
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
  statusArea: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.dangerMuted,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.xxl,
  },
  secondChanceCard: {
    width: '100%',
    padding: spacing.lg,
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  adIconCircle: {
    width: 44,
    height: 44,
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
