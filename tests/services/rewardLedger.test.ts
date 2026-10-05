import { RewardService } from '../../src/services/RewardService';

describe('RewardService', () => {
  it('generates distinct, non-colliding grant IDs with consistent prefixes', () => {
    const id1 = RewardService.generateGrantId('level_1');
    const id2 = RewardService.generateGrantId('level_1');

    expect(id1).not.toBe(id2);
    expect(id1.startsWith('level_1_')).toBe(true);
    expect(id2.startsWith('level_1_')).toBe(true);
  });

  it('generates 1000 distinct IDs without collision', () => {
    const idSet = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      idSet.add(RewardService.generateGrantId('test'));
    }
    expect(idSet.size).toBe(1000);
  });
});
