/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 * Guarantees 100% identical outputs for any given seed across Hermes, V8, Node, and Web.
 */

export class SeededPRNG {
  private state: number;

  constructor(seed: number) {
    // Ensure 32-bit integer state
    this.state = seed >>> 0;
  }

  /**
   * Generates a float in [0, 1)
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates an integer in [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    const f = this.next();
    return Math.floor(f * (max - min + 1)) + min;
  }

  /**
   * Selects a random element from an array
   */
  choice<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot select from empty array');
    }
    const idx = this.nextInt(0, items.length - 1);
    return items[idx];
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }
}
