import { Raycaster } from '../../src/game-engine/mechanics/Raycaster';

describe('Raycaster', () => {
  it('correctly projects horizontal forward (LR) lines', () => {
    const res = Raycaster.projectLine({ row: 2, col: 1 }, { row: 2, col: 4 });
    expect(res.valid).toBe(true);
    expect(res.direction).toBe('HORIZONTAL_LR');
    expect(res.cells).toEqual([
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
    ]);
  });

  it('correctly projects vertical downward (TB) lines', () => {
    const res = Raycaster.projectLine({ row: 0, col: 3 }, { row: 3, col: 3 });
    expect(res.valid).toBe(true);
    expect(res.direction).toBe('VERTICAL_TB');
    expect(res.cells).toEqual([
      { row: 0, col: 3 },
      { row: 1, col: 3 },
      { row: 2, col: 3 },
      { row: 3, col: 3 },
    ]);
  });

  it('correctly projects diagonal lines', () => {
    const res = Raycaster.projectLine({ row: 1, col: 1 }, { row: 4, col: 4 });
    expect(res.valid).toBe(true);
    expect(res.direction).toBe('DIAGONAL_TL_BR');
    expect(res.cells.length).toBe(4);
  });

  it('rejects non-straight angles', () => {
    // Knight move (dRow: 1, dCol: 2)
    const res = Raycaster.projectLine({ row: 0, col: 0 }, { row: 1, col: 2 });
    expect(res.valid).toBe(false);
    expect(res.cells).toHaveLength(0);
  });

  it('snaps drifting touches to closest canonical direction', () => {
    // Slight drift from horizontal: (0, 0) to (1, 4)
    const snapped = Raycaster.snapToCanonical({ row: 0, col: 0 }, { row: 1, col: 4 });
    // Should snap to horizontal row 0
    expect(snapped.row).toBe(0);
    expect(snapped.col).toBe(4);
  });
});
