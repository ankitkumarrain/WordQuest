import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';

import { usePlayerStore } from '@/store/usePlayerStore';

export default function SplashScreen() {
  // Check if user has an existing profile
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        await usePlayerStore.getState().hydrate();
        const profile = usePlayerStore.getState().profile;
        if (!isMounted) return;

        if (profile) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        if (isMounted) router.replace('/onboarding');
      }
    };

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.logoIcon, shadows.tealGlow]}>
          <Icon name="world-map" size={54} color={colors.primary} />
        </View>
        <Text style={[typography.hero, styles.title]}>WORDQUEST</Text>
        <Text style={[typography.body, styles.subtitle]}>
          The Ultimate Casual Word Search
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.replace('/onboarding')}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: spacing.xxl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    color: colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingBottom: spacing.lg,
  },
});
