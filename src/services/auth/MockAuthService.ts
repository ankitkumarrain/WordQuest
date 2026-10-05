import { AuthUser, AuthStateCallback, IAuthService } from './types';

export class MockAuthService implements IAuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Set<AuthStateCallback> = new Set();

  constructor(initialUser?: AuthUser | null) {
    if (initialUser !== undefined) {
      this.currentUser = initialUser;
    }
  }

  async signInGuest(): Promise<AuthUser> {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (this.currentUser && this.currentUser.isAnonymous) {
      return this.currentUser;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const guestUser: AuthUser = {
      uid: `guest_${Date.now()}_${randomSuffix}`,
      isAnonymous: true,
      displayName: `Explorer #${randomSuffix}`,
      email: null,
      photoURL: null,
      providerId: 'anonymous',
    };

    this.currentUser = guestUser;
    this.notifyListeners();
    return guestUser;
  }

  async signInGoogle(): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // If already signed in as guest, link instead of replacing
    if (this.currentUser && this.currentUser.isAnonymous) {
      return this.linkGoogleAccount();
    }

    const googleUser: AuthUser = {
      uid: `google_${Date.now()}_user`,
      isAnonymous: false,
      displayName: 'Word Master',
      email: 'player@gmail.com',
      photoURL: 'https://api.dicebear.com/7.x/bottts/png?seed=wordquest',
      providerId: 'google.com',
    };

    this.currentUser = googleUser;
    this.notifyListeners();
    return googleUser;
  }

  async linkGoogleAccount(): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const existingUid = this.currentUser?.uid || `user_${Date.now()}`;
    const linkedUser: AuthUser = {
      uid: existingUid, // Retain existing player UID to guarantee continuous progression
      isAnonymous: false,
      displayName: this.currentUser?.displayName?.startsWith('Explorer')
        ? 'Word Master (Google)'
        : (this.currentUser?.displayName ?? 'Word Master'),
      email: 'player@gmail.com',
      photoURL: 'https://api.dicebear.com/7.x/bottts/png?seed=wordquest',
      providerId: 'google.com',
    };

    this.currentUser = linkedUser;
    this.notifyListeners();
    return linkedUser;
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 20));
    this.currentUser = null;
    this.notifyListeners();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: AuthStateCallback): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentUser);
      } catch (err) {
        console.error('Error in mock auth state listener:', err);
      }
    }
  }
}
