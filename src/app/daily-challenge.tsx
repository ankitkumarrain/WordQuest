import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';
import { DailyChallengeService } from '@/services/DailyChallengeService';

export default function DailyChallengeScreen() {
  const coins = usePlayerStore((s) => s.coins);
  const [streakDays, setStreakDays] = useState(1);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const dailyInfo = DailyChallengeService.getDailyChallengeInfo();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const todayKey = StreakService.formatDateKey();
        const res = await DailyChallengeRepository.getChallenge(todayKey);
        if (isMounted && res && res.completed) {
          setIsCompletedToday(true);
        }
        const history = await DailyChallengeRepository.getHistory();
        if (isMounted) {
          const dates = history.map((h) => h.dateKey);
          const s = StreakService.calculateStreak(dates);
          setStreakDays(s.currentStreak);
        }
      } catch (err) {
        console.warn('Error loading daily challenge data:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleStartChallenge = () => {
    router.push({
      pathname: '/gameplay',
      params: { level: 'daily', mode: 'daily' },
    });
  };

  return (
    <ScreenContainer
      title="Daily Challenge"
      subtitle={today}
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      {/* Streak Counter Header Card */}
      <Card variant="glowGold" style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View style={styles.streakIconCircle}>
            <Icon name="fire" size={32} color={colors.warning} />
          </View>
          <View style={styles.streakInfo}>
            <Text style={[typography.caption, { color: colors.warning }]}>ACTIVE STREAK</Text>
            <Text style={[typography.h1, styles.streakNumber]}>{streakDays} Days</Text>
          </View>
        </View>
        <Text style={[typography.bodySmall, styles.streakDesc]}>
          Solve today&apos;s deterministic puzzle to maintain your streak and earn +100 bonus virtual coins!
        </Text>
      </Card>

      {/* Today's Mission Card */}
      <Card variant="elevated" style={styles.challengeCard}>
        <View style={styles.challengeTop}>
          <View style={styles.dailyBadge}>
            <Text style={styles.dailyBadgeText}>TODAY&apos;S QUEST</Text>
          </View>
          <View style={styles.rewardTag}>
            <Icon name="coin" size={16} color={colors.gold} />
            <Text style={styles.rewardTagText}>+100 Coins</Text>
          </View>
        </View>

        <Text style={[typography.h2, styles.challengeTitle]}>{dailyInfo.themeTitle}</Text>
        <Text style={[typography.body, styles.challengeSubtitle]}>
          {dailyInfo.themeSubtitle} ({dailyInfo.wordCount} words, {dailyInfo.gridRows}x{dailyInfo.gridCols} matrix)
        </Text>

        <Button
          title={isCompletedToday ? 'Completed for Today' : 'Start Daily Puzzle'}
          onPress={handleStartChallenge}
          variant="primary"
          size="lg"
          icon="play"
          disabled={isCompletedToday}
          style={styles.startBtn}
        />
      </Card>

      {/* Week Calendar Preview */}
      <View style={styles.calendarSection}>
        <Text style={[typography.h3, styles.calendarTitle]}>This Week</Text>
        <View style={styles.daysRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const isDone = i < streakDays;
            const isCurrent = i === streakDays;
            return (
              <View
                key={day}
                style={[
                  styles.dayPill,
                  isDone && styles.dayPillDone,
                  isCurrent && styles.dayPillCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isDone && { color: colors.textDark },
                    isCurrent && { color: colors.primary },
                  ]}
                >
                  {day}
                </Text>
                <Icon
                  name={isDone ? 'check' : isCurrent ? 'fire' : 'lock'}
                  size={14}
                  color={isDone ? colors.textDark : isCurrent ? colors.warning : colors.textMuted}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  streakIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 159, 28, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    color: colors.text,
  },
  streakDesc: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  challengeCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  challengeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dailyBadge: {
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  dailyBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  rewardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  rewardTagText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 11,
  },
  challengeTitle: {
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  challengeSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  startBtn: {
    width: '100%',
  },
  calendarSection: {
    marginTop: spacing.sm,
  },
  calendarTitle: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 4,
  },
  dayPillDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayPillCurrent: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  dayText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
});
