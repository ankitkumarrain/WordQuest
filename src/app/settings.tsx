import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/common/Card';
import { Icon, IconName } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AudioService } from '@/services/AudioService';

import { AdMobManager } from '@/services/ads/AdMobManager';

export default function SettingsScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const soundEnabled = usePlayerStore((s) => s.soundEnabled);
  const hapticsEnabled = usePlayerStore((s) => s.hapticsEnabled);
  const toggleSound = usePlayerStore((s) => s.toggleSound);
  const toggleHaptics = usePlayerStore((s) => s.toggleHaptics);

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const username = profile?.username || 'Adventurer';

  return (
    <ScreenContainer
      title="Settings"
      subtitle="Preferences & Information"
      showBackButton
      scrollable
    >
      {/* Player Profile & Storage Section */}
      <Text style={[typography.caption, styles.sectionHeader]}>PLAYER PROFILE & STORAGE</Text>
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.accountRow}>
          <View style={styles.avatarCircle}>
            <Icon name="profile" size={24} color={colors.primary} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={[typography.body, styles.accountTitle]}>
              {username}
            </Text>
            <Text style={[typography.caption, styles.accountSubtitle]}>
              Offline Play Ready • Progress Saved ✨
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Icon name="shield" size={20} color={colors.secondary} />
            <View>
              <Text style={[typography.body, styles.label]}>Game Save Status</Text>
              <Text style={[typography.caption, styles.syncCaption]}>
                Always saved on your phone. Play anytime without Wi-Fi.
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Audio & Feedback Section */}
      <Text style={[typography.caption, styles.sectionHeader]}>AUDIO & FEEDBACK</Text>
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Icon name={soundEnabled ? 'sound-on' : 'sound-off'} size={20} color={colors.primary} />
            <Text style={[typography.body, styles.label]}>Sound Effects</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Icon name="sound-on" size={20} color={colors.secondary} />
            <Text style={[typography.body, styles.label]}>Ambient Music</Text>
          </View>
          <Switch
            value={musicEnabled}
            onValueChange={(val) => {
              setMusicEnabled(val);
              AudioService.setMusicEnabled(val);
            }}
            trackColor={{ false: colors.surfaceBorder, true: colors.secondary }}
            thumbColor={colors.text}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Icon name="vibrate" size={20} color={colors.warning} />
            <Text style={[typography.body, styles.label]}>Vibration Haptics</Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={toggleHaptics}
            trackColor={{ false: colors.surfaceBorder, true: colors.warning }}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      {/* Notifications Section */}
      <Text style={[typography.caption, styles.sectionHeader]}>NOTIFICATIONS</Text>
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <Icon name="fire" size={20} color={colors.gold} />
            <Text style={[typography.body, styles.label]}>Daily Streak Reminders</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.surfaceBorder, true: colors.gold }}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      {/* Support & Legal Links */}
      <Text style={[typography.caption, styles.sectionHeader]}>ABOUT & LEGAL</Text>
      <Card variant="elevated" style={styles.sectionCard}>
        {[
          { title: 'How to Play', icon: 'help' as IconName, route: '/how-to-play' as const },
          { title: 'Help & Support', icon: 'shield' as IconName, route: '/help' as const },
          { title: 'Privacy Policy', icon: 'document' as IconName, route: '/privacy' as const },
          { title: 'Terms of Service', icon: 'document' as IconName, route: '/terms' as const },
          {
            title: 'Ad Privacy Preferences (GDPR)',
            icon: 'shield' as IconName,
            onPress: () => AdMobManager.showPrivacyOptionsForm(),
          },
        ].map((item, idx, arr) => (
          <React.Fragment key={item.title}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => ('onPress' in item && item.onPress ? item.onPress() : 'route' in item && item.route ? router.push(item.route) : undefined)}
              style={styles.linkRow}
            >
              <View style={styles.labelGroup}>
                <Icon name={item.icon} size={18} color={colors.textSecondary} />
                <Text style={[typography.body, styles.label]}>{item.title}</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            {idx < arr.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>

      {/* App Version Info */}
      <View style={styles.versionContainer}>
        <Text style={[typography.caption, styles.versionText]}>
          WordQuest v1.0.0 (Build 1)
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountTitle: {
    color: colors.text,
    fontWeight: 'bold',
  },
  accountSubtitle: {
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  label: {
    color: colors.text,
  },
  syncCaption: {
    color: colors.textMuted,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginVertical: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  linkRowPressed: {
    backgroundColor: colors.surfaceHighlight,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  versionText: {
    color: colors.textMuted,
  },
});
