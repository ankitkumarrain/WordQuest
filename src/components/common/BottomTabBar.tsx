import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { Icon, IconName } from './Icon';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const getTabIcon = (routeName: string, isFocused: boolean): IconName => {
    switch (routeName) {
      case 'index':
        return 'home';
      case 'world-map':
      case 'play':
        return 'world-map';
      case 'rewards':
        return 'rewards';
      case 'profile':
        return 'profile';
      default:
        return 'play';
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'world-map':
      case 'play':
        return 'Worlds';
      case 'rewards':
        return 'Rewards';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.xs) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = getTabIcon(route.name, isFocused);
          const label = options.title !== undefined ? options.title : getTabLabel(route.name);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  typography.caption,
                  styles.tabLabel,
                  { color: isFocused ? colors.primary : colors.textSecondary },
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
  activeIndicator: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
});
