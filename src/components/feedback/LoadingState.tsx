import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  subMessage,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.h3, styles.message]}>{message}</Text>
      {subMessage && (
        <Text style={[typography.bodySmall, styles.subMessage]}>
          {subMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  message: {
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subMessage: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
