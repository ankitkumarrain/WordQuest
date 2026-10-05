import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { Icon } from './Icon';

export interface CoinBadgeProps {
  amount: number;
  onPress?: () => void;
  showAddButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export const CoinBadge: React.FC<CoinBadgeProps> = ({
  amount,
  onPress,
  showAddButton = false,
  size = 'md',
  style,
}) => {
  const formatAmount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const content = (
    <View
      style={[
        styles.container,
        isSm && styles.containerSm,
        isLg && styles.containerLg,
        style,
      ]}
    >
      <View style={styles.iconWrapper}>
        <Icon name="coin" size={iconSize} color={colors.gold} />
      </View>
      <Text
        style={[
          typography.bodyBold,
          styles.amountText,
          isSm && styles.amountTextSm,
          isLg && styles.amountTextLg,
        ]}
      >
        {formatAmount(amount)}
      </Text>
      {showAddButton && (
        <View style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }]}
        accessibilityRole="button"
        accessibilityLabel={`Coins: ${amount}. Tap to open shop.`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    borderColor: 'rgba(255, 209, 102, 0.4)',
    borderWidth: 1,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  containerSm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  containerLg: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  amountText: {
    color: colors.gold,
    fontSize: 14,
  },
  amountTextSm: {
    fontSize: 12,
  },
  amountTextLg: {
    fontSize: 18,
  },
  addBtn: {
    marginLeft: spacing.sm,
    backgroundColor: colors.gold,
    width: 18,
    height: 18,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: colors.textDark,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 15,
  },
});
