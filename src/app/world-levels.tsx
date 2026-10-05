import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ProgressionRepository, LevelProgress } from '@/database/repositories/ProgressionRepository';
import { WorldService, WorldDefinition } from '@/services/WorldService';
import { getWorldLevels, LevelConfig } from '@/data/levels';

export default function WorldLevelsScreen() {
  const { worldId = 'world-1' } = useLocalSearchParams<{ worldId?: string }>();
  const coins = usePlayerStore((s) => s.coins);

  const [progressMap, setProgressMap] = useState<Map<number, LevelProgress>>(new Map());
  const [highestLevel, setHighestLevel] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const world: WorldDefinition = useMemo(() => {
    return WorldService.getWorldById(worldId);
  }, [worldId]);

  const levels: LevelConfig[] = useMemo(() => {
    return getWorldLevels(world.id);
  }, [world.id]);

  // Load latest progression on focus:
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchProgress() {
        try {
          const allProgress = await ProgressionRepository.getAllProgress();
          const maxLvl = await ProgressionRepository.getHighestCompletedLevel();
          if (isMounted) {
            const map = new Map<number, LevelProgress>();
            for (const p of allProgress) {
              map.set(p.levelId, p);
            }
            setProgressMap(map);
            setHighestLevel(maxLvl);
            setLoading(false);
          }
        } catch {
          if (isMounted) setLoading(false);
        }
      }

      fetchProgress();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Compute world stats:
  const { completedCount, totalStars, maxStars, progressPercent } = useMemo(() => {
    let completed = 0;
    let stars = 0;
    for (const lvl of levels) {
      const rec = progressMap.get(lvl.level);
      if (rec && rec.stars > 0) {
        completed++;
        stars += rec.stars;
      }
    }
    const max = levels.length * 3;
    const pct = levels.length > 0 ? (completed / levels.length) * 100 : 0;
    return {
      completedCount: completed,
      totalStars: stars,
      maxStars: max,
      progressPercent: pct,
    };
  }, [levels, progressMap]);

  const handleLevelSelect = (levelNum: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    router.push({
      pathname: '/level-start',
      params: { level: String(levelNum) },
    });
  };

  return (
    <ScreenContainer
      title={world.name}
      subtitle={`World ${world.index} • ${levels.length} Levels`}
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      {/* World Progress Banner Card */}
      <Card variant="elevated" style={styles.bannerCard}>
        <View style={styles.bannerHeader}>
          <View style={styles.badgeWrapper}>
            <View style={[styles.badgePill, { backgroundColor: `${world.themeColor}26`, borderColor: world.themeColor }]}>
              <Text style={[styles.badgeText, { color: world.themeColor }]}>
                {world.badgeText}
              </Text>
            </View>
          </View>
          <View style={styles.starSummaryRow}>
            <Icon name="star" size={18} color={colors.gold} />
            <Text style={styles.starSummaryText}>
              {totalStars} / {maxStars}
            </Text>
          </View>
        </View>

        <Text style={[typography.body, styles.worldDescription]}>
          {world.subtitle}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(0, progressPercent))}%`, backgroundColor: world.themeColor },
              ]}
            />
          </View>
          <Text style={styles.progressCounterText}>
            {completedCount} / {levels.length} Completed ({Math.round(progressPercent)}%)
          </Text>
        </View>
      </Card>

      {/* Levels Selection Section */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.h3, styles.sectionTitle]}>Select Level</Text>
      </View>

      {/* Grid of Level Nodes */}
      <View style={styles.gridContainer}>
        {levels.map((lvl) => {
          const progress = progressMap.get(lvl.level);
          const isCompleted = (progress?.stars ?? 0) > 0;
          // Unlocked if: it's level 1, or previous level is completed
          const isUnlocked = lvl.level === 1 || lvl.level <= highestLevel + 1;
          const isCurrent = isUnlocked && !isCompleted;

          const starsEarned = progress?.stars ?? 0;

          return (
            <Pressable
              key={`level_${lvl.level}`}
              style={[
                styles.levelCard,
                isCompleted && { borderColor: world.themeColor, borderWidth: 1.5 },
                isCurrent && { borderColor: colors.primary, borderWidth: 2, backgroundColor: `${colors.primary}18` },
                !isUnlocked && styles.levelCardLocked,
              ]}
              onPress={() => handleLevelSelect(lvl.level, isUnlocked)}
              disabled={!isUnlocked}
            >
              {/* Level Number & Status Indicator */}
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.levelNumberCircle,
                    isCompleted
                      ? { backgroundColor: `${world.themeColor}33` }
                      : isCurrent
                      ? { backgroundColor: colors.primary }
                      : styles.lockedCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelNumberText,
                      isCurrent ? { color: colors.textDark } : isCompleted ? { color: world.themeColor } : styles.lockedText,
                    ]}
                  >
                    {lvl.level}
                  </Text>
                </View>

                {/* Lock or Play indicator */}
                {!isUnlocked ? (
                  <Icon name="lock" size={16} color={colors.textMuted} />
                ) : isCurrent ? (
                  <View style={styles.playBadge}>
                    <Text style={styles.playBadgeText}>PLAY</Text>
                  </View>
                ) : null}
              </View>

              {/* Theme Name */}
              <Text
                style={[
                  styles.themeTitle,
                  !isUnlocked && styles.themeTitleLocked,
                ]}
                numberOfLines={1}
              >
                {lvl.theme}
              </Text>

              {/* Stars Row */}
              <View style={styles.starsRow}>
                {[1, 2, 3].map((starIdx) => (
                  <Icon
                    key={starIdx}
                    name="star"
                    size={13}
                    color={starIdx <= starsEarned ? colors.gold : colors.surfaceBorderLight}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeWrapper: {
    flex: 1,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  starSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starSummaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textGold,
  },
  worldDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  progressBarWrapper: {
    gap: 6,
  },
  progressTrack: {
    width: '100%',
    height: 7,
    backgroundColor: colors.surfaceBorder,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.pill,
  },
  progressCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  levelCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    minHeight: 105,
    justifyContent: 'space-between',
  },
  levelCardLocked: {
    opacity: 0.5,
    backgroundColor: colors.backgroundSecondary,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedCircle: {
    backgroundColor: colors.surfaceBorder,
  },
  levelNumberText: {
    fontSize: 14,
    fontWeight: '900',
  },
  lockedText: {
    color: colors.textMuted,
  },
  playBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  playBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  themeTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  themeTitleLocked: {
    color: colors.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
});
