import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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
import { WORLDS_CONFIG, WorldService, WorldDefinition } from '@/services/WorldService';

export default function WorldMapScreen() {
  const coins = usePlayerStore((s) => s.coins);

  const [progressList, setProgressList] = useState<LevelProgress[]>([]);
  const [highestCompletedLevel, setHighestCompletedLevel] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadProgress() {
        try {
          const list = await ProgressionRepository.getAllProgress();
          const maxLvl = await ProgressionRepository.getHighestCompletedLevel();
          if (isMounted) {
            setProgressList(list);
            setHighestCompletedLevel(maxLvl);
          }
        } catch {
          // ignore error
        }
      }
      loadProgress();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleEnterWorld = (worldId: string) => {
    router.push({
      pathname: '/world-levels' as any,
      params: { worldId },
    });
  };

  return (
    <ScreenContainer
      title="World Journey"
      subtitle="Conquer words across realms"
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      <View style={styles.worldList}>
        {WORLDS_CONFIG.map((world, index) => {
          const isUnlocked = WorldService.isWorldUnlocked(world, highestCompletedLevel);
          const progress = WorldService.getWorldProgress(world, progressList);

          return (
            <Card
              key={world.id}
              variant={isUnlocked ? (index === 0 ? 'glowTeal' : 'elevated') : 'default'}
              style={[styles.worldCard, !isUnlocked && styles.worldCardLocked]}
              onPress={isUnlocked ? () => handleEnterWorld(world.id) : undefined}
            >
              <View style={styles.cardHeader}>
                <View style={styles.worldTitleBox}>
                  <Text style={[typography.caption, { color: world.themeColor, fontWeight: '800' }]}>
                    WORLD {world.index}
                  </Text>
                  <Text style={[typography.h2, styles.worldName]}>{world.name}</Text>
                  <Text style={styles.worldSubtitle} numberOfLines={1}>
                    {world.subtitle}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusIcon,
                    {
                      backgroundColor: isUnlocked ? `${world.themeColor}26` : colors.surfaceBorder,
                      borderColor: isUnlocked ? world.themeColor : 'transparent',
                      borderWidth: isUnlocked ? 1 : 0,
                    },
                  ]}
                >
                  <Icon
                    name={isUnlocked ? 'world-map' : 'lock'}
                    size={20}
                    color={isUnlocked ? world.themeColor : colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.statRow}>
                  <Icon name="star" size={16} color={colors.gold} />
                  <Text style={styles.statText}>
                    {progress.completedLevels} / {world.totalLevels} Levels Clear ({progress.totalStars} ⭐)
                  </Text>
                </View>

                {isUnlocked ? (
                  <Pressable
                    style={[styles.exploreBtn, { backgroundColor: world.themeColor }]}
                    onPress={() => handleEnterWorld(world.id)}
                  >
                    <Text style={styles.exploreBtnText}>ENTER</Text>
                    <Icon name="chevron-right" size={14} color={colors.textDark} />
                  </Pressable>
                ) : (
                  <View style={styles.lockedRequirementBadge}>
                    <Text style={styles.lockedRequirementText}>
                      CLEAR LEVEL {world.unlockRequirementLevel} TO UNLOCK
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  worldList: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  worldCard: {
    padding: spacing.lg,
  },
  worldCardLocked: {
    opacity: 0.55,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  worldTitleBox: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  worldName: {
    color: colors.text,
    marginTop: 2,
    marginBottom: 4,
  },
  worldSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  exploreBtnText: {
    color: colors.textDark,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  lockedRequirementBadge: {
    backgroundColor: colors.surfaceBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  lockedRequirementText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
