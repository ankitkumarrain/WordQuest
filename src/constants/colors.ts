/**
 * WordQuest Casual Game Color System
 * Warm, organic, tactile wooden & parchment aesthetic tailored for casual word puzzles.
 */

export const colors = {
  // Backgrounds - Deep serene moss & forest canopy tones
  background: '#0D1812',          // Deep forest moss night
  backgroundSecondary: '#13231A', // Lush understory canvas
  backgroundOverlay: 'rgba(10, 18, 13, 0.88)', // Botanical modal overlay

  // Surfaces & Cards - Frosted foliage & tactile wooden containers
  surface: '#1A2C22',             // Primary botanical card surface
  surfaceElevated: '#21382C',     // Elevated card / modal body
  surfaceHighlight: '#2A4638',    // Hover / pressed active surface
  surfaceBorder: '#2E4C3C',       // Moss leaf border
  surfaceBorderLight: '#436B55',  // Active / selected card border

  // Brand Accents - Vibrant Leaf Emerald & Radiant Golden Sunlight
  primary: '#10B981',             // Fresh Emerald Leaf
  primaryDark: '#059669',         // Deep Evergreen shade
  primaryMuted: 'rgba(16, 185, 129, 0.18)',

  secondary: '#F59E0B',           // Sunlit Amber Glow
  secondaryDark: '#D97706',
  secondaryMuted: 'rgba(245, 158, 11, 0.2)',

  // Virtual Economy & Rewards
  gold: '#FBBF24',                // Honey Dew Gold
  goldDark: '#D97706',
  goldMuted: 'rgba(251, 191, 36, 0.22)',

  // Functional Status
  success: '#22C55E',             // Fresh Botanical Sprout
  danger: '#EF4444',              // Wild Berry Red
  dangerMuted: 'rgba(239, 68, 68, 0.16)',
  warning: '#F59E0B',             // Autumn Amber
  info: '#06B6D4',                // Clear Stream Cyan

  // Typography Colors - Soft warm readability on nature backgrounds
  text: '#F3FBF6',                // Crisp Dewdrop White
  textSecondary: '#A7C4B5',       // Sage Green Subtext
  textMuted: '#6B8A78',           // Muted Forest Slate
  textDark: '#0B150F',            // High contrast text on bright emerald buttons
  textGold: '#FDE68A',

  // Word Search Grid Colors (Defaults for Forest Theme)
  gridCellBackground: '#1A2C22',
  gridCellBorder: 'rgba(52, 211, 153, 0.25)',
  gridCellSelected: '#059669',
  gridCellFound: '#10B981',
  gridCellText: '#ECFDF5',
  gridCellTextSelected: '#FFFFFF',
} as const;

/**
 * 12 Vibrant Curated Colors for Multi-Color Word Highlights
 */
export const wordHighlightPalette = [
  '#FF7A00', // 1. Sunset Orange
  '#10B981', // 2. Neon Emerald
  '#F59E0B', // 3. Golden Amber
  '#06B6D4', // 4. Sky Cyan
  '#EC4899', // 5. Hot Pink
  '#8B5CF6', // 6. Electric Violet
  '#3B82F6', // 7. Royal Blue
  '#F43F5E', // 8. Bright Coral
  '#14B8A6', // 9. Vivid Turquoise
  '#EAB308', // 10. Canary Gold
  '#84CC16', // 11. Lime Green
  '#A855F7', // 12. Orchid Purple
] as const;

/**
 * Returns a consistent vibrant color for a word either by index or word string
 */
export function getWordColor(indexOrWord: number | string, allWords?: string[]): string {
  if (typeof indexOrWord === 'number') {
    return wordHighlightPalette[Math.abs(indexOrWord) % wordHighlightPalette.length];
  }
  if (allWords && allWords.length > 0) {
    const idx = allWords.indexOf(indexOrWord);
    if (idx !== -1) {
      return wordHighlightPalette[idx % wordHighlightPalette.length];
    }
  }
  let hash = 0;
  for (let i = 0; i < indexOrWord.length; i++) {
    hash = (hash << 5) - hash + indexOrWord.charCodeAt(i);
    hash |= 0;
  }
  return wordHighlightPalette[Math.abs(hash) % wordHighlightPalette.length];
}

export type ColorToken = keyof typeof colors;
