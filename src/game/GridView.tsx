import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  LayoutChangeEvent,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { ActivePuzzle, GridCoordinate, PlacedWord } from '@/game-engine/types';
import { Raycaster } from '@/game-engine/mechanics/Raycaster';
import { WordDetector } from '@/game-engine/mechanics/WordDetector';
import { HapticService } from '@/services/HapticService';
import { AudioService } from '@/services/AudioService';
import { GridCell } from './GridCell';
import { SelectionOverlay } from './SelectionOverlay';
import { colors } from '@/constants/colors';
import { borderRadius } from '@/constants/borderRadius';
import { usePlayerStore } from '@/store/usePlayerStore';
import { GAME_THEMES } from '@/constants/themes';
import { DictionaryService } from '@/services/DictionaryService';

export interface GridViewProps {
  puzzle: ActivePuzzle;
  foundWords: string[];
  hintedCells?: GridCoordinate[];
  onWordFound: (placedWord: PlacedWord) => void;
  onBonusWordFound?: (bonusWord: string) => void;
  onSelectionChange?: (selectedWordString: string) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  puzzle,
  foundWords,
  hintedCells = [],
  onWordFound,
  onBonusWordFound,
  onSelectionChange,
}) => {
  const activeThemeKey = usePlayerStore((s) => s.activeTheme);
  const theme = GAME_THEMES[activeThemeKey] || GAME_THEMES.theme_neon;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [measuredParentSize, setMeasuredParentSize] = useState({ width: 0, height: 0 });
  const [activeCells, setActiveCells] = useState<GridCoordinate[]>([]);
  const [tappedStartCell, setTappedStartCell] = useState<GridCoordinate | null>(null);

  const startCellRef = useRef<GridCoordinate | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastCrossedCellRef = useRef<string | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 7, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const { rows, cols, grid, words } = puzzle;

  // Responsive margins and padding tailored for dense grids (e.g. 14x14 Grandmaster)
  const cellMargin = cols >= 14 ? 0.75 : cols >= 12 ? 1 : 1.25;
  const containerPadding = cols >= 14 ? 4 : cols >= 12 ? 6 : 8;

  // Max space available for the grid, utilizing full screen width with minimal outer margin
  const availableMaxWidth = measuredParentSize.width > 0
    ? Math.min(measuredParentSize.width, windowWidth - 8)
    : windowWidth - 8;

  const availableMaxHeight = measuredParentSize.height > 0
    ? measuredParentSize.height
    : Math.min(windowHeight * 0.54, 400);

  // Calculate cell size based on available container dimensions (both width and height)
  const cellSize = useMemo(() => {
    const usableWidth = availableMaxWidth - containerPadding * 2;
    const sizeByWidth = Math.floor(usableWidth / cols) - cellMargin * 2;

    const usableHeight = availableMaxHeight - containerPadding * 2;
    const sizeByHeight = Math.floor(usableHeight / rows) - cellMargin * 2;

    return Math.max(Math.min(sizeByWidth, sizeByHeight), 16);
  }, [availableMaxWidth, availableMaxHeight, cols, rows, containerPadding, cellMargin]);

  const totalCellSpan = cellSize + cellMargin * 2;
  const totalGridWidth = cols * totalCellSpan + containerPadding * 2;
  const totalGridHeight = rows * totalCellSpan + containerPadding * 2;

  // Helper to convert container-relative touch coords (x, y) to { row, col }
  const getCellFromTouch = useCallback(
    (touchX: number, touchY: number): GridCoordinate | null => {
      if (cellSize <= 0) return null;
      const offsetX = Math.max(0, (totalGridWidth - cols * totalCellSpan) / 2);
      const offsetY = Math.max(0, (totalGridHeight - rows * totalCellSpan) / 2);

      const relX = touchX - offsetX;
      const relY = touchY - offsetY;

      const col = Math.floor(relX / totalCellSpan);
      const row = Math.floor(relY / totalCellSpan);

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        return { row, col };
      }
      return null;
    },
    [cellSize, totalGridWidth, totalGridHeight, cols, rows, totalCellSpan]
  );

  const commitSelection = useCallback(
    (cells: GridCoordinate[]) => {
      if (cells.length > 1) {
        const selectedString = cells.map((c) => grid[c.row][c.col]).join('');
        const matched = WordDetector.matchWord(selectedString, words, foundWords);

        if (matched) {
          HapticService.wordFound();
          AudioService.playWordFound();
          onWordFound(matched);
        } else {
          const bonus = DictionaryService.checkBonusCandidate(selectedString);
          if (bonus && onBonusWordFound) {
            HapticService.wordFound();
            AudioService.playBonusWord();
            onBonusWordFound(bonus);
          } else {
            HapticService.wordInvalid();
            AudioService.playWordInvalid();
            triggerShake();
          }
        }
      }
      setActiveCells([]);
      setTappedStartCell(null);
      onSelectionChange?.('');
    },
    [grid, words, foundWords, onWordFound, onBonusWordFound, onSelectionChange, triggerShake]
  );

  const handleTouchStart = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    touchStartPosRef.current = { x: locationX, y: locationY };
    isDraggingRef.current = false;

    const cell = getCellFromTouch(locationX, locationY);
    if (!cell) return;

    startCellRef.current = cell;
    lastCrossedCellRef.current = `${cell.row}_${cell.col}`;

    // If player had already tapped a start cell (tap-to-select / toggle mode)
    if (tappedStartCell) {
      // 1. Tapping the exact same cell -> Toggle OFF!
      if (tappedStartCell.row === cell.row && tappedStartCell.col === cell.col) {
        setTappedStartCell(null);
        setActiveCells([]);
        onSelectionChange?.('');
        HapticService.letterCross();
        return;
      }

      // 2. Tapping a second cell -> Check if forms a straight line ray
      const snapped = Raycaster.snapToCanonical(tappedStartCell, cell);
      const result = Raycaster.projectLine(tappedStartCell, snapped, grid);

      if (result.valid && result.cells.length > 1) {
        setActiveCells(result.cells);
        onSelectionChange?.(result.wordString);
        commitSelection(result.cells);
        return;
      }
    }

    // New touch/press:
    setActiveCells([cell]);
    HapticService.letterCross();
    AudioService.playTileDrag(1);
    onSelectionChange?.(grid[cell.row][cell.col]);
  };

  const handleTouchMove = (evt: GestureResponderEvent) => {
    if (!startCellRef.current || !touchStartPosRef.current) return;

    const { locationX, locationY } = evt.nativeEvent;
    const dx = locationX - touchStartPosRef.current.x;
    const dy = locationY - touchStartPosRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If finger moves more than 8 pixels, switch to drag mode
    if (dist > 8) {
      isDraggingRef.current = true;
      if (tappedStartCell) {
        setTappedStartCell(null);
      }
    }

    if (!isDraggingRef.current) return;

    const currentCell = getCellFromTouch(locationX, locationY);
    if (!currentCell) return;

    const snapped = Raycaster.snapToCanonical(startCellRef.current, currentCell);
    const result = Raycaster.projectLine(startCellRef.current, snapped, grid);

    if (result.valid && result.cells.length > 0) {
      const endCoord = result.cells[result.cells.length - 1];
      const coordKey = `${endCoord.row}_${endCoord.col}`;

      if (coordKey !== lastCrossedCellRef.current) {
        lastCrossedCellRef.current = coordKey;
        HapticService.letterCross();
        AudioService.playTileDrag(result.cells.length);
      }

      setActiveCells(result.cells);
      onSelectionChange?.(result.wordString);
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      // Completed a drag gesture
      if (activeCells.length > 1) {
        commitSelection(activeCells);
      } else {
        setActiveCells([]);
        onSelectionChange?.('');
      }
      isDraggingRef.current = false;
      startCellRef.current = null;
      lastCrossedCellRef.current = null;
      return;
    }

    // It was a TAP (not a drag)
    if (startCellRef.current) {
      const tapped = startCellRef.current;
      // If we don't already have this cell toggled on:
      if (!tappedStartCell || (tappedStartCell.row !== tapped.row || tappedStartCell.col !== tapped.col)) {
        setTappedStartCell(tapped);
        setActiveCells([tapped]);
        onSelectionChange?.(grid[tapped.row][tapped.col]);
      }
    }

    startCellRef.current = null;
    lastCrossedCellRef.current = null;
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && (width !== measuredParentSize.width || height !== measuredParentSize.height)) {
      setMeasuredParentSize({ width, height });
    }
  };

  // Find placed words that are currently marked found
  const foundPlacedWords = useMemo(
    () => words.filter((w) => foundWords.includes(w.word)),
    [words, foundWords]
  );

  // Set of selected coordinate keys for fast cell lookup
  const activeCellSet = useMemo(
    () => new Set(activeCells.map((c) => `${c.row}_${c.col}`)),
    [activeCells]
  );

  // Set of found coordinate keys
  const foundCellSet = useMemo(() => {
    const set = new Set<string>();
    for (const w of foundPlacedWords) {
      for (const c of w.cells) {
        set.add(`${c.row}_${c.col}`);
      }
    }
    return set;
  }, [foundPlacedWords]);

  // Set of hinted coordinate keys
  const hintedCellSet = useMemo(
    () => new Set(hintedCells.map((c) => `${c.row}_${c.col}`)),
    [hintedCells]
  );

  return (
    <View style={styles.outerWrapper} onLayout={handleLayout}>
      <Animated.View
        style={[
          styles.gridContainer,
          {
            width: totalGridWidth,
            height: totalGridHeight,
            padding: containerPadding,
            backgroundColor: theme.cellBg,
            borderColor: theme.cellBorder,
            transform: [{ translateX: shakeAnim }],
          },
        ]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouchStart}
        onResponderMove={handleTouchMove}
        onResponderRelease={handleTouchEnd}
        onResponderTerminate={handleTouchEnd}
      >
        {/* SVG Vector Line Overlay (Under letters) */}
        <SelectionOverlay
          width={totalGridWidth}
          height={totalGridHeight}
          cols={cols}
          rows={rows}
          cellSize={cellSize}
          cellMargin={cellMargin}
          activeCells={activeCells}
          foundWords={foundPlacedWords}
          allWords={words.map((w) => w.word)}
        />

        <View style={styles.gridMatrix} pointerEvents="none">
          {grid.map((rowArr, r) => (
            <View key={`row_${r}`} style={styles.gridRow}>
              {rowArr.map((letter, c) => {
                const key = `${r}_${c}`;
                return (
                  <GridCell
                    key={key}
                    letter={letter}
                    row={r}
                    col={c}
                    size={cellSize}
                    cellMargin={cellMargin}
                    isSelected={activeCellSet.has(key)}
                    isFound={foundCellSet.has(key)}
                    isHinted={hintedCellSet.has(key)}
                    theme={theme}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  gridMatrix: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  gridRow: {
    flexDirection: 'row',
  },
});
