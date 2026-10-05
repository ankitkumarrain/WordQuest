import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';

export default function HowToPlayScreen() {
  return (
    <ScreenContainer
      title="How to Play"
      subtitle="Master word search techniques"
      showBackButton
      scrollable
    >
      {/* Rule 1: Swiping */}
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.numberBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={[typography.h3, styles.cardTitle]}>Connect Letters</Text>
        </View>
        <Text style={[typography.body, styles.cardBody]}>
          Swipe across letters in a straight line to form words from your goal list. Words can run horizontally, vertically, or diagonally in both forward and backward directions!
        </Text>
      </Card>

      {/* Rule 2: Boosters */}
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.numberBox, { backgroundColor: colors.secondary }]}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <Text style={[typography.h3, styles.cardTitle]}>Use Strategic Boosters</Text>
        </View>
        <View style={styles.boosterList}>
          <View style={styles.boosterRow}>
            <Icon name="hint" size={18} color={colors.primary} />
            <Text style={[typography.bodySmall, styles.boosterText]}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>Hint: </Text>
              Highlights the first letter of an unfound word.
            </Text>
          </View>
          <View style={styles.boosterRow}>
            <Icon name="shuffle" size={18} color={colors.secondary} />
            <Text style={[typography.bodySmall, styles.boosterText]}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>Shuffle: </Text>
              Re-arranges random filler letters to give fresh visual perspective.
            </Text>
          </View>
          <View style={styles.boosterRow}>
            <Icon name="reveal" size={18} color={colors.gold} />
            <Text style={[typography.bodySmall, styles.boosterText]}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>Reveal: </Text>
              Immediately finds and crosses off one remaining word.
            </Text>
          </View>
        </View>
      </Card>

      {/* Rule 3: Stars & Coins */}
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.numberBox, { backgroundColor: colors.gold }]}>
            <Text style={styles.numberText}>3</Text>
          </View>
          <Text style={[typography.h3, styles.cardTitle]}>Earn 3 Stars & Coins</Text>
        </View>
        <Text style={[typography.body, styles.cardBody]}>
          Complete puzzles quickly and without errors to earn 3 Stars. Stars unlock new worlds, while virtual coins can be spent on extra boosters in the Coin Shop!
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  numberBox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardTitle: {
    color: colors.text,
  },
  cardBody: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  boosterList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  boosterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  boosterText: {
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
