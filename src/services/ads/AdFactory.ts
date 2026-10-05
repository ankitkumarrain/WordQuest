import { IAdService } from './types';
import { MockAdService } from './MockAdService';

export class AdFactory {
  private static instance: IAdService | null = null;

  static getInstance(): IAdService {
    if (!this.instance) {
      if (process.env.NODE_ENV === 'test' || process.env.EXPO_PUBLIC_USE_MOCK_ADS === 'true') {
        this.instance = new MockAdService();
      } else {
        // Dynamic import to avoid loading native dependencies during pure unit tests
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { AdMobManager } = require('./AdMobManager');
        this.instance = new AdMobManager();
      }
    }
    return this.instance!;
  }

  static setInstance(service: IAdService | null): void {
    this.instance = service;
  }
}
