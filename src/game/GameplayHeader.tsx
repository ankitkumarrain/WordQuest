import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { Icon } from '@/components/common/Icon';
import { CoinBadge } from '@/components/common/CoinBadge';

export interface GameplayHeaderProps {
  levelTitle: string;
  categoryName?: string;
  timeRemaining: number;
  coins: number;
  onPausePress: () => void;
  onCoinPress?: () => void;
}

export const GameplayHeader: React.FC<GameplayHeaderProps> = ({
  levelTitle,
  categoryName = 'Nature',
  timeRemaining,
  coins,
  onPausePress,
  onCoinPress,
}) => {
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const isLowTime = timeRemaining <= 30 && timeRemaining > 0;

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onPausePress}
        style={styles.pauseButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Pause game"
      >
        <Icon name="pause" size={20} color={colors.text} />
      </Pressable>

      <View style={styles.centerInfo}>
        <Text style={[typography.h3, styles.title]}>{levelTitle}</Text>
        <Text style={[typography.caption, styles.category]}>{categoryName}</Text>
      </View>

      <View style={styles.rightGroup}>
        {timeRemaining > 0 && (
          <View style={[styles.timerBadge, isLowTime && styles.timerBadgeLow]}>
            <Icon
              name="timer"
              size={14}
              color={isLowTime ? colors.danger : colors.primary}
            />
            <Text
              style={[
                styles.timerText,
                isLowTime && { color: colors.danger },
              ]}
            >
              {formatTimer(timeRemaining)}
            </Text>
          </View>
        )}
        <CoinBadge amount={coins} size="sm" onPress={onCoinPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  pauseButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  centerInfo: {
    alignItems: 'center',
  },
  title: {
    color: colors.text,
  },
  category: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  timerBadgeLow: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerMuted,
  },
  timerText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
