import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 10,
  color = colors.primary,
  trackColor = colors.surfaceBorder,
  showLabel = false,
  label,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[typography.caption, styles.labelText]}>
            {label || `${percentage}%`}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          { height, backgroundColor: trackColor, borderRadius: borderRadius.pill },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              borderRadius: borderRadius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  labelText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
