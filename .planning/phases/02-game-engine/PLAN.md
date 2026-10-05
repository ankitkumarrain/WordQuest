# Phase 2 Plan: Pure TypeScript Game Engine Core

## Goal
Build an isolated, zero-dependency, pure TypeScript Word Search Game Engine capable of deterministic puzzle generation via seeded PRNG, 8-directional word placement with character intersection optimization, $O(1)$ vector raycasting for touch drag lines, puzzle validation, and booster algorithms.

## Requirements Covered
- **REQ-ENG-01**: Seedable PRNG (Xoshiro128+ / PCG) for deterministic puzzles.
- **REQ-ENG-02**: 8-Directional word placer (Horizontal LR/RL, Vertical TB/BT, Diagonal TL-BR/BR-TL/BL-TR/TR-BL).
- **REQ-ENG-03**: Character collision & intersection detection.
- **REQ-ENG-04**: Weighted alphabet filler based on standard English letter frequencies.
- **REQ-ENG-05**: Vector raycaster calculating start-to-end swipe line in $O(1)$ without zig-zags.
- **REQ-ENG-06**: Solvability validator & word density analyzer.
- **REQ-ENG-07**: Booster logic (Hint letter locator, Shuffle filler re-arranger, Reveal solver).
- **REQ-ENG-08**: 100% Jest unit test coverage for engine modules.

## Architecture & Submodules
```
src/game-engine/
├── types/
│   └── index.ts              # Core engine types & coordinate models
├── core/
│   ├── SeededPRNG.ts         # Fast, reproducible 32-bit PRNG
│   ├── GridGenerator.ts      # Matrix allocation and lifecycle
│   ├── WordPlacer.ts         # 8-Directional collision & intersection placement
│   └── LetterFiller.ts       # Weighted letter frequency distribution
├── mechanics/
│   ├── Raycaster.ts          # Touch drag vector projection & validation
│   ├── WordDetector.ts       # Forward & reverse path traversal matching
│   └── BoosterLogic.ts       # Hint, Shuffle, Reveal algorithmic helpers
└── validators/
    └── PuzzleValidator.ts    # Puzzle completeness and density verification
```

## Verification Loop
- Pure TypeScript (0 React/DOM dependencies).
- Strict typecheck (`npx tsc --noEmit`).
- Automated unit test suite with Jest testing all 8 directions, seeded reproducibility, collision rejection, booster behaviors, and raycaster projections.
