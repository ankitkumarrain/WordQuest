import { IAuthService } from './types';
import { MockAuthService } from './MockAuthService';
import { FirebaseAuthService } from './FirebaseAuthService';
import { ENV } from '@/config/env';

export class AuthFactory {
  private static instance: IAuthService | null = null;

  static getInstance(): IAuthService {
    if (!this.instance) {
      const isPlaceholder =
        !ENV.firebase.apiKey ||
        ENV.firebase.apiKey.startsWith('AIzaSyFake') ||
        ENV.firebase.projectId === 'wordquest-dev';

      if (isPlaceholder) {
        this.instance = new MockAuthService();
      } else {
        this.instance = new FirebaseAuthService();
      }
    }
    return this.instance;
  }

  /**
   * For unit tests or mocking injection
   */
  static setInstance(mockService: IAuthService | null): void {
    this.instance = mockService;
  }
}
