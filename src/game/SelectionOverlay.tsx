import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GridCoordinate, PlacedWord } from '@/game-engine/types';
import { colors, getWordColor } from '@/constants/colors';

export interface SelectionOverlayProps {
  width: number;
  height: number;
  cols: number;
  rows: number;
  cellSize: number;
  cellMargin?: number;
  activeCells: GridCoordinate[];
  foundWords: PlacedWord[];
  allWords?: string[];
}

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  width,
  height,
  cols,
  rows,
  cellSize,
  cellMargin = 1.5,
  activeCells,
  foundWords,
  allWords = [],
}) => {
  if (width <= 0 || height <= 0 || cellSize <= 0) return null;

  const totalCellSpan = cellSize + cellMargin * 2;
  const offsetX = Math.max(0, (width - cols * totalCellSpan) / 2);
  const offsetY = Math.max(0, (height - rows * totalCellSpan) / 2);

  // Calculates the center pixel coordinate of cell (row, col)
  const getCellCenter = (coord: GridCoordinate) => {
    return {
      x: offsetX + coord.col * totalCellSpan + totalCellSpan / 2,
      y: offsetY + coord.row * totalCellSpan + totalCellSpan / 2,
    };
  };

  const strokeWidth = cellSize * 0.78;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <Svg width={width} height={height}>
        {/* 1. Permanent Found Words Layer - Multi-Color Vibrant Highlights */}
        {foundWords.map((word) => {
          if (word.cells.length === 0) return null;
          const startPt = getCellCenter(word.start);
          const endPt = getCellCenter(word.end);
          const wordColor = getWordColor(word.word, allWords);

          return (
            <Line
              key={word.word}
              x1={startPt.x}
              y1={startPt.y}
              x2={endPt.x}
              y2={endPt.y}
              stroke={wordColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity={0.88}
            />
          );
        })}

        {/* 2. Active Touch Drag Selection Capsule */}
        {activeCells.length > 0 && (
          <Line
            x1={getCellCenter(activeCells[0]).x}
            y1={getCellCenter(activeCells[0]).y}
            x2={getCellCenter(activeCells[activeCells.length - 1]).x}
            y2={getCellCenter(activeCells[activeCells.length - 1]).y}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeOpacity={0.70}
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
  },
});
