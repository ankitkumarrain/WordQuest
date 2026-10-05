import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function TermsScreen() {
  return (
    <ScreenContainer
      title="Terms of Service"
      subtitle="Last updated: September 2026"
      showBackButton
      scrollable
    >
      <Card variant="elevated" style={styles.card}>
        <Text style={[typography.h3, styles.sectionHeader]}>1. Acceptance of Terms</Text>
        <Text style={[typography.body, styles.paragraph]}>
          By downloading, accessing, or playing WordQuest, you agree to abide by these Terms of Service and applicable platform store rules.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>2. Virtual In-Game Currency</Text>
        <Text style={[typography.body, styles.paragraph]}>
          All coins, stars, boosters, and achievements within WordQuest represent virtual game items only. They have no cash value, cannot be redeemed for legal tender or real money, and do not constitute real-money gambling or betting.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>3. Offline & Online Gameplay</Text>
        <Text style={[typography.body, styles.paragraph]}>
          WordQuest enables offline play. While we endeavor to preserve all progression, local device data that has not been synchronized to a linked Google account may be lost if the application is uninstalled or device storage cleared.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>4. Intellectual Property</Text>
        <Text style={[typography.body, styles.paragraph]}>
          All puzzle designs, visual aesthetics, icons, algorithms, and branding belong exclusively to WordQuest.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
  },
  sectionHeader: {
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragraph: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
});
