import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'glowTeal' | 'glowViolet' | 'glowGold';
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  style,
  padding = 'lg',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          ...shadows.md,
        };
      case 'glowTeal':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
          borderWidth: 1.5,
          ...shadows.tealGlow,
        };
      case 'glowViolet':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.secondary,
          borderWidth: 1.5,
          ...shadows.violetGlow,
        };
      case 'glowGold':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.gold,
          borderWidth: 1.5,
          ...shadows.goldGlow,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.surface,
          ...shadows.sm,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.pressableContainer, style]}
      >
        <View
          style={[
            styles.base,
            styles.innerFull,
            { padding: spacing[padding] },
            getVariantStyle(),
          ]}
        >
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.base,
        { padding: spacing[padding] },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    width: '100%',
  },
  innerFull: {
    flex: 1,
    width: '100%',
  },
  base: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
});
