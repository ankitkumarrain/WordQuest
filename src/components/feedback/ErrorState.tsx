import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon name="close" size={32} color={colors.danger} />
      </View>
      <Text style={[typography.h2, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.message]}>{message}</Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          icon="refresh"
          size="md"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.dangerMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  retryBtn: {
    minWidth: 150,
  },
});
