import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon, IconName } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  unlocked: boolean;
  rewardCoins: number;
}

const ACHIEVEMENTS: AchievementItem[] = [
  { id: 'a1', title: 'First Discovery', description: 'Find your very first word', icon: 'star', unlocked: true, rewardCoins: 10 },
  { id: 'a2', title: 'Speed Demon', description: 'Complete any level in under 45 seconds', icon: 'timer', unlocked: true, rewardCoins: 50 },
  { id: 'a3', title: 'Streak Master', description: 'Maintain a 7-day daily streak', icon: 'fire', unlocked: false, rewardCoins: 100 },
  { id: 'a4', title: 'Lexicon Scholar', description: 'Find a total of 100 hidden words', icon: 'document', unlocked: false, rewardCoins: 150 },
  { id: 'a5', title: 'World Voyager', description: 'Unlock all 10 word worlds', icon: 'world-map', unlocked: false, rewardCoins: 500 },
];

export default function AchievementsScreen() {
  const coins = usePlayerStore((s) => s.coins);

  return (
    <ScreenContainer
      title="Achievements"
      subtitle="Unlock milestones and trophies"
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      <View style={styles.list}>
        {ACHIEVEMENTS.map((item) => (
          <Card
            key={item.id}
            variant={item.unlocked ? 'glowViolet' : 'elevated'}
            style={[styles.card, !item.unlocked && styles.cardLocked]}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: item.unlocked ? colors.secondary : colors.surfaceHighlight },
                ]}
              >
                <Icon
                  name={item.unlocked ? item.icon : 'lock'}
                  size={24}
                  color={item.unlocked ? colors.text : colors.textMuted}
                />
              </View>

              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={[typography.h3, styles.title]}>{item.title}</Text>
                  <View style={styles.rewardTag}>
                    <Icon name="coin" size={14} color={colors.gold} />
                    <Text style={styles.rewardText}>+{item.rewardCoins}</Text>
                  </View>
                </View>
                <Text style={[typography.bodySmall, styles.desc]}>{item.description}</Text>
              </View>
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
    padding: spacing.md,
  },
  cardLocked: {
    opacity: 0.65,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    color: colors.text,
  },
  desc: {
    color: colors.textSecondary,
  },
  rewardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  rewardText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
