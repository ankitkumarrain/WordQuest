/**
 * WordQuest 4-point Spacing Grid
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  gutter: 28,
  section: 32,
  huge: 48,
  massive: 64,
} as const;

export type SpacingToken = keyof typeof spacing;
