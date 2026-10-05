export interface AuthUser {
  uid: string;
  isAnonymous: boolean;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
}

export type AuthStateCallback = (user: AuthUser | null) => void;

export interface IAuthService {
  /**
   * Initializes anonymous guest session (zero barriers to entry).
   */
  signInGuest(): Promise<AuthUser>;

  /**
   * Signs in directly with Google (or links existing guest account if already signed in).
   */
  signInGoogle(): Promise<AuthUser>;

  /**
   * Links an existing anonymous guest account with a Google credential.
   */
  linkGoogleAccount(): Promise<AuthUser>;

  /**
   * Signs out the current user session.
   */
  signOut(): Promise<void>;

  /**
   * Returns current active authenticated user or null.
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Subscribes to authentication state changes.
   */
  onAuthStateChanged(callback: AuthStateCallback): () => void;
}
