import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';

interface DifficultyOption {
  key: string;
  name: string;
  gridSize: string;
  wordsCount: number;
  timeLimit: string;
  multiplier: string;
  accent: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    key: 'easy',
    name: 'Casual Explorer',
    gridSize: '8 x 8 Grid',
    wordsCount: 5,
    timeLimit: 'No Time Limit',
    multiplier: '1x Coins',
    accent: colors.primary,
  },
  {
    key: 'medium',
    name: 'Adventurer',
    gridSize: '10 x 10 Grid',
    wordsCount: 8,
    timeLimit: '2:30 Minutes',
    multiplier: '1.5x Coins',
    accent: colors.secondary,
  },
  {
    key: 'hard',
    name: 'Master Scholar',
    gridSize: '12 x 12 Grid',
    wordsCount: 12,
    timeLimit: '2:00 Minutes',
    multiplier: '2x Coins',
    accent: colors.warning,
  },
  {
    key: 'expert',
    name: 'Grandmaster',
    gridSize: '14 x 16 Grid',
    wordsCount: 16,
    timeLimit: '1:45 Minutes',
    multiplier: '3x Coins',
    accent: colors.danger,
  },
];

export default function DifficultyScreen() {
  const { categoryId, level } = useLocalSearchParams<{ categoryId?: string; level?: string }>();
  const coins = usePlayerStore((s) => s.coins);

  return (
    <ScreenContainer
      title="Select Difficulty"
      subtitle="Choose your puzzle challenge"
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      <View style={styles.list}>
        {DIFFICULTIES.map((diff) => (
          <Card
            key={diff.key}
            variant="elevated"
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/level-start',
                params: {
                  difficulty: diff.key,
                  ...(categoryId ? { categoryId } : {}),
                  ...(level ? { level } : {}),
                },
              })
            }
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={[typography.h3, styles.title]}>{diff.name}</Text>
                <Text style={[typography.caption, styles.subtitle]}>
                  {diff.gridSize} • {diff.wordsCount} Words
                </Text>
              </View>
              <View style={[styles.multiplierBadge, { backgroundColor: diff.accent }]}>
                <Text style={styles.multiplierText}>{diff.multiplier}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.infoRow}>
                <Icon name="timer" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{diff.timeLimit}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  multiplierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  multiplierText: {
    color: colors.textDark,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
