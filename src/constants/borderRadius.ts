/**
 * WordQuest Border Radius System
 * Follows Stitch aesthetic: rounded, soft, friendly, arcade feel.
 */

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 30,
  pill: 9999,
  circle: 9999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
