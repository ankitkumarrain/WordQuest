import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Icon, IconName } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';

interface OnboardingStep {
  title: string;
  description: string;
  icon: IconName;
  accent: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Swipe & Find Words!',
    description: 'Connect letters in all directions: forward, backward, up, down, and diagonally! 🔍',
    icon: 'world-map',
    accent: colors.primary,
  },
  {
    title: 'Daily Brain Gym!',
    description: 'Crack fresh puzzles every day, build your fiery streak, and win bonus coin chests! 🔥',
    icon: 'fire',
    accent: colors.warning,
  },
  {
    title: 'Play Anywhere • No Wi-Fi!',
    description: 'Zero internet needed. Relax on flights, road trips, or your coffee break. ✈️',
    icon: 'shield',
    accent: colors.secondary,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  // Android hardware back button → go to previous step, stay on step 1
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
      return true; // always prevent exit during onboarding
    });
    return () => backHandler.remove();
  }, [currentStep]);

  const completeOnboarding = async () => {
    try {
      const existing = usePlayerStore.getState().profile;
      if (!existing) {
        await usePlayerStore.getState().updateProfile('Adventurer', 'avatar_default');
      }
    } catch (e) {
      console.warn('Failed setting initial profile:', e);
    }
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const step = STEPS[currentStep];

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Button
            title="Skip"
            onPress={completeOnboarding}
            variant="ghost"
            size="sm"
          />
        </View>

        <View style={styles.mainContent}>
          <Card variant="elevated" style={styles.card}>
            <View style={[styles.iconCircle, { borderColor: step.accent }]}>
              <Icon name={step.icon} size={48} color={step.accent} />
            </View>
            <Text style={[typography.h1, styles.title]}>{step.title}</Text>
            <Text style={[typography.bodyLarge, styles.description]}>
              {step.description}
            </Text>
          </Card>

          <View style={styles.paginationDots}>
            {STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentStep && styles.dotActive,
                  { backgroundColor: idx === currentStep ? colors.primary : colors.surfaceBorder },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={currentStep === STEPS.length - 1 ? 'Start Adventure' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            icon={currentStep === STEPS.length - 1 ? 'play' : 'arrow-forward'}
            iconPosition="right"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.circle,
  },
  dotActive: {
    width: 24,
  },
  footer: {
    width: '100%',
    paddingBottom: spacing.lg,
  },
});
