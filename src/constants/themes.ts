export interface GridTheme {
  id: string;
  name: string;
  description: string;
  cost: number;
  previewColor: string;
  cellBg: string;
  cellBorder: string;
  cellBottomBorder: string;
  cellTextColor: string;
  activeCellBg: string;
  activeCellBorder: string;
  screenBg: string;
  accentColor: string;
}

export const GAME_THEMES: Record<string, GridTheme> = {
  theme_parchment: {
    id: 'theme_parchment',
    name: 'Lush Forest Canopy',
    description: 'Serene sunlit foliage with carved wooden tiles and emerald accents.',
    cost: 0,
    previewColor: '#22C55E',
    cellBg: 'rgba(30, 48, 36, 0.92)',
    cellBorder: 'rgba(52, 211, 153, 0.28)',
    cellBottomBorder: '#0F1E16',
    cellTextColor: '#ECFDF5',
    activeCellBg: '#059669',
    activeCellBorder: '#34D399',
    screenBg: '#0C1A13',
    accentColor: '#10B981',
  },
  theme_neon: {
    id: 'theme_neon',
    name: 'Mountain Meadow',
    description: 'Bright alpine wildflowers with clean moss stone tiles.',
    cost: 300,
    previewColor: '#14B8A6',
    cellBg: 'rgba(20, 36, 30, 0.92)',
    cellBorder: 'rgba(45, 212, 191, 0.25)',
    cellBottomBorder: '#0C1814',
    cellTextColor: '#CCFBF1',
    activeCellBg: '#0D9488',
    activeCellBorder: '#2DD4BF',
    screenBg: '#0A1713',
    accentColor: '#14B8A6',
  },
  theme_sunset: {
    id: 'theme_sunset',
    name: 'Autumn Grove',
    description: 'Warm golden amber foliage with mahogany timber tiles.',
    cost: 400,
    previewColor: '#F59E0B',
    cellBg: 'rgba(46, 30, 22, 0.92)',
    cellBorder: 'rgba(245, 158, 11, 0.28)',
    cellBottomBorder: '#1A0F0A',
    cellTextColor: '#FEF3C7',
    activeCellBg: '#D97706',
    activeCellBorder: '#FBBF24',
    screenBg: '#1A120D',
    accentColor: '#F59E0B',
  },
  theme_amoled: {
    id: 'theme_amoled',
    name: 'Deep Evergreen',
    description: 'Mystical midnight forest with glowing jade crystal tiles.',
    cost: 500,
    previewColor: '#10B981',
    cellBg: 'rgba(12, 25, 18, 0.94)',
    cellBorder: 'rgba(16, 185, 129, 0.3)',
    cellBottomBorder: '#060E0A',
    cellTextColor: '#D1FAE5',
    activeCellBg: '#047857',
    activeCellBorder: '#10B981',
    screenBg: '#050D09',
    accentColor: '#34D399',
  },
};
