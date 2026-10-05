export type EventName =
  | 'level_start'
  | 'level_complete'
  | 'level_fail'
  | 'word_found'
  | 'booster_used'
  | 'ad_rewarded'
  | 'streak_claimed'
  | 'cloud_sync_success'
  | 'cloud_sync_failed';

export type EventParams = Record<string, string | number | boolean | null>;

export interface IAnalyticsService {
  logEvent(event: EventName, params?: EventParams): Promise<void>;
  setUserId(userId: string | null): Promise<void>;
  setUserProperty(name: string, value: string): Promise<void>;
  recordCrash(error: Error, fatal?: boolean): void;
  recordBreadcrumb(message: string): void;
}
