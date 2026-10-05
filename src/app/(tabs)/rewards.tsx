import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { ProgressBar } from '@/components/common/ProgressBar';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';

import { usePlayerStore } from '@/store/usePlayerStore';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';

export default function RewardsScreen() {
  const coins = usePlayerStore((s) => s.coins);
  const [streakDays, setStreakDays] = React.useState(1);

  React.useEffect(() => {
    DailyChallengeRepository.getHistory().then((history) => {
      const dates = history.map((h) => h.date);
      const s = StreakService.calculateStreak(dates);
      setStreakDays(s.currentStreak);
    });
  }, []);

  return (
    <ScreenContainer
      title="Rewards & Bonuses"
      subtitle="Complete tasks and earn virtual coins"
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      {/* Daily Login Card */}
      <Card variant="glowGold" style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.gold }]}>DAILY LOGIN</Text>
            <Text style={[typography.h2, styles.cardTitle]}>Day {streakDays} Streak</Text>
          </View>
          <View style={styles.goldPill}>
            <Icon name="fire" size={18} color={colors.warning} />
            <Text style={styles.goldPillText}>+50 Coins</Text>
          </View>
        </View>
        <Text style={[typography.bodySmall, styles.cardDesc]}>
          Log in daily to multiply your rewards! Claim your daily bonus now.
        </Text>
        <Button
          title="Claim Daily Bonus"
          onPress={() => router.push('/daily-challenge')}
          variant="gold"
          size="md"
          icon="rewards"
          style={styles.actionBtn}
        />
      </Card>

      {/* Missions Hub Preview */}
      <Card
        variant="elevated"
        style={styles.card}
        onPress={() => router.push('/missions')}
      >
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.primary }]}>MISSIONS</Text>
            <Text style={[typography.h2, styles.cardTitle]}>Daily Quests</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
        <Text style={[typography.bodySmall, styles.cardDesc]}>
          Find 15 words in any puzzle today.
        </Text>
        <ProgressBar progress={0.6} color={colors.primary} showLabel label="9 / 15 Words" />
        <Button
          title="View All Missions"
          onPress={() => router.push('/missions')}
          variant="outline"
          size="sm"
          style={styles.actionBtn}
        />
      </Card>

      {/* Achievements Hub Preview */}
      <Card
        variant="elevated"
        style={styles.card}
        onPress={() => router.push('/achievements')}
      >
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.secondary }]}>ACHIEVEMENTS</Text>
            <Text style={[typography.h2, styles.cardTitle]}>Trophies & Badges</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
        <Text style={[typography.bodySmall, styles.cardDesc]}>
          12 of 48 achievements unlocked. Unlock more for coin rewards!
        </Text>
        <ProgressBar progress={0.25} color={colors.secondary} showLabel label="12 / 48 Unlocked" />
        <Button
          title="View Achievements"
          onPress={() => router.push('/achievements')}
          variant="secondary"
          size="sm"
          style={styles.actionBtn}
        />
      </Card>

      {/* Rewarded Video Bonus Banner */}
      <Card variant="default" style={styles.videoAdCard}>
        <View style={styles.adRow}>
          <View style={styles.adIconBox}>
            <Icon name="ad-video" size={24} color={colors.primary} />
          </View>
          <View style={styles.adInfo}>
            <Text style={[typography.h3, styles.adTitle]}>Watch & Earn</Text>
            <Text style={[typography.caption, styles.adSubtitle]}>
              Watch a quick sponsor video to get +25 Free Coins
            </Text>
          </View>
          <Button
            title="Watch"
            onPress={() => {
              // In Phase 6, calls RewardedAdService.showRewarded()
            }}
            variant="primary"
            size="sm"
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
  },
  goldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    gap: 4,
  },
  goldPillText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardDesc: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  actionBtn: {
    marginTop: spacing.md,
  },
  videoAdCard: {
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorderLight,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  adInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  adTitle: {
    color: colors.text,
  },
  adSubtitle: {
    color: colors.textSecondary,
  },
});
