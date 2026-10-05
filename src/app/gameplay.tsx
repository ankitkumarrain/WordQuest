import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { borderRadius } from '@/constants/borderRadius';
import {
  ActivePuzzle,
  GridCoordinate,
  PlacedWord,
} from '@/game-engine/types';
import { GridGenerator } from '@/game-engine/core/GridGenerator';
import { BoosterLogic } from '@/game-engine/mechanics/BoosterLogic';
import { SeededPRNG } from '@/game-engine/core/SeededPRNG';
import { HapticService } from '@/services/HapticService';
import { AudioService } from '@/services/AudioService';
import {
  GridView,
  WordChipsBar,
  GameplayHeader,
  BoosterControls,
} from '@/game';
import { usePlayerStore } from '@/store/usePlayerStore';
import { RewardService } from '@/services/RewardService';
import { ProgressionRepository } from '@/database/repositories/ProgressionRepository';
import { DailyChallengeRepository } from '@/database/repositories/DailyChallengeRepository';
import { StreakService } from '@/services/StreakService';
import { DailyChallengeService } from '@/services/DailyChallengeService';
import { getLevelConfig } from '@/data/levels';
import { getCategoryConfig } from '@/data/categories';

export default function GameplayScreen() {
  const params = useLocalSearchParams<{
    level?: string;
    difficulty?: string;
    mode?: string;
    categoryId?: string;
  }>();

  const levelNum = parseInt(params.level || '1', 10) || 1;
  const difficulty = params.difficulty || 'easy';
  const isDaily = params.mode === 'daily';
  const categoryConfig = useMemo(() => getCategoryConfig(params.categoryId), [params.categoryId]);

  // Get curated theme and vocabulary for this level
  const levelConfig = useMemo(() => getLevelConfig(levelNum), [levelNum]);

  const dailyInfo = useMemo(() => (isDaily ? DailyChallengeService.getDailyChallengeInfo() : null), [isDaily]);

  // Determine grid dimensions, target word count, and initial timer based on level progression
  const { gridRows, gridCols, wordCount, initialTime } = useMemo(() => {
    if (isDaily && dailyInfo) {
      return {
        gridRows: dailyInfo.gridRows,
        gridCols: dailyInfo.gridCols,
        wordCount: dailyInfo.wordCount,
        initialTime: dailyInfo.initialTime,
      };
    }

    // If user explicitly chose a difficulty mode, respect it
    if (params.difficulty && params.difficulty !== 'easy') {
      switch (params.difficulty) {
        case 'medium':
          return { gridRows: 10, gridCols: 10, wordCount: 8, initialTime: 150 };
        case 'hard':
          return { gridRows: 12, gridCols: 12, wordCount: 12, initialTime: 120 };
        case 'expert':
          return { gridRows: 14, gridCols: 14, wordCount: 16, initialTime: 105 };
      }
    }

    // Dynamic campaign progression curve based on levelNum:
    if (levelNum <= 4) {
      // Levels 1-4: Gentle start (7x7, 4 words, 180s)
      return { gridRows: 7, gridCols: 7, wordCount: 4, initialTime: 180 };
    } else if (levelNum <= 8) {
      // Levels 5-8: Casual (8x8, 5 words, 165s)
      return { gridRows: 8, gridCols: 8, wordCount: 5, initialTime: 165 };
    } else if (levelNum <= 14) {
      // Levels 9-14: Medium (9x9, 6 words, 150s) - Level 10 has 6 words on 9x9 grid
      return { gridRows: 9, gridCols: 9, wordCount: 6, initialTime: 150 };
    } else if (levelNum <= 20) {
      // Levels 15-20: Hard (10x10, 7 words, 135s)
      return { gridRows: 10, gridCols: 10, wordCount: 7, initialTime: 135 };
    } else {
      // Level 21+: Expert (11x11, 8 words, 120s)
      return { gridRows: 11, gridCols: 11, wordCount: 8, initialTime: 120 };
    }
  }, [params.difficulty, levelNum, isDaily, dailyInfo]);

  // Generate deterministic puzzle based on level seed or category
  const initialPuzzle = useMemo(() => {
    if (isDaily && dailyInfo) {
      return GridGenerator.generate({
        rows: dailyInfo.gridRows,
        cols: dailyInfo.gridCols,
        words: dailyInfo.words,
        seed: dailyInfo.seed,
      });
    }

    let seed = levelNum * 1000 + 42;
    if (categoryConfig) {
      let hash = 0;
      for (let i = 0; i < categoryConfig.id.length; i++) {
        hash = (hash << 5) - hash + categoryConfig.id.charCodeAt(i);
        hash |= 0;
      }
      seed = Math.abs(hash) + levelNum * 500 + 99;
    }

    const candidateWords = categoryConfig
      ? categoryConfig.words.slice(0, wordCount)
      : levelConfig.words.slice(0, wordCount);

    return GridGenerator.generate({
      rows: gridRows,
      cols: gridCols,
      words: candidateWords,
      seed,
    });
  }, [levelNum, isDaily, dailyInfo, gridRows, gridCols, wordCount, levelConfig, categoryConfig]);

  const [puzzle, setPuzzle] = useState<ActivePuzzle>(initialPuzzle);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [hintedCells, setHintedCells] = useState<GridCoordinate[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [bonusWords, setBonusWords] = useState<string[]>([]);
  const [bonusBanner, setBonusBanner] = useState<string | null>(null);

  // Track previous puzzle ID to reset state when level changes
  const [prevPuzzleId, setPrevPuzzleId] = useState<string>(initialPuzzle.id);
  if (prevPuzzleId !== initialPuzzle.id) {
    setPrevPuzzleId(initialPuzzle.id);
    setPuzzle(initialPuzzle);
    setFoundWords([]);
    setHintedCells([]);
    setBonusWords([]);
    setBonusBanner(null);
    setTimeRemaining(initialTime);
  }

  // Live mutable refs to eliminate any stale closures in booster and touch handlers
  const foundWordsRef = useRef<string[]>(foundWords);
  const hintedCellsRef = useRef<GridCoordinate[]>(hintedCells);
  const puzzleRef = useRef<ActivePuzzle>(puzzle);
  const timeRemainingRef = useRef<number>(timeRemaining);

  useEffect(() => {
    puzzleRef.current = puzzle;
  }, [puzzle]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    hintedCellsRef.current = hintedCells;
  }, [hintedCells]);

  useEffect(() => {
    foundWordsRef.current = foundWords;
  }, [foundWords]);

  // Boosters inventory state from Zustand store
  const coins = usePlayerStore((s) => s.coins);
  const hintsCount = usePlayerStore((s) => s.inventory['booster_hint'] ?? 0);
  const shufflesCount = usePlayerStore((s) => s.inventory['booster_shuffle'] ?? 0);
  const revealsCount = usePlayerStore((s) => s.inventory['booster_reveal'] ?? 0);
  const consumeBooster = usePlayerStore((s) => s.consumeBooster);
  const spendCoins = usePlayerStore((s) => s.spendCoins);
  const addCoins = usePlayerStore((s) => s.addCoins);

  const [buyModal, setBuyModal] = useState<{
    type: 'booster_hint' | 'booster_shuffle' | 'booster_reveal';
    name: string;
    cost: number;
    icon: 'hint' | 'shuffle' | 'reveal';
    desc: string;
  } | null>(null);

  // Reset consecutive audio tone on mount
  useEffect(() => {
    AudioService.resetConsecutive();
  }, []);

  // Android hardware back button → open pause only when gameplay is focused
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.push('/pause');
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  // Countdown timer effect
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isPaused, timeRemaining]);

  // Handle timeout navigation outside state reducer
  useEffect(() => {
    if (timeRemaining <= 0 && !isPaused) {
      router.replace({
        pathname: '/level-failed',
        params: { level: String(levelNum) },
      });
    }
  }, [timeRemaining, isPaused, levelNum]);

  // Word found callback
  const handleWordFound = useCallback(
    (placedWord: PlacedWord) => {
      if (foundWordsRef.current.includes(placedWord.word)) return;
      const nextFound = [...foundWordsRef.current, placedWord.word];
      foundWordsRef.current = nextFound;
      setFoundWords(nextFound);

      HapticService.wordFound();
      AudioService.playWordFound();

      // Check level victory condition
      if (nextFound.length >= puzzleRef.current.words.length) {
        HapticService.levelComplete();
        AudioService.playLevelComplete();

        const curTime = timeRemainingRef.current;
        const stars = curTime > initialTime * 0.5 ? 3 : curTime > initialTime * 0.25 ? 2 : 1;
        const score = nextFound.length * 150 + curTime * 10;
        const timeTaken = initialTime - curTime;

        (async () => {
          try {
            if (isDaily) {
              const today = StreakService.formatDateKey();
              await DailyChallengeRepository.saveCompletion(today, score, timeTaken);
              const res = await RewardService.claimDailyChallengeReward(today, 100);
              if (res.success) addCoins(100);
            } else {
              const activeCategory = categoryConfig ? categoryConfig.id : 'journey';
              await ProgressionRepository.saveLevelResult(levelNum, activeCategory, difficulty, stars, score, timeTaken);
              const res = await RewardService.claimLevelCompletionReward(levelNum, 50);
              if (res.success) addCoins(50);
            }
          } catch (e) {
            console.warn('Level completion persist error:', e);
          }
        })();

        setTimeout(() => {
          router.replace({
            pathname: '/level-complete',
            params: {
              level: String(levelNum),
              difficulty,
              stars: String(stars),
              score: String(score),
            },
          });
        }, 450);
      }
    },
    [levelNum, difficulty, initialTime, isDaily, addCoins, categoryConfig]
  );

  // Bonus word found callback (+5 virtual coins reward)
  const handleBonusWordFound = useCallback(
    (word: string) => {
      if (bonusWords.includes(word)) return;
      setBonusWords((prev) => [...prev, word]);
      addCoins(5);
      AudioService.playBonusWord();
      HapticService.boosterTriggered();
      setBonusBanner(`Bonus Word: "${word}" (+5 🪙)`);
      setTimeout(() => {
        setBonusBanner(null);
      }, 2200);
    },
    [bonusWords, addCoins]
  );

  // Booster handlers
  const handleUseHint = useCallback(async () => {
    if (hintsCount <= 0) return;

    const currentFound = foundWordsRef.current;
    const currentHinted = hintedCellsRef.current;
    const hint = BoosterLogic.getHint(puzzleRef.current, currentFound, currentHinted);
    if (!hint) return;

    HapticService.boosterTriggered();
    AudioService.playBooster();

    const nextHinted = [...currentHinted, hint.cell];
    hintedCellsRef.current = nextHinted;
    setHintedCells(nextHinted);

    try {
      await consumeBooster('booster_hint');
    } catch (e) {
      console.warn('Failed to persist hint consume:', e);
    }
  }, [hintsCount, consumeBooster]);

  const handleUseShuffle = useCallback(async () => {
    if (shufflesCount <= 0) {
      setBuyModal({
        type: 'booster_shuffle',
        name: 'Shuffle',
        cost: 30,
        icon: 'shuffle',
        desc: 'Re-scrambles filler letters while keeping hidden words intact.',
      });
      return;
    }
    const prng = new SeededPRNG(Date.now());
    const newGrid = BoosterLogic.shuffleFiller(puzzleRef.current, prng);

    HapticService.boosterTriggered();
    AudioService.playBooster();
    setPuzzle((prev) => {
      const updated = {
        ...prev,
        grid: newGrid,
      };
      puzzleRef.current = updated;
      return updated;
    });

    consumeBooster('booster_shuffle').catch((e) => {
      console.warn('Failed to persist shuffle consume:', e);
    });
  }, [shufflesCount, consumeBooster]);

  const handleUseReveal = useCallback(async () => {
    if (revealsCount <= 0) {
      setBuyModal({
        type: 'booster_reveal',
        name: 'Reveal',
        cost: 75,
        icon: 'reveal',
        desc: 'Instantly solves and clears one remaining hidden word.',
      });
      return;
    }
    const currentFound = foundWordsRef.current;
    const reveal = BoosterLogic.getReveal(puzzleRef.current, currentFound);
    console.warn('REVEAL_DEBUG:', JSON.stringify({
      currentFound,
      returnedReveal: reveal ? reveal.word : null,
      puzzleWords: puzzleRef.current?.words?.map((w) => w.word),
    }));
    if (!reveal) return;

    HapticService.boosterTriggered();
    AudioService.playBooster();
    handleWordFound(reveal);

    consumeBooster('booster_reveal').catch((e) => {
      console.warn('Failed to persist reveal consume:', e);
    });
  }, [revealsCount, handleWordFound, consumeBooster]);

  const handleConfirmBuy = useCallback(async () => {
    if (!buyModal) return;
    if (coins < buyModal.cost) {
      setBuyModal(null);
      router.push('/coin-shop');
      return;
    }

    const type = buyModal.type;
    const cost = buyModal.cost;
    setBuyModal(null);

    HapticService.boosterTriggered();
    AudioService.playBooster();

    // Instant booster effect
    if (type === 'booster_hint') {
      const currentFound = foundWordsRef.current;
      const currentHinted = hintedCellsRef.current;
      const hint = BoosterLogic.getHint(puzzleRef.current, currentFound, currentHinted);
      if (hint) {
        const nextHinted = [...currentHinted, hint.cell];
        hintedCellsRef.current = nextHinted;
        setHintedCells(nextHinted);
      }
    } else if (type === 'booster_shuffle') {
      const prng = new SeededPRNG(Date.now());
      const newGrid = BoosterLogic.shuffleFiller(puzzleRef.current, prng);
      setPuzzle((prev) => {
        const updated = {
          ...prev,
          grid: newGrid,
        };
        puzzleRef.current = updated;
        return updated;
      });
    } else if (type === 'booster_reveal') {
      const currentFound = foundWordsRef.current;
      const reveal = BoosterLogic.getReveal(puzzleRef.current, currentFound);
      if (reveal) {
        handleWordFound(reveal);
      }
    }

    // Persist coin deduction
    spendCoins(cost).catch((e) => {
      console.warn('Failed to deduct coins for booster:', e);
    });
  }, [buyModal, coins, spendCoins, handleWordFound]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    router.push('/pause');
  }, []);

  if (!puzzle) {
    return <LoadingState message="Generating Quest..." />;
  }

  const allTargetWords = puzzle.words.map((w) => w.word);

  return (
    <ScreenContainer scrollable={false} contentContainerStyle={styles.screenContent} backgroundVariant="meadow">
      <View style={styles.arenaContainer}>
        {/* Top Header */}
        <GameplayHeader
          levelTitle={isDaily ? 'Daily Quest' : categoryConfig ? categoryConfig.name : `Level ${levelNum}`}
          categoryName={isDaily && dailyInfo ? dailyInfo.themeTitle : categoryConfig ? 'Category Quest' : levelConfig.theme}
          timeRemaining={timeRemaining}
          coins={coins}
          onPausePress={handlePause}
          onCoinPress={() => router.push('/coin-shop')}
        />

        {/* Word Targets Chips Bar */}
        <WordChipsBar words={allTargetWords} foundWords={foundWords} />

        {/* Floating Bonus Word Toast */}
        {bonusBanner && (
          <View style={styles.bonusToast}>
            <Icon name="coin" size={16} color={colors.gold} />
            <Text style={styles.bonusToastText}>{bonusBanner}</Text>
          </View>
        )}

        {/* 60 FPS Interactive Word Search Grid */}
        <View style={styles.gridWrapper}>
          <GridView
            puzzle={puzzle}
            foundWords={foundWords}
            hintedCells={hintedCells}
            onWordFound={handleWordFound}
            onBonusWordFound={handleBonusWordFound}
          />
        </View>

        {/* Booster Controls Tray */}
        <BoosterControls
          hintsRemaining={hintsCount}
          shufflesRemaining={shufflesCount}
          revealsRemaining={revealsCount}
          onUseHint={handleUseHint}
          onUseShuffle={handleUseShuffle}
          onUseReveal={handleUseReveal}
        />
      </View>

      {/* Quick Booster Purchase Modal */}
      {buyModal && (
        <Modal
          visible={Boolean(buyModal)}
          onClose={() => setBuyModal(null)}
          title={`Get ${buyModal.name}`}
          footer={
            <View style={styles.modalFooter}>
              {coins >= buyModal.cost ? (
                <Button
                  title={`Buy & Use (${buyModal.cost} Coins)`}
                  onPress={handleConfirmBuy}
                  variant="gold"
                  size="md"
                  icon="coin"
                  fullWidth
                />
              ) : (
                <Button
                  title="Get More Coins in Shop"
                  onPress={() => {
                    setBuyModal(null);
                    router.push('/coin-shop');
                  }}
                  variant="primary"
                  size="md"
                  fullWidth
                />
              )}
              <Button
                title="Cancel"
                onPress={() => setBuyModal(null)}
                variant="ghost"
                size="sm"
                fullWidth
              />
            </View>
          }
        >
          <View style={styles.buyModalContent}>
            <View style={styles.buyIconBox}>
              <Icon name={buyModal.icon} size={36} color={colors.primary} />
            </View>
            <Text style={[typography.body, styles.buyDesc]}>{buyModal.desc}</Text>
            <View style={styles.coinCostRow}>
              <Text style={styles.coinCostLabel}>Cost:</Text>
              <Icon name="coin" size={18} color={colors.gold} />
              <Text style={styles.coinCostValue}>{buyModal.cost} Coins</Text>
            </View>
            <Text style={[typography.caption, styles.balanceText]}>
              Your Balance: {coins} Coins
            </Text>
          </View>
        </Modal>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 4,
    paddingVertical: spacing.xs,
  },
  arenaContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    gap: spacing.sm,
    width: '100%',
  },
  buyModalContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  buyIconBox: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buyDesc: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  coinCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  coinCostLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  coinCostValue: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
  },
  balanceText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bonusToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 179, 0, 0.18)',
    borderColor: colors.gold,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    marginVertical: spacing.xs,
  },
  bonusToastText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
