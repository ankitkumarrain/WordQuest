import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { Icon } from './Icon';

export interface AvatarProps {
  name?: string;
  level?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'Player',
  level,
  size = 'md',
  borderColor = colors.primary,
  onPress,
  style,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { box: 36, icon: 18, border: 2, badgeFont: 9 };
      case 'lg':
        return { box: 72, icon: 34, border: 3, badgeFont: 12 };
      case 'xl':
        return { box: 96, icon: 46, border: 4, badgeFont: 14 };
      case 'md':
      default:
        return { box: 50, icon: 24, border: 2.5, badgeFont: 11 };
    }
  };

  const dim = getDimensions();
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const content = (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          {
            width: dim.box,
            height: dim.box,
            borderRadius: borderRadius.circle,
            borderColor,
            borderWidth: dim.border,
          },
        ]}
      >
        {initials ? (
          <Text style={[typography.bodyBold, styles.initials, { fontSize: dim.box * 0.38 }]}>
            {initials}
          </Text>
        ) : (
          <Icon name="profile" size={dim.icon} color={colors.primary} />
        )}
      </View>
      {level !== undefined && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.pill,
            },
          ]}
        >
          <Text style={[typography.caption, styles.badgeText, { fontSize: dim.badgeFont }]}>
            Lv.{level}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
