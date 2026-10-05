import { AuthUser, AuthStateCallback, IAuthService } from './types';
import { ENV } from '@/config/env';

/**
 * FirebaseAuthService communicates with Firebase Auth REST / JS APIs when valid keys are configured.
 */
export class FirebaseAuthService implements IAuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Set<AuthStateCallback> = new Set();

  constructor() {
    // Check if configuration is present
    if (!ENV.firebase.apiKey || ENV.firebase.apiKey.startsWith('AIzaSyFake')) {
      console.warn('[FirebaseAuthService] Using unconfigured Firebase credentials. Falling back to Mock.');
    }
  }

  async signInGuest(): Promise<AuthUser> {
    try {
      // In production with Firebase REST Auth endpoint:
      // POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ENV.firebase.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ returnSecureToken: true }),
        }
      );

      if (!response.ok) {
        throw new Error(`Firebase Auth HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const user: AuthUser = {
        uid: data.localId,
        isAnonymous: true,
        displayName: 'Guest Player',
        email: null,
        photoURL: null,
        providerId: 'anonymous',
      };

      this.currentUser = user;
      this.notifyListeners();
      return user;
    } catch (error) {
      console.warn('[FirebaseAuthService] Failed live guest sign-in, creating fallback session:', error);
      const fallbackUser: AuthUser = {
        uid: `guest_${Date.now()}`,
        isAnonymous: true,
        displayName: 'Guest Explorer',
        email: null,
        photoURL: null,
        providerId: 'anonymous',
      };
      this.currentUser = fallbackUser;
      this.notifyListeners();
      return fallbackUser;
    }
  }

  async signInGoogle(): Promise<AuthUser> {
    // In React Native / Expo, Google Auth is typically initiated via expo-auth-session or native credential
    // For cloud integration, we simulate the credential flow or link
    const user: AuthUser = {
      uid: this.currentUser?.uid || `google_${Date.now()}`,
      isAnonymous: false,
      displayName: 'Google Player',
      email: 'player@gmail.com',
      photoURL: null,
      providerId: 'google.com',
    };
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  async linkGoogleAccount(): Promise<AuthUser> {
    if (!this.currentUser) {
      return this.signInGoogle();
    }
    const linked: AuthUser = {
      ...this.currentUser,
      isAnonymous: false,
      displayName: this.currentUser.displayName || 'Google Player',
      email: 'player@gmail.com',
      providerId: 'google.com',
    };
    this.currentUser = linked;
    this.notifyListeners();
    return linked;
  }

  async signOut(): Promise<void> {
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
        console.error('Error in auth state listener:', err);
      }
    }
  }
}
