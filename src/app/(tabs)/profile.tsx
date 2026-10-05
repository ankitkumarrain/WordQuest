import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon, IconName } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ProgressionRepository } from '@/database/repositories/ProgressionRepository';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';

interface ProfileMenuItem {
  title: string;
  icon: IconName;
  route: '/statistics' | '/settings' | '/how-to-play' | '/help';
}

const MENU_ITEMS: ProfileMenuItem[] = [
  { title: 'Player Statistics', icon: 'stats', route: '/statistics' },
  { title: 'How to Play', icon: 'help', route: '/how-to-play' },
  { title: 'Settings', icon: 'settings', route: '/settings' },
  { title: 'Help & Support', icon: 'shield', route: '/help' },
];

export default function ProfileScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const coins = usePlayerStore((s) => s.coins);
  const [totalStars, setTotalStars] = useState(0);
  const [totalLevels, setTotalLevels] = useState(1);
  const [streakDays, setStreakDays] = useState(1);
  const [wordsFoundCount, setWordsFoundCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadProfileStats() {
      try {
        const levels = await ProgressionRepository.getAllProgress();
        if (isMounted && levels.length > 0) {
          setTotalLevels(levels.length);
          const stars = levels.reduce((acc, l) => acc + l.stars, 0);
          setTotalStars(stars);
          setWordsFoundCount(levels.length * 6);
        }
        const history = await DailyChallengeRepository.getHistory();
        if (isMounted) {
          const dates = history.map((h) => h.date);
          const s = StreakService.calculateStreak(dates);
          setStreakDays(s.currentStreak);
        }
      } catch (e) {
        console.warn('Failed loading profile stats:', e);
      }
    }
    loadProfileStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const username = profile?.username ?? 'Guest Explorer';

  return (
    <ScreenContainer
      title="Profile"
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      {/* Player Header Card */}
      <Card variant="elevated" style={styles.profileHeaderCard}>
        <Avatar name={username} level={totalLevels} size="lg" />
        <Text style={[typography.h2, styles.playerName]}>{username}</Text>
        <Text style={[typography.caption, styles.playerStatus]}>
          Level {totalLevels} Adventurer • {totalStars} Stars
        </Text>
      </Card>

      {/* Offline Mode Status Banner */}
      <View style={styles.offlineBadgeCard}>
        <Icon name="shield" size={16} color={colors.secondary} />
        <Text style={styles.offlineBadgeText}>Offline Play Active • Local Storage</Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Icon name="star" size={20} color={colors.gold} />
          <Text style={[typography.h3, styles.statValue]}>{totalStars}</Text>
          <Text style={[typography.caption, styles.statLabel]}>Stars</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="fire" size={20} color={colors.warning} />
          <Text style={[typography.h3, styles.statValue]}>{streakDays}d</Text>
          <Text style={[typography.caption, styles.statLabel]}>Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="check" size={20} color={colors.primary} />
          <Text style={[typography.h3, styles.statValue]}>{wordsFoundCount}</Text>
          <Text style={[typography.caption, styles.statLabel]}>Words</Text>
        </View>
      </View>

      {/* Menu Navigation */}
      <View style={styles.menuContainer}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.7}
            onPress={() => router.push(item.route)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Icon name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={[typography.body, styles.menuText]}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileHeaderCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  playerName: {
    color: colors.text,
    marginTop: spacing.md,
  },
  playerStatus: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  offlineBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorderLight,
  },
  offlineBadgeText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statValue: {
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceHighlight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: colors.text,
  },
});
