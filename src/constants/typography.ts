import { TextStyle } from 'react-native';

/**
 * WordQuest Typography System
 * Clean, bold mobile game typography scaling with system font fallbacks.
 */

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
  hero: 44,
} as const;

export const lineHeights = {
  xs: 15,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 30,
  xxl: 36,
  display: 44,
  hero: 52,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
} as const;

export const typography: Record<string, TextStyle> = {
  hero: {
    fontSize: fontSizes.hero,
    lineHeight: lineHeights.hero,
    fontWeight: fontWeights.black,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.25,
  },
  h1: {
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.bold,
  },
  h3: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.semibold,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.regular,
  },
  body: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
  },
  bodyMedium: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.medium,
  },
  bodyBold: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.bold,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gridLetter: {
    fontSize: 22,
    fontWeight: fontWeights.black,
    letterSpacing: 0.5,
  },
};
