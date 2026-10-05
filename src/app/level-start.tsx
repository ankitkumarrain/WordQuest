import React, { useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';

import { usePlayerStore } from '@/store/usePlayerStore';
import { getLevelConfig } from '@/data/levels';
import { getCategoryConfig } from '@/data/categories';

export default function LevelStartModal() {
  const { difficulty = 'easy', level = '1', categoryId } = useLocalSearchParams<{
    difficulty?: string;
    level?: string;
    categoryId?: string;
  }>();
  const hintsCount = usePlayerStore((s) => s.inventory['booster_hint'] ?? 0);
  const shufflesCount = usePlayerStore((s) => s.inventory['booster_shuffle'] ?? 0);
  const revealsCount = usePlayerStore((s) => s.inventory['booster_reveal'] ?? 0);

  const categoryConfig = getCategoryConfig(categoryId);
  const levelNum = parseInt(level, 10) || 1;
  const levelConfig = getLevelConfig(levelNum);

  const titleText = categoryConfig
    ? `${categoryConfig.name} Quest`
    : `Level ${level}: ${levelConfig.theme}`;

  const subtitleText = categoryConfig
    ? categoryConfig.subtitle
    : levelConfig.subtitle;

  const effectiveDifficulty = React.useMemo(() => {
    if (difficulty && difficulty !== 'easy') return difficulty;
    if (levelNum <= 4) return 'easy';
    if (levelNum <= 8) return 'casual';
    if (levelNum <= 14) return 'medium';
    if (levelNum <= 20) return 'hard';
    return 'expert';
  }, [difficulty, levelNum]);

  const handleStart = () => {
    router.replace({
      pathname: '/gameplay',
      params: {
        level,
        difficulty: effectiveDifficulty,
        ...(categoryId ? { categoryId } : {}),
      },
    });
  };

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClose();
        return true;
      });
      return () => sub.remove();
    }, [handleClose])
  );

  return (
    <Modal
      visible
      onClose={handleClose}
      title={titleText}
      footer={
        <Button
          title="Start Puzzle"
          onPress={handleStart}
          variant="primary"
          size="lg"
          fullWidth
          icon="play"
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DIFFICULTY: {effectiveDifficulty.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={[typography.body, styles.targetText]}>
          {subtitleText}
        </Text>

        {/* Boosters Prep Tray */}
        <Text style={[typography.caption, styles.boosterTitle]}>YOUR BOOSTERS READY</Text>
        <View style={styles.boosterRow}>
          <View style={styles.boosterItem}>
            <View style={styles.boosterIcon}>
              <Icon name="hint" size={20} color={colors.primary} />
            </View>
            <Text style={styles.boosterName}>Hint</Text>
            <Text style={styles.boosterCount}>x{hintsCount}</Text>
          </View>

          <View style={styles.boosterItem}>
            <View style={styles.boosterIcon}>
              <Icon name="shuffle" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.boosterName}>Shuffle</Text>
            <Text style={styles.boosterCount}>x{shufflesCount}</Text>
          </View>

          <View style={styles.boosterItem}>
            <View style={styles.boosterIcon}>
              <Icon name="reveal" size={20} color={colors.gold} />
            </View>
            <Text style={styles.boosterName}>Reveal</Text>
            <Text style={styles.boosterCount}>x{revealsCount}</Text>
          </View>
        </View>

        {/* Potential Reward */}
        <View style={styles.rewardBox}>
          <Text style={[typography.caption, styles.rewardLabel]}>REWARD UPON CLEAR</Text>
          <View style={styles.rewardRow}>
            <Icon name="coin" size={20} color={colors.gold} />
            <Text style={styles.rewardAmount}>+50 Virtual Coins</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  badgeRow: {
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  targetText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  boosterTitle: {
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  boosterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.lg,
  },
  boosterItem: {
    alignItems: 'center',
  },
  boosterIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 4,
  },
  boosterName: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  boosterCount: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rewardBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  rewardLabel: {
    color: colors.textSecondary,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  rewardAmount: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
