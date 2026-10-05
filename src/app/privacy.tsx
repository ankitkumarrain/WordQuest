import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function PrivacyScreen() {
  return (
    <ScreenContainer
      title="Privacy Policy"
      subtitle="Last updated: September 2026"
      showBackButton
      scrollable
    >
      <Card variant="elevated" style={styles.card}>
        <Text style={[typography.h3, styles.sectionHeader]}>1. Information We Collect</Text>
        <Text style={[typography.body, styles.paragraph]}>
          WordQuest is designed to respect your privacy. By default, you can play entirely as a guest without providing any personal data. If you choose to link a Google account, we store your anonymous user identifier and cloud save data on Google Firebase.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>2. Virtual In-Game Data</Text>
        <Text style={[typography.body, styles.paragraph]}>
          All gameplay statistics, level progress, stars, and virtual coin balances are stored locally on your device and synchronized to your private cloud storage when authenticated. We do not sell or monetize personal user data.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>3. Advertising & Analytics</Text>
        <Text style={[typography.body, styles.paragraph]}>
          WordQuest utilizes Google AdMob to deliver optional rewarded video advertisements and Firebase Analytics to track high-level gameplay telemetry (such as level completion rates and crash diagnostics) to maintain stability.
        </Text>

        <Text style={[typography.h3, styles.sectionHeader]}>4. Contact Us</Text>
        <Text style={[typography.body, styles.paragraph]}>
          For privacy-related inquiries, please reach out to privacy@wordquest.app.
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
