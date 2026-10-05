import { ICloudSyncService } from './types';
import { MockCloudSyncService } from './MockCloudSyncService';
import { FirestoreSyncService } from './FirestoreSyncService';
import { ENV } from '@/config/env';

export class SyncFactory {
  private static instance: ICloudSyncService | null = null;

  static getInstance(): ICloudSyncService {
    if (!this.instance) {
      const isPlaceholder =
        !ENV.firebase.apiKey ||
        ENV.firebase.apiKey.startsWith('AIzaSyFake') ||
        ENV.firebase.projectId === 'wordquest-dev';

      if (isPlaceholder) {
        this.instance = new MockCloudSyncService();
      } else {
        this.instance = new FirestoreSyncService();
      }
    }
    return this.instance;
  }

  static setInstance(mockService: ICloudSyncService | null): void {
    this.instance = mockService;
  }
}
