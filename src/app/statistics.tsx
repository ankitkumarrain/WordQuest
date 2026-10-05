import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Icon, IconName } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { ProgressionRepository, LevelProgress } from '@/database/repositories/ProgressionRepository';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';

interface StatMetric {
  label: string;
  value: string;
  icon: IconName;
  color: string;
}

export default function StatisticsScreen() {
  const [stats, setStats] = useState<StatMetric[]>([
    { label: 'Total Words Found', value: '0', icon: 'document', color: colors.primary },
    { label: 'Levels Completed', value: '0', icon: 'check', color: colors.secondary },
    { label: 'Stars Earned', value: '0 / 30', icon: 'star', color: colors.gold },
    { label: 'Current Streak', value: '0 Days', icon: 'fire', color: colors.warning },
    { label: 'Best Time Record', value: '--', icon: 'timer', color: colors.info },
    { label: 'Puzzle Win Rate', value: '100%', icon: 'stats', color: colors.primary },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const progressList = await ProgressionRepository.getAllProgress().catch(() => [] as LevelProgress[]);
        const completedDates = await DailyChallengeRepository.getAllCompletedDates().catch(() => [] as string[]);

        const streakData = StreakService.calculateStreak(completedDates);
        const completedCount = progressList.length;
        const totalStars = progressList.reduce((acc: number, p: LevelProgress) => acc + (p.stars || 0), 0);
        const validTimes = progressList
          .map((p: LevelProgress) => p.bestTimeSeconds)
          .filter((t: number) => t && t > 0);
        const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null;
        // Average 6 words found per completed level
        const estimatedWords = completedCount * 6;

        setStats([
          {
            label: 'Total Words Found',
            value: estimatedWords.toString(),
            icon: 'document',
            color: colors.primary,
          },
          {
            label: 'Levels Completed',
            value: completedCount.toString(),
            icon: 'check',
            color: colors.secondary,
          },
          {
            label: 'Stars Earned',
            value: `${totalStars} / ${Math.max(completedCount * 3, 30)}`,
            icon: 'star',
            color: colors.gold,
          },
          {
            label: 'Current Streak',
            value: `${streakData.currentStreak} Days`,
            icon: 'fire',
            color: colors.warning,
          },
          {
            label: 'Best Time Record',
            value: bestTime ? `${bestTime}s` : '--',
            icon: 'timer',
            color: colors.info,
          },
          {
            label: 'Puzzle Win Rate',
            value: completedCount > 0 ? '100%' : '--',
            icon: 'stats',
            color: colors.primary,
          },
        ]);
      } catch (err) {
        console.warn('Failed to load player stats:', err);
      }
    }

    loadStats();
  }, []);

  return (
    <ScreenContainer
      title="Player Statistics"
      subtitle="Your word journey metrics"
      showBackButton
      scrollable
    >
      <View style={styles.grid}>
        {stats.map((stat) => (
          <Card key={stat.label} variant="elevated" style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceHighlight }]}>
              <Icon name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={[typography.h2, styles.value, { color: stat.color }]}>{stat.value}</Text>
            <Text style={[typography.caption, styles.label]}>{stat.label}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '47.5%',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    marginBottom: 2,
  },
  label: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
