import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CoinBadge } from '@/components/common/CoinBadge';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { AdFactory } from '@/services/ads/AdFactory';
import { RewardService } from '@/services/RewardService';
import { AnalyticsService } from '@/services/analytics/AnalyticsService';
import { AudioService } from '@/services/AudioService';
import { HapticService } from '@/services/HapticService';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AdBanner } from '@/components/ads/AdBanner';
import { GAME_THEMES, GridTheme } from '@/constants/themes';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  icon: 'hint' | 'shuffle' | 'reveal';
  boosterKey: 'booster_hint' | 'booster_shuffle' | 'booster_reveal';
  qtyCount: number;
  qtyLabel: string;
}

const BOOSTER_PACKS: ShopItem[] = [
  {
    id: 'b1',
    title: 'Hint Pack',
    description: 'Highlight starting letters',
    costCoins: 100,
    icon: 'hint',
    boosterKey: 'booster_hint',
    qtyCount: 3,
    qtyLabel: '3 Hints',
  },
  {
    id: 'b2',
    title: 'Shuffle Pack',
    description: 'Reorder filler characters',
    costCoins: 80,
    icon: 'shuffle',
    boosterKey: 'booster_shuffle',
    qtyCount: 3,
    qtyLabel: '3 Shuffles',
  },
  {
    id: 'b3',
    title: 'Reveal Pack',
    description: 'Solve a tough word instantly',
    costCoins: 150,
    icon: 'reveal',
    boosterKey: 'booster_reveal',
    qtyCount: 2,
    qtyLabel: '2 Reveals',
  },
];

export default function CoinShopScreen() {
  const [loadingAd, setLoadingAd] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const coins = usePlayerStore((s) => s.coins);
  const addCoins = usePlayerStore((s) => s.addCoins);
  const spendCoins = usePlayerStore((s) => s.spendCoins);
  const addBooster = usePlayerStore((s) => s.addBooster);
  const unlockedThemes = usePlayerStore((s) => s.unlockedThemes);
  const activeTheme = usePlayerStore((s) => s.activeTheme);
  const unlockTheme = usePlayerStore((s) => s.unlockTheme);
  const setActiveTheme = usePlayerStore((s) => s.setActiveTheme);

  const handleWatchAd = async () => {
    try {
      setLoadingAd(true);
      const adService = AdFactory.getInstance();
      const result = await adService.showRewardedAd('shop_coins', 'coins', 25);

      if (result.rewarded) {
        await RewardService.claimAdReward('coins', 25, 'shop_free_video');
        await addCoins(25);
        AudioService.playCoinCollect();

        await AnalyticsService.getInstance().logEvent('ad_rewarded', {
          placement: 'shop_coins',
          reward_amount: 25,
        });

        setMessage('+25 Free Coins Claimed!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.warn('Shop ad playback error:', e);
    } finally {
      setLoadingAd(false);
    }
  };

  const handleBuyBooster = async (pack: ShopItem) => {
    if (coins < pack.costCoins) {
      setMessage(`Not enough coins! Need ${pack.costCoins} coins.`);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const success = await spendCoins(pack.costCoins);
    if (success) {
      await addBooster(pack.boosterKey, pack.qtyCount);
      HapticService.boosterTriggered();
      AudioService.playCoinCollect();
      setMessage(`Purchased ${pack.qtyLabel}!`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleApplyTheme = async (themeId: string) => {
    await setActiveTheme(themeId);
    HapticService.letterCross();
    AudioService.playTap();
    setMessage('Theme applied!');
    setTimeout(() => setMessage(null), 2500);
  };

  const handleUnlockTheme = async (theme: GridTheme) => {
    if (coins < theme.cost) {
      setMessage(`Not enough coins! Need ${theme.cost} coins.`);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const success = await unlockTheme(theme.id, theme.cost);
    if (success) {
      HapticService.boosterTriggered();
      AudioService.playThemeUnlock();
      setMessage(`${theme.name} unlocked & applied!`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <ScreenContainer
      title="Coin Shop"
      subtitle="Virtual Boosters & Customization"
      showBackButton
      scrollable
      headerRight={<CoinBadge amount={coins} />}
    >
      {message && (
        <Card variant="glowTeal" style={styles.feedbackBanner}>
          <Text style={[typography.body, styles.feedbackText]}>{message}</Text>
        </Card>
      )}

      {/* Free Ad Coins Banner */}
      <Card variant="glowTeal" style={styles.adBanner}>
        <View style={styles.adRow}>
          <View style={styles.adIconCircle}>
            <Icon name="ad-video" size={24} color={colors.primary} />
          </View>
          <View style={styles.adInfo}>
            <Text style={[typography.h3, styles.adTitle]}>Free Coins Bonus</Text>
            <Text style={[typography.caption, styles.adSub]}>
              Watch a quick sponsor video for +25 free virtual coins
            </Text>
          </View>
        </View>
        <Button
          title={loadingAd ? 'Playing Video...' : 'Watch Sponsor Video (+25 Coins)'}
          onPress={handleWatchAd}
          variant="primary"
          size="md"
          loading={loadingAd}
          icon="ad-video"
          style={styles.adBtn}
        />
      </Card>

      {/* Booster Packs */}
      <Text style={[typography.h3, styles.sectionTitle]}>Power-Up Booster Packs</Text>
      <View style={styles.packList}>
        {BOOSTER_PACKS.map((pack) => (
          <Card key={pack.id} variant="elevated" style={styles.packCard}>
            <View style={styles.packHeader}>
              <View style={styles.packIconBox}>
                <Icon name={pack.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.packInfo}>
                <Text style={[typography.h3, styles.packTitle]}>{pack.title}</Text>
                <Text style={[typography.caption, styles.packQty]}>{pack.qtyLabel}</Text>
                <Text style={[typography.bodySmall, styles.packDesc]}>{pack.description}</Text>
              </View>
            </View>

            <Button
              title={`Buy for ${pack.costCoins} Coins`}
              onPress={() => handleBuyBooster(pack)}
              variant="gold"
              size="sm"
              icon="coin"
              style={styles.buyBtn}
            />
          </Card>
        ))}
      </View>

      {/* Matrix Themes & Skins */}
      <Text style={[typography.h3, styles.sectionTitle]}>Matrix Themes & Skins</Text>
      <View style={styles.packList}>
        {Object.values(GAME_THEMES).map((theme) => {
          const isUnlocked = unlockedThemes.includes(theme.id);
          const isActive = activeTheme === theme.id;
          return (
            <Card key={theme.id} variant={isActive ? 'glowTeal' : 'elevated'} style={styles.packCard}>
              <View style={styles.packHeader}>
                <View
                  style={[
                    styles.themePreviewBox,
                    {
                      backgroundColor: theme.cellBg,
                      borderColor: theme.previewColor,
                    },
                  ]}
                >
                  <Text style={{ color: theme.cellTextColor, fontWeight: '900', fontSize: 16 }}>A</Text>
                </View>
                <View style={styles.packInfo}>
                  <View style={styles.themeTitleRow}>
                    <Text style={[typography.h3, styles.packTitle]}>{theme.name}</Text>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>ACTIVE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[typography.bodySmall, styles.packDesc]}>{theme.description}</Text>
                </View>
              </View>

              {isActive ? (
                <Button
                  title="Currently Active"
                  disabled
                  onPress={() => {}}
                  variant="ghost"
                  size="sm"
                  style={styles.buyBtn}
                />
              ) : isUnlocked ? (
                <Button
                  title="Apply Theme"
                  onPress={() => handleApplyTheme(theme.id)}
                  variant="primary"
                  size="sm"
                  style={styles.buyBtn}
                />
              ) : (
                <Button
                  title={`Unlock for ${theme.cost} Coins`}
                  onPress={() => handleUnlockTheme(theme)}
                  variant="gold"
                  size="sm"
                  icon="coin"
                  style={styles.buyBtn}
                />
              )}
            </Card>
          );
        })}
      </View>

      {/* Banner Ad Placement */}
      <AdBanner />

      {/* Compliance Disclaimer */}
      <View style={styles.disclaimerBox}>
        <Text style={[typography.caption, styles.disclaimerText]}>
          * Important: Coins, boosters, and themes are purely virtual in-game items. They hold no monetary value and cannot be withdrawn or exchanged for real currency.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  feedbackBanner: {
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  feedbackText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  adBanner: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  adIconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  adInfo: {
    flex: 1,
  },
  adTitle: {
    color: colors.text,
  },
  adSub: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  adBtn: {
    width: '100%',
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  packList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  packCard: {
    padding: spacing.lg,
  },
  packHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  packIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  themePreviewBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  themeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  activeBadgeText: {
    color: colors.textDark,
    fontSize: 10,
    fontWeight: '900',
  },
  packInfo: {
    flex: 1,
  },
  packTitle: {
    color: colors.text,
  },
  packQty: {
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  packDesc: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  buyBtn: {
    width: '100%',
  },
  disclaimerBox: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  disclaimerText: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
