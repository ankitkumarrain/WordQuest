import React, { ReactNode, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ViewStyle,
  StyleProp,
  BackHandler,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { Icon } from '../common/Icon';

const NATURE_BACKGROUNDS = {
  forest: require('../../../assets/images/nature/bg_forest.jpg'),
  meadow: require('../../../assets/images/nature/bg_meadow.jpg'),
};

export interface ScreenContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  backgroundVariant?: 'forest' | 'meadow' | 'none';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  headerRight,
  scrollable = false,
  contentContainerStyle,
  style,
  backgroundVariant = 'forest',
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [onBackPress]);

  // Sync Android hardware back button with the screen's back button
  useFocusEffect(
    useCallback(() => {
      if (!showBackButton) return;
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });
      return () => subscription.remove();
    }, [showBackButton, handleBack])
  );

  const hasHeader = title || showBackButton || headerRight;

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
  );

  const bgSource = backgroundVariant !== 'none' ? NATURE_BACKGROUNDS[backgroundVariant] : null;

  const innerContent = (
    <>
      {bgSource && <View pointerEvents="none" style={styles.scrimOverlay} />}
      {hasHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showBackButton && (
              <Pressable
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Icon name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            )}
            <View>
              {title && <Text style={[typography.h2, styles.title]}>{title}</Text>}
              {subtitle && (
                <Text style={[typography.caption, styles.subtitle]}>{subtitle}</Text>
              )}
            </View>
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      {content}
    </>
  );

  if (bgSource) {
    return (
      <ImageBackground
        source={bgSource}
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, spacing.sm),
          },
          style,
        ]}
        resizeMode="cover"
      >
        {innerContent}
      </ImageBackground>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, spacing.sm),
        },
        style,
      ]}
    >
      {innerContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 20, 14, 0.70)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 211, 153, 0.16)',
    backgroundColor: 'rgba(12, 24, 18, 0.45)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(26, 44, 34, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.massive,
  },
  staticContent: {
    flex: 1,
    padding: spacing.lg,
  },
});
