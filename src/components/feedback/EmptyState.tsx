import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import { Icon, IconName } from '../common/Icon';
import { Button } from '../common/Button';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={[typography.h2, styles.title]}>{title}</Text>
      {description && (
        <Text style={[typography.body, styles.description]}>{description}</Text>
      )}
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.actionBtn}
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
    width: 72,
    height: 72,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorderLight,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  actionBtn: {
    minWidth: 160,
  },
});
