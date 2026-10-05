import { SeededPRNG } from '../../src/game-engine/core/SeededPRNG';

describe('SeededPRNG', () => {
  it('produces identical random float sequences for the same seed', () => {
    const prng1 = new SeededPRNG(12345);
    const prng2 = new SeededPRNG(12345);

    for (let i = 0; i < 20; i++) {
      expect(prng1.next()).toEqual(prng2.next());
    }
  });

  it('produces different sequences for different seeds', () => {
    const prng1 = new SeededPRNG(12345);
    const prng2 = new SeededPRNG(99999);

    const seq1 = Array.from({ length: 5 }, () => prng1.next());
    const seq2 = Array.from({ length: 5 }, () => prng2.next());

    expect(seq1).not.toEqual(seq2);
  });

  it('generates integers within specified inclusive range', () => {
    const prng = new SeededPRNG(42);
    for (let i = 0; i < 100; i++) {
      const val = prng.nextInt(3, 8);
      expect(val).toBeGreaterThanOrEqual(3);
      expect(val).toBeLessThanOrEqual(8);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('shuffles arrays deterministically without losing elements', () => {
    const prng1 = new SeededPRNG(777);
    const prng2 = new SeededPRNG(777);

    const items = ['A', 'B', 'C', 'D', 'E', 'F'];
    const shuffled1 = prng1.shuffle(items);
    const shuffled2 = prng2.shuffle(items);

    expect(shuffled1).toEqual(shuffled2);
    expect(shuffled1.sort()).toEqual([...items].sort());
  });
});
