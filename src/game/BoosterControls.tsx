import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { Icon } from '@/components/common/Icon';
import { HapticService } from '@/services/HapticService';
import { AudioService } from '@/services/AudioService';

export interface BoosterControlsProps {
  hintsRemaining: number;
  shufflesRemaining: number;
  revealsRemaining: number;
  onUseHint: () => void;
  onUseShuffle: () => void;
  onUseReveal: () => void;
}

export const BoosterControls: React.FC<BoosterControlsProps> = ({
  hintsRemaining,
  shufflesRemaining,
  revealsRemaining,
  onUseHint,
  onUseShuffle,
  onUseReveal,
}) => {
  const handlePress = (callback: () => void, type: 'hint' | 'shuffle' | 'reveal') => {
    HapticService.boosterTriggered();
    AudioService.playBooster(type);
    callback();
  };

  return (
    <View style={styles.container}>
      {/* Hint Booster */}
      <TouchableOpacity
        activeOpacity={0.65}
        disabled={hintsRemaining <= 0}
        onPress={() => handlePress(onUseHint, 'hint')}
        style={[styles.boosterBtn, hintsRemaining <= 0 && styles.boosterBtnDisabled]}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        accessibilityRole="button"
        accessibilityLabel={`Use Hint booster. ${hintsRemaining} remaining.`}
      >
        <View style={[styles.iconCircle, { borderColor: hintsRemaining > 0 ? colors.primary : colors.surfaceBorder }]}>
          <Icon name="hint" size={24} color={hintsRemaining > 0 ? colors.primary : colors.textMuted} />
          <View style={[styles.badge, { backgroundColor: hintsRemaining > 0 ? colors.primary : colors.surfaceBorder }]}>
            <Text style={[styles.badgeText, hintsRemaining <= 0 && { color: colors.textMuted }]}>{hintsRemaining}</Text>
          </View>
        </View>
        <Text style={[typography.caption, styles.label, hintsRemaining <= 0 && { color: colors.textMuted }]}>HINT</Text>
      </TouchableOpacity>

      {/* Shuffle Booster */}
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={() => handlePress(onUseShuffle, 'shuffle')}
        style={styles.boosterBtn}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        accessibilityRole="button"
        accessibilityLabel={`Use Shuffle booster. ${shufflesRemaining} remaining.`}
      >
        <View style={[styles.iconCircle, { borderColor: colors.secondary }]}>
          <Icon name="shuffle" size={24} color={colors.secondary} />
          <View style={[styles.badge, { backgroundColor: shufflesRemaining > 0 ? colors.secondary : colors.gold }]}>
            <Text style={styles.badgeText}>{shufflesRemaining > 0 ? shufflesRemaining : '+'}</Text>
          </View>
        </View>
        <Text style={[typography.caption, styles.label]}>SHUFFLE</Text>
      </TouchableOpacity>

      {/* Reveal Booster */}
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={() => handlePress(onUseReveal, 'reveal')}
        style={styles.boosterBtn}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        accessibilityRole="button"
        accessibilityLabel={`Use Reveal booster. ${revealsRemaining} remaining.`}
      >
        <View style={[styles.iconCircle, { borderColor: colors.gold }]}>
          <Icon name="reveal" size={24} color={colors.gold} />
          <View style={[styles.badge, { backgroundColor: colors.gold }]}>
            <Text style={[styles.badgeText, { color: colors.textDark }]}>
              {revealsRemaining > 0 ? revealsRemaining : '+'}
            </Text>
          </View>
        </View>
        <Text style={[typography.caption, styles.label]}>REVEAL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  boosterBtn: {
    alignItems: 'center',
  },
  boosterBtnDisabled: {
    opacity: 0.45,
  },
  boosterBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.textDark,
    fontSize: 10,
    fontWeight: '900',
  },
  label: {
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
