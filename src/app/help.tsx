import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

const FAQS = [
  {
    q: 'Can I play WordQuest without an internet connection?',
    a: 'Yes! WordQuest is designed offline-first. All levels and puzzles run locally. When an internet connection becomes available, your progress syncs automatically.',
  },
  {
    q: 'Are coins real money?',
    a: 'No. Coins are purely virtual in-game rewards used for power-ups and cannot be withdrawn or converted to real currency.',
  },
  {
    q: 'How do I save my progress when switching phones?',
    a: 'Go to your Profile tab and link your Google Account. Your level progress and virtual coins will be safely backed up to the cloud.',
  },
  {
    q: 'How does the Daily Challenge work?',
    a: 'A new deterministic puzzle unlocks every midnight. Completing it awards bonus coins and advances your daily streak.',
  },
];

export default function HelpScreen() {
  return (
    <ScreenContainer
      title="Help & Support"
      subtitle="Frequently Asked Questions"
      showBackButton
      scrollable
    >
      <View style={styles.faqList}>
        {FAQS.map((faq) => (
          <Card key={faq.q} variant="elevated" style={styles.faqCard}>
            <Text style={[typography.h3, styles.question]}>{faq.q}</Text>
            <Text style={[typography.body, styles.answer]}>{faq.a}</Text>
          </Card>
        ))}
      </View>

      <Card variant="glowTeal" style={styles.contactCard}>
        <Text style={[typography.h3, styles.contactTitle]}>Need More Assistance?</Text>
        <Text style={[typography.bodySmall, styles.contactBody]}>
          Encountering an issue or have a suggestion? Reach out to our community support team.
        </Text>
        <Button
          title="Contact Support"
          onPress={() => {
            // Support action
          }}
          variant="primary"
          size="md"
          icon="help"
          style={styles.contactBtn}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  faqList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  faqCard: {
    padding: spacing.lg,
  },
  question: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  answer: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  contactTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  contactBody: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  contactBtn: {
    width: '100%',
  },
});
