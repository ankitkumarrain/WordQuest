import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, getWordColor } from '@/constants/colors';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { Icon } from '@/components/common/Icon';

export interface WordChipsBarProps {
  words: string[];
  foundWords: string[];
}

export const WordChipsBar: React.FC<WordChipsBarProps> = ({ words, foundWords }) => {
  const isLargeSet = words.length > 8;
  const isMediumSet = words.length > 5 && words.length <= 8;
  const foundCount = words.filter((w) => foundWords.includes(w)).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.counterText}>
          TARGETS: <Text style={styles.counterHighlight}>{foundCount} / {words.length}</Text>
        </Text>
      </View>

      <View style={[styles.wrapContainer, isLargeSet && styles.wrapContainerDense]}>
        {words.map((word, index) => {
          const isFound = foundWords.includes(word);
          const wordColor = getWordColor(index, words);

          return (
            <View
              key={word}
              style={[
                styles.chip,
                isLargeSet
                  ? styles.chipUltraCompact
                  : isMediumSet
                  ? styles.chipCompact
                  : null,
                isFound
                  ? {
                      backgroundColor: `${wordColor}26`,
                      borderColor: wordColor,
                    }
                  : styles.chipUnfound,
              ]}
            >
              {isFound && (
                <Icon name="check" size={isLargeSet ? 9 : 11} color={wordColor} />
              )}
              <Text
                style={[
                  styles.wordText,
                  isLargeSet
                    ? styles.wordTextUltraCompact
                    : isMediumSet
                    ? styles.wordTextCompact
                    : null,
                  isFound
                    ? {
                        color: wordColor,
                        textDecorationLine: 'line-through',
                      }
                    : null,
                ]}
              >
                {word}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 3,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  counterHighlight: {
    color: colors.primary,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  wrapContainerDense: {
    gap: 3.5,
    paddingHorizontal: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  chipCompact: {
    paddingVertical: 3.5,
    paddingHorizontal: 7,
  },
  chipUltraCompact: {
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderRadius: borderRadius.sm + 2,
    borderWidth: 1,
  },
  chipUnfound: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorderLight,
  },
  chipFound: {
    backgroundColor: colors.secondaryMuted,
    borderColor: colors.secondary,
  },
  wordText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  wordTextCompact: {
    fontSize: 11,
  },
  wordTextUltraCompact: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  wordTextFound: {
    color: colors.secondary,
    textDecorationLine: 'line-through',
  },
});
