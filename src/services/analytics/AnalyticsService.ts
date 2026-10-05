import { EventName, EventParams, IAnalyticsService } from './types';
import { ENV } from '@/config/env';

export class AnalyticsService implements IAnalyticsService {
  private static instance: AnalyticsService | null = null;
  private userId: string | null = null;
  private userProperties: Map<string, string> = new Map();
  private breadcrumbs: string[] = [];

  static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }

  async logEvent(event: EventName, params: EventParams = {}): Promise<void> {
    const payload = {
      timestamp: Date.now(),
      userId: this.userId,
      ...params,
    };
    void payload;

    if (ENV.isDev) {
      // In dev mode, log structured event trace
      // console.log(`[Telemetry: ${event}]`, payload);
    }

    // In production with @react-native-firebase/analytics:
    // await analytics().logEvent(event, payload);
    this.recordBreadcrumb(`Event: ${event}`);
  }

  async setUserId(userId: string | null): Promise<void> {
    this.userId = userId;
  }

  async setUserProperty(name: string, value: string): Promise<void> {
    this.userProperties.set(name, value);
  }

  recordCrash(error: Error, fatal = false): void {
    console.error(`[Crashlytics ${fatal ? 'FATAL' : 'NON-FATAL'}]`, error.message, error.stack);
    // In production with @react-native-firebase/crashlytics:
    // crashlytics().recordError(error);
  }

  recordBreadcrumb(message: string): void {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }

  getBreadcrumbs(): string[] {
    return [...this.breadcrumbs];
  }

  getUserId(): string | null {
    return this.userId;
  }

  getUserProperty(name: string): string | undefined {
    return this.userProperties.get(name);
  }

  clear(): void {
    this.userId = null;
    this.userProperties.clear();
    this.breadcrumbs = [];
  }
}
