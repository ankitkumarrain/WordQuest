import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';

import { usePlayerStore } from '@/store/usePlayerStore';
import { CATEGORY_DEFINITIONS } from '@/data/categories';

export default function CategoryScreen() {
  const coins = usePlayerStore((s) => s.coins);
  const categories = Object.values(CATEGORY_DEFINITIONS);

  return (
    <ScreenContainer
      title="Choose Category"
      subtitle="Select a topic to explore"
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} onPress={() => router.push('/coin-shop')} />}
    >
      <View style={styles.grid}>
        {categories.map((cat) => (
          <Card
            key={cat.id}
            variant="elevated"
            padding="md"
            style={styles.card}
            onPress={() => router.push({ pathname: '/difficulty', params: { categoryId: cat.id } })}
          >
            <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
              <Icon name="category" size={24} color={colors.textDark} />
            </View>
            <Text style={[typography.h3, styles.cardTitle]}>{cat.name}</Text>
            <Text style={[typography.caption, styles.cardSub]}>
              {cat.levelsCount} Puzzles
            </Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47.5%',
    minHeight: 140,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 2,
  },
  cardSub: {
    color: colors.textSecondary,
  },
});
