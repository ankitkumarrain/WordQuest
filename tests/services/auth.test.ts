import { MockAuthService } from '@/services/auth/MockAuthService';
import { AuthUser } from '@/services/auth/types';

describe('Auth Service (Mock / Adapter)', () => {
  let auth: MockAuthService;

  beforeEach(() => {
    auth = new MockAuthService();
  });

  it('generates an anonymous guest session with guest_ prefix and display name', async () => {
    const user = await auth.signInGuest();

    expect(user.uid).toMatch(/^guest_\d+_[A-Z0-9]+$/);
    expect(user.isAnonymous).toBe(true);
    expect(user.displayName).toMatch(/^Explorer #[A-Z0-9]+$/);
    expect(auth.getCurrentUser()).toEqual(user);
  });

  it('returns the same guest session on repeated signInGuest calls', async () => {
    const first = await auth.signInGuest();
    const second = await auth.signInGuest();

    expect(second.uid).toBe(first.uid);
  });

  it('links an existing guest account to Google preserving the player UID', async () => {
    const guestUser = await auth.signInGuest();
    const guestUid = guestUser.uid;

    const linkedUser = await auth.linkGoogleAccount();

    expect(linkedUser.uid).toBe(guestUid); // Guarantees progression is never lost
    expect(linkedUser.isAnonymous).toBe(false);
    expect(linkedUser.providerId).toBe('google.com');
    expect(linkedUser.email).toBe('player@gmail.com');
  });

  it('signs in directly with Google when not previously a guest', async () => {
    const user = await auth.signInGoogle();

    expect(user.uid).toMatch(/^google_/);
    expect(user.isAnonymous).toBe(false);
    expect(user.email).toBe('player@gmail.com');
  });

  it('notifies subscribers when auth state changes and supports unsubscribe', async () => {
    const callback = jest.fn();
    const unsubscribe = auth.onAuthStateChanged(callback);

    // Initial call on subscription
    expect(callback).toHaveBeenCalledWith(null);

    await auth.signInGuest();
    expect(callback).toHaveBeenCalledTimes(2);

    await auth.signOut();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(auth.getCurrentUser()).toBeNull();

    unsubscribe();
    await auth.signInGuest();
    expect(callback).toHaveBeenCalledTimes(3); // Not called after unsubscribe
  });
});
