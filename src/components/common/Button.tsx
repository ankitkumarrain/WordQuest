import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { Icon, IconName } from './Icon';
import { AudioService } from '@/services/AudioService';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const handlePress = () => {
    AudioService.playTap();
    onPress();
  };
  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let baseBg: string = colors.primary;
    let borderColor = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        baseBg = pressed ? colors.primaryDark : colors.primary;
        break;
      case 'secondary':
        baseBg = pressed ? colors.secondaryDark : colors.secondary;
        break;
      case 'gold':
        baseBg = pressed ? colors.goldDark : colors.gold;
        break;
      case 'danger':
        baseBg = pressed ? '#D9345B' : colors.danger;
        break;
      case 'outline':
        baseBg = pressed ? colors.surfaceHighlight : 'transparent';
        borderColor = colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        baseBg = pressed ? colors.surfaceHighlight : 'transparent';
        break;
    }

    if (disabled) {
      baseBg = colors.surfaceBorder;
      borderColor = 'transparent';
    }

    return {
      backgroundColor: baseBg,
      borderColor,
      borderWidth,
      opacity: disabled ? 0.5 : 1,
      transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
    };
  };

  const getTextColor = (): string => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'primary':
      case 'gold':
        return colors.textDark; // Dark high-contrast text on bright neon
      case 'secondary':
      case 'danger':
        return colors.text;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.text;
      default:
        return colors.text;
    }
  };

  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        fullWidth && styles.fullWidth,
        getContainerStyle(pressed),
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={iconSize} color={textColor} />
          )}
          <Text
            style={[
              typography.button,
              styles[`text_${size}` as keyof typeof styles],
              { color: textColor },
              icon && iconPosition === 'left' ? styles.iconSpacingLeft : null,
              icon && iconPosition === 'right' ? styles.iconSpacingRight : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={iconSize} color={textColor} />
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  iconSpacingLeft: {
    marginLeft: spacing.sm,
  },
  iconSpacingRight: {
    marginRight: spacing.sm,
  },
});
