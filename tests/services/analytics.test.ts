import { AnalyticsService } from '@/services/analytics/AnalyticsService';

describe('Analytics & Telemetry Service', () => {
  let analytics: AnalyticsService;

  beforeEach(() => {
    analytics = AnalyticsService.getInstance();
    analytics.clear();
  });

  it('logs events and records breadcrumbs', async () => {
    await analytics.logEvent('level_start', { level: 1, category: 'animals' });
    await analytics.logEvent('level_complete', { level: 1, score: 950, stars: 3 });

    const breadcrumbs = analytics.getBreadcrumbs();
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toContain('Event: level_start');
    expect(breadcrumbs[1]).toContain('Event: level_complete');
  });

  it('sets and retrieves user ID and custom properties', async () => {
    await analytics.setUserId('player_uuid_456');
    await analytics.setUserProperty('tier', 'gold');

    expect(analytics.getUserId()).toBe('player_uuid_456');
    expect(analytics.getUserProperty('tier')).toBe('gold');
  });

  it('records crash errors without throwing uncaught exceptions', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const testError = new Error('Test non-fatal error');
    expect(() => analytics.recordCrash(testError, false)).not.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
