import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/borderRadius';
import { GridTheme } from '@/constants/themes';

export interface GridCellProps {
  letter: string;
  row: number;
  col: number;
  size: number;
  cellMargin?: number;
  isSelected: boolean;
  isFound: boolean;
  isHinted: boolean;
  theme?: GridTheme;
}

export const GridCell: React.FC<GridCellProps> = React.memo(
  ({ letter, size, cellMargin = 1.5, isSelected, isFound, isHinted, theme }) => {
    let backgroundColor: string = theme?.cellBg ?? '#2E1E16';
    let borderColor: string = theme?.cellBorder ?? 'rgba(245, 158, 11, 0.2)';
    let borderBottomColor: string = theme?.cellBottomBorder ?? '#1A0F0A';
    let textColor: string = theme?.cellTextColor ?? '#FDE68A';

    if (isSelected) {
      backgroundColor = theme?.activeCellBg ?? '#D97706';
      borderColor = theme?.activeCellBorder ?? '#F59E0B';
      borderBottomColor = theme?.activeCellBorder ?? '#B45309';
      textColor = '#FFFFFF';
    } else if (isFound) {
      backgroundColor = 'transparent';
      borderColor = 'transparent';
      borderBottomColor = 'transparent';
      textColor = '#FFFFFF';
    } else if (isHinted) {
      backgroundColor = 'rgba(255, 209, 102, 0.25)';
      borderColor = colors.gold;
      borderBottomColor = '#D97706';
      textColor = colors.gold;
    }

    const fontSize = Math.max(11, Math.floor(size * (size <= 24 ? 0.6 : 0.54)));
    const borderBottomWidth = size <= 24 ? 1.5 : (isSelected ? 1.5 : 3.5);

    return (
      <View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            margin: cellMargin,
            borderWidth: 1,
            borderBottomWidth,
            backgroundColor,
            borderColor,
            borderBottomColor,
            borderRadius: Math.min(borderRadius.lg, Math.floor(size * 0.26)),
            transform: isSelected ? [{ scale: 0.94 }] : [{ scale: 1.0 }],
          },
        ]}
      >
        <Text
          style={[
            styles.letterText,
            {
              fontSize,
              color: textColor,
              fontWeight: isSelected ? '900' : '800',
            },
          ]}
        >
          {letter}
        </Text>
      </View>
    );
  },
  (prev, next) =>
    prev.letter === next.letter &&
    prev.size === next.size &&
    prev.cellMargin === next.cellMargin &&
    prev.isSelected === next.isSelected &&
    prev.isFound === next.isFound &&
    prev.isHinted === next.isHinted &&
    prev.theme?.id === next.theme?.id
);

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 2,
    elevation: 3,
  },
  letterText: {
    textAlign: 'center',
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
