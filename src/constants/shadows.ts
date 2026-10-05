import { ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * WordQuest Elevation, Shadow and Neon Glow System
 */

export const shadows: Record<string, ViewStyle> = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6.27,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 10.32,
    elevation: 8,
  },
  tealGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  violetGlow: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 6,
  },
  goldGlow: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },
};
