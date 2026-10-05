# Phase 3 Plan: Gestures & Gameplay Arena

## Goal
Implement the high-performance 60 FPS interactive Word Search Gameplay Arena. Players swipe across memoized letter cells with touch tolerance, see glowing neon vector selection capsules, receive tactile haptic feedback and chord progression, observe word goal completions with animated strikethroughs, and control game sessions (timer, pause, victory, defeat).

## Requirements Covered
- **REQ-GMP-01**: 60 FPS gesture-driven swipe grid with touch tolerance.
- **REQ-GMP-02**: Vector capsule selection overlay (SVG line with rounded caps and neon glow).
- **REQ-GMP-03**: Real-time letter highlighting and word completion detection.
- **REQ-GMP-04**: Sound & audio feedback abstraction.
- **REQ-GMP-05**: Tactile haptic click on crossing each letter coordinate.
- **REQ-GMP-06**: Word goal chips strikethrough animation.
- **REQ-GMP-07**: Arena pause, resume, and restart controls.

## Components to Build (`src/game/`)
1. `src/services/HapticService.ts`: Haptic feedback engine (light click on letter cross, success notification on word found, warning on invalid word).
2. `src/services/AudioService.ts`: Audio feedback abstraction with pitch progression for consecutive word completions.
3. `src/game/GridCell.tsx`: Memoized individual letter cell (`React.memo`), with idle, selected, found, and hinted states.
4. `src/game/SelectionOverlay.tsx`: SVG vector layer rendering glowing neon selection pills over words without triggering grid cell re-renders.
5. `src/game/GridView.tsx`: Master touch-responsive grid container measuring cell dimensions and tracking touch coordinates via PanResponder / Touch events.
6. `src/game/WordChipsBar.tsx`: Interactive horizontal chip list with strike-through animations and theme matching.
7. `src/game/GameplayHeader.tsx`: Level title, pause button, live countdown timer with warning colors, and coin badge.
8. `src/game/BoosterControls.tsx`: Floating booster buttons (Hint, Shuffle, Reveal) with active remaining count badges.
9. Connect everything into `src/app/gameplay.tsx` with dynamic level generation from seed, live countdown timer, and automatic level complete / time up navigation.

## Verification Gates
- 0 TypeScript errors (`npx tsc --noEmit`).
- 0 Lint errors (`npx expo lint`).
- 21/21 Doctor checks (`npx expo-doctor`).
- Unit tests for gameplay coordinate mapping.
