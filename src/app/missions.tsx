import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CoinBadge } from '@/components/common/CoinBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { usePlayerStore } from '@/store/usePlayerStore';
import { HapticService } from '@/services/HapticService';
import { AudioService } from '@/services/AudioService';

interface MissionItem {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardCoins: number;
  claimed: boolean;
}

const INITIAL_MISSIONS: MissionItem[] = [
  { id: 'm1', title: 'Find 15 Words in Any Category', target: 15, current: 15, rewardCoins: 30, claimed: false },
  { id: 'm2', title: 'Complete 3 Levels with 3 Stars', target: 3, current: 2, rewardCoins: 50, claimed: false },
  { id: 'm3', title: 'Use a Shuffle Booster Once', target: 1, current: 0, rewardCoins: 20, claimed: false },
  { id: 'm4', title: 'Play a Daily Challenge', target: 1, current: 0, rewardCoins: 40, claimed: false },
];

export default function MissionsScreen() {
  const coins = usePlayerStore((s) => s.coins);
  const addCoins = usePlayerStore((s) => s.addCoins);
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);

  const handleClaim = async (mission: MissionItem) => {
    if (mission.claimed || mission.current < mission.target) return;
    HapticService.levelComplete();
    AudioService.playCoinCollect();
    await addCoins(mission.rewardCoins);
    setMissions((prev) =>
      prev.map((m) => (m.id === mission.id ? { ...m, claimed: true } : m))
    );
  };

  return (
    <ScreenContainer
      title="Missions"
      subtitle="Complete quests for coin bonuses"
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      <View style={styles.list}>
        {missions.map((mission) => {
          const isReadyToClaim = mission.current >= mission.target && !mission.claimed;
          const progress = Math.min(mission.current / mission.target, 1);

          return (
            <Card
              key={mission.id}
              variant={isReadyToClaim ? 'glowTeal' : 'elevated'}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <View style={styles.titleArea}>
                  <Text style={[typography.h3, styles.title]}>{mission.title}</Text>
                  <View style={styles.rewardPill}>
                    <Icon name="coin" size={14} color={colors.gold} />
                    <Text style={styles.rewardText}>+{mission.rewardCoins} Coins</Text>
                  </View>
                </View>
              </View>

              <ProgressBar
                progress={progress}
                color={colors.primary}
                showLabel
                label={`${mission.current} / ${mission.target}`}
                style={styles.progressBar}
              />

              <Button
                title={mission.claimed ? 'Claimed' : isReadyToClaim ? 'Claim Reward' : 'In Progress'}
                onPress={() => handleClaim(mission)}
                variant={isReadyToClaim ? 'primary' : 'outline'}
                size="sm"
                disabled={!isReadyToClaim}
                style={styles.claimBtn}
              />
            </Card>
          );
        })}
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
    marginBottom: spacing.sm,
  },
  titleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    flex: 1,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  rewardText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    marginVertical: spacing.sm,
  },
  claimBtn: {
    marginTop: spacing.xs,
  },
});
