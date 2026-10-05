import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function PauseModal() {
  const [confirmQuit, setConfirmQuit] = useState(false);

  const handleResume = useCallback(() => {
    router.back();
  }, []);

  const handleRestart = () => {
    router.replace('/gameplay');
  };

  const handleQuitConfirm = () => {
    router.replace('/(tabs)');
  };

  // Hardware back button on Pause screen:
  // If in confirmation state -> return to pause menu
  // If in pause menu -> resume gameplay cleanly
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (confirmQuit) {
          setConfirmQuit(false);
          return true;
        }
        handleResume();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [confirmQuit, handleResume])
  );

  return (
    <Modal
      visible
      onClose={handleResume}
      title={confirmQuit ? 'Quit Level?' : 'Game Paused'}
      showCloseButton={!confirmQuit}
    >
      {confirmQuit ? (
        <View style={styles.confirmBox}>
          <Text style={[typography.body, styles.confirmText]}>
            Are you sure you want to quit? Any uncompleted progress in this puzzle will be lost.
          </Text>
          <View style={styles.buttonStack}>
            <Button
              title="Resume Game"
              onPress={() => setConfirmQuit(false)}
              variant="primary"
              size="md"
              fullWidth
            />
            <Button
              title="Exit to Home"
              onPress={handleQuitConfirm}
              variant="danger"
              size="md"
              fullWidth
            />
          </View>
        </View>
      ) : (
        <View style={styles.menuBox}>
          <Text style={[typography.bodySmall, styles.subtitle]}>
            Take a breather. Your puzzle timer is stopped.
          </Text>

          <View style={styles.buttonStack}>
            <Button
              title="Resume"
              onPress={handleResume}
              variant="primary"
              size="lg"
              icon="play"
              fullWidth
            />
            <Button
              title="Restart Level"
              onPress={handleRestart}
              variant="outline"
              size="md"
              icon="refresh"
              fullWidth
            />
            <Button
              title="Settings"
              onPress={() => router.push('/settings')}
              variant="outline"
              size="md"
              icon="settings"
              fullWidth
            />
            <Button
              title="Quit to Menu"
              onPress={() => setConfirmQuit(true)}
              variant="ghost"
              size="md"
              fullWidth
            />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmBox: {
    paddingVertical: spacing.sm,
  },
  confirmText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  menuBox: {
    paddingVertical: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonStack: {
    gap: spacing.md,
  },
});
