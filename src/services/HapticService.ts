import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticService {
  private static enabled = true;

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subtle tactile feedback fired when the finger crosses into a new letter cell.
   */
  static letterCross(): void {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore unsupported platforms
    }
  }

  /**
   * Rewarding vibration when a valid word is completed.
   */
  static wordFound(): void {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  }

  /**
   * Warning vibration when word is already found or invalid selection ends.
   */
  static wordInvalid(): void {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Ignore
    }
  }

  /**
   * Feedback when a booster is triggered.
   */
  static boosterTriggered(): void {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
  }

  /**
   * Victory haptic sequence when entire level is completed.
   */
  static levelComplete(): void {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  }
}
