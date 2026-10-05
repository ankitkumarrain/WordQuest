import {
  CloudSyncPayload,
  CloudRewardGrant,
  ICloudSyncService,
} from './types';
import { ENV } from '@/config/env';

/**
 * FirestoreSyncService uses the Firestore REST API to persist player progression
 * and reward grants to the Google Cloud Firestore backend.
 */
export class FirestoreSyncService implements ICloudSyncService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${ENV.firebase.projectId}/databases/(default)/documents`;
  }

  async fetchCloudData(uid: string): Promise<CloudSyncPayload | null> {
    try {
      const url = `${this.baseUrl}/users/${uid}`;
      const response = await fetch(url);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Firestore fetch error: ${response.status}`);
      }

      const doc = await response.json();
      const fields = doc.fields || {};

      const payloadString = fields.syncPayload?.stringValue;
      if (!payloadString) return null;

      return JSON.parse(payloadString) as CloudSyncPayload;
    } catch (error) {
      console.warn('[FirestoreSyncService] Fetch failed:', error);
      return null;
    }
  }

  async uploadCloudData(uid: string, payload: CloudSyncPayload): Promise<void> {
    try {
      const url = `${this.baseUrl}/users/${uid}?updateMask.fieldPaths=syncPayload&updateMask.fieldPaths=updatedAt`;
      const body = {
        fields: {
          syncPayload: { stringValue: JSON.stringify(payload) },
          updatedAt: { integerValue: String(Date.now()) },
        },
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Firestore upload error: ${response.status}`);
      }
    } catch (error) {
      console.warn('[FirestoreSyncService] Upload failed:', error);
      throw error;
    }
  }

  async appendRewardGrant(uid: string, grant: CloudRewardGrant): Promise<boolean> {
    try {
      // In Firestore, creating with document ID enforces idempotency
      const url = `${this.baseUrl}/users/${uid}/grants/${grant.grantId}`;
      const body = {
        fields: {
          grantId: { stringValue: grant.grantId },
          rewardType: { stringValue: grant.rewardType },
          amount: { integerValue: String(grant.amount) },
          source: { stringValue: grant.source },
          grantedAt: { integerValue: String(grant.grantedAt) },
        },
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      return response.ok;
    } catch (error) {
      console.warn('[FirestoreSyncService] Append grant failed:', error);
      return false;
    }
  }
}
