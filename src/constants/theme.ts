import { colors } from './colors';
import { typography, fontSizes, lineHeights, fontWeights } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  fontSizes,
  lineHeights,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
