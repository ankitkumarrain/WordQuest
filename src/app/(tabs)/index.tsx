import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Avatar } from '@/components/common/Avatar';
import { Icon } from '@/components/common/Icon';
import { Modal } from '@/components/common/Modal';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ProgressionRepository } from '@/database/repositories/ProgressionRepository';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';
import { getLevelConfig } from '@/data/levels';
import { WorldService } from '@/services/WorldService';

export default function HomeScreen() {
  const coins = usePlayerStore((s) => s.coins);
  const profile = usePlayerStore((s) => s.profile);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);

  const levelConfig = getLevelConfig(currentLevel);

  // Android hardware back button -> Show Exit Game confirmation dialog
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showExitModal) {
          setShowExitModal(false);
          return true;
        }
        setShowExitModal(true);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showExitModal])
  );

  // Refresh progression stats whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadStats() {
        try {
          const levels = await ProgressionRepository.getAllProgress();
          if (isMounted && levels.length > 0) {
            const maxLevel = Math.max(...levels.map((l) => l.levelId));
            setCurrentLevel(maxLevel + 1);
          }
          const history = await DailyChallengeRepository.getHistory();
          if (isMounted) {
            const dates = history.map((h) => h.date);
            const s = StreakService.calculateStreak(dates);
            setStreak(s.currentStreak);
          }
        } catch (e) {
          console.warn('Failed loading home progression:', e);
        }
      }
      loadStats();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <ScreenContainer
      scrollable
      headerRight={
        <View style={styles.headerRightGroup}>
          <CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} showAddButton />
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.settingsBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="settings" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      }
    >
      {/* Player Greeting Header */}
      <View style={styles.playerGreetingRow}>
        <Avatar name={profile?.username ?? 'Explorer'} level={currentLevel} size="md" onPress={() => router.push('/(tabs)/profile')} />
        <View style={styles.playerInfo}>
          <Text style={[typography.h3, styles.playerName]}>Hello, {profile?.username ?? 'Explorer'}!</Text>
          <Text style={[typography.caption, styles.playerSub]}>Ready for today&apos;s quest?</Text>
        </View>
        <Pressable
          onPress={() => router.push('/daily-challenge')}
          style={styles.streakBadge}
        >
          <Icon name="fire" size={18} color={colors.warning} />
          <Text style={styles.streakText}>{streak}d</Text>
        </Pressable>
      </View>

      {/* Main Play CTA Banner */}
      <Card variant="glowTeal" style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            CURRENT WORLD: {WorldService.getWorldForLevel(currentLevel).name.toUpperCase()}
          </Text>
        </View>
        <Text style={[typography.h1, styles.heroTitle]}>Level {currentLevel}: {levelConfig.theme}</Text>
        <Text style={[typography.body, styles.heroSubtitle]}>
          {levelConfig.subtitle}
        </Text>
        <Button
          title="Play Level"
          onPress={() =>
            router.push({
              pathname: '/level-start',
              params: { level: String(currentLevel) },
            })
          }
          variant="primary"
          size="lg"
          icon="play"
          style={styles.playButton}
        />
      </Card>

      {/* Quick Access Grid */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.h3, styles.sectionTitle]}>Game Modes</Text>
      </View>

      <View style={styles.quickGrid}>
        <View style={styles.gridRow}>
          <Card
            variant="elevated"
            style={styles.gridCard}
            padding="md"
            onPress={() => router.push('/daily-challenge')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.warning }]}>
              <Icon name="fire" size={24} color={colors.textDark} />
            </View>
            <Text style={[typography.h3, styles.gridCardTitle]} numberOfLines={1}>Daily Challenge</Text>
            <Text style={[typography.caption, styles.gridCardSub]} numberOfLines={2}>Fresh puzzle every day</Text>
          </Card>

          <Card
            variant="elevated"
            style={styles.gridCard}
            padding="md"
            onPress={() => router.push('/category')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.secondary }]}>
              <Icon name="category" size={24} color={colors.text} />
            </View>
            <Text style={[typography.h3, styles.gridCardTitle]} numberOfLines={1}>Categories</Text>
            <Text style={[typography.caption, styles.gridCardSub]} numberOfLines={2}>Animals, Food, Science</Text>
          </Card>
        </View>

        <View style={styles.gridRow}>
          <Card
            variant="elevated"
            style={styles.gridCard}
            padding="md"
            onPress={() => router.push('/(tabs)/world-map')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.primary }]}>
              <Icon name="world-map" size={24} color={colors.textDark} />
            </View>
            <Text style={[typography.h3, styles.gridCardTitle]} numberOfLines={1}>World Journey</Text>
            <Text style={[typography.caption, styles.gridCardSub]} numberOfLines={2}>10 Unique Worlds</Text>
          </Card>

          <Card
            variant="elevated"
            style={styles.gridCard}
            padding="md"
            onPress={() => router.push('/coin-shop')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.gold }]}>
              <Icon name="shop" size={24} color={colors.textDark} />
            </View>
            <Text style={[typography.h3, styles.gridCardTitle]} numberOfLines={1}>Coin Shop</Text>
            <Text style={[typography.caption, styles.gridCardSub]} numberOfLines={2}>Boosters & Bundles</Text>
          </Card>
        </View>
      </View>

      {/* Exit Game Confirmation Dialog */}
      <Modal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit WordQuest?"
        showCloseButton
      >
        <View style={styles.exitModalContent}>
          <Text style={[typography.body, styles.exitModalText]}>
            Are you sure you want to exit? Your progress and coins are safely saved.
          </Text>
          <View style={styles.exitButtonStack}>
            <Button
              title="Continue Playing"
              onPress={() => setShowExitModal(false)}
              variant="primary"
              size="md"
              fullWidth
            />
            <Button
              title="Exit App"
              onPress={() => BackHandler.exitApp()}
              variant="danger"
              size="md"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsBtn: {
    padding: spacing.xs,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
  },
  playerGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    color: colors.text,
  },
  playerSub: {
    color: colors.textSecondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 159, 28, 0.15)',
    borderColor: 'rgba(255, 159, 28, 0.4)',
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
    gap: 4,
  },
  streakText: {
    color: colors.warning,
    fontWeight: 'bold',
    fontSize: 13,
  },
  heroCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.sm,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  playButton: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
  },
  quickGrid: {
    gap: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    minHeight: 160,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gridCardTitle: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 4,
  },
  gridCardSub: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  exitModalContent: {
    paddingVertical: spacing.sm,
  },
  exitModalText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  exitButtonStack: {
    gap: spacing.md,
  },
});
