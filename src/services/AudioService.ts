import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const SOUND_ASSETS = {
  tileDrag: require('../../assets/sounds/tile_drag.wav'),
  wordFound: require('../../assets/sounds/word_found.wav'),
  bonusWord: require('../../assets/sounds/bonus_word.wav'),
  wordInvalid: require('../../assets/sounds/word_invalid.wav'),
  boosterHint: require('../../assets/sounds/booster.wav'),
  boosterShuffle: require('../../assets/sounds/booster_shuffle.wav'),
  levelComplete: require('../../assets/sounds/level_complete.wav'),
  levelFailed: require('../../assets/sounds/level_failed.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  coinCollect: require('../../assets/sounds/coin_collect.wav'),
  themeUnlock: require('../../assets/sounds/theme_unlock.wav'),
  bgmAmbient: require('../../assets/sounds/bgm_ambient.wav'),
};

export class AudioService {
  private static soundEnabled = true;
  private static musicEnabled = true;
  private static consecutiveFoundCount = 0;
  private static isAudioInitialized = false;

  private static bgmPlayer: AudioPlayer | null = null;
  private static sfxPlayers: Map<string, AudioPlayer> = new Map();

  private static async ensureAudioMode(): Promise<void> {
    if (this.isAudioInitialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'mixWithOthers',
      });
      this.isAudioInitialized = true;
    } catch {
      // Safe fallback in test / mock
    }
  }

  private static playSound(key: string, source: any, volume = 0.85, rate = 1.0): void {
    if (!this.soundEnabled) return;
    try {
      let player = this.sfxPlayers.get(key);
      if (!player) {
        player = createAudioPlayer(source);
        this.sfxPlayers.set(key, player);
      }
      player.volume = volume;
      player.setPlaybackRate(rate);
      player.shouldCorrectPitch = false;
      if (player.currentTime > 0) {
        player.seekTo(0).catch(() => {});
      }
      player.play();
    } catch (e) {
      console.warn(`[AudioService] SFX error for ${key}:`, e);
    }
  }

  /**
   * Starts ambient background music.
   */
  static async startAmbientMusic(): Promise<void> {
    if (!this.musicEnabled) return;
    try {
      await this.ensureAudioMode();
      if (!this.bgmPlayer) {
        this.bgmPlayer = createAudioPlayer(SOUND_ASSETS.bgmAmbient);
        this.bgmPlayer.loop = true;
        this.bgmPlayer.volume = 0.35;
      }
      this.bgmPlayer.play();
    } catch (e) {
      console.warn('[AudioService] BGM start error:', e);
    }
  }

  /**
   * Stops ambient background music.
   */
  static stopAmbientMusic(): void {
    if (!this.bgmPlayer) return;
    try {
      this.bgmPlayer.pause();
    } catch {
      // ignore
    }
  }

  static setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startAmbientMusic().catch(() => {});
    } else {
      this.stopAmbientMusic();
    }
  }

  static setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  static resetConsecutive(): void {
    this.consecutiveFoundCount = 0;
  }

  /**
   * Plays progressive pitch water-droplet / wood pop on letter tile selection.
   */
  static playTileDrag(charIndex = 1): void {
    if (!this.soundEnabled) return;
    // Scale rate gently with selection length: 1.0, 1.08, 1.16, etc.
    const rate = Math.min(1.0 + Math.max(0, charIndex - 1) * 0.08, 1.6);
    this.playSound('tileDrag', SOUND_ASSETS.tileDrag, 0.65, rate);
  }

  /**
   * Plays word found audio event with escalating pitch for combos.
   */
  static playWordFound(): number {
    this.consecutiveFoundCount++;
    const pitchLevel = Math.min(this.consecutiveFoundCount, 8);
    if (!this.soundEnabled) return pitchLevel;

    const rate = 1.0 + (pitchLevel - 1) * 0.07;
    this.playSound('wordFound', SOUND_ASSETS.wordFound, 0.9, rate);
    return pitchLevel;
  }

  /**
   * Plays reward chime on bonus word found from dictionary.
   */
  static playBonusWord(): void {
    if (!this.soundEnabled) return;
    this.playSound('bonusWord', SOUND_ASSETS.bonusWord, 0.9, 1.0);
  }

  /**
   * Plays muted soft double-thud on invalid or duplicate word attempt.
   */
  static playWordInvalid(): void {
    if (!this.soundEnabled) return;
    this.playSound('wordInvalid', SOUND_ASSETS.wordInvalid, 0.75, 1.0);
  }

  /**
   * Plays booster activation SFX.
   */
  static playBooster(type: 'hint' | 'shuffle' | 'reveal' = 'hint'): void {
    if (!this.soundEnabled) return;
    if (type === 'shuffle') {
      this.playSound('boosterShuffle', SOUND_ASSETS.boosterShuffle, 0.85, 1.0);
    } else {
      this.playSound('boosterHint', SOUND_ASSETS.boosterHint, 0.85, 1.0);
    }
  }

  /**
   * Plays triumphant fanfare on level completion.
   */
  static playLevelComplete(): void {
    this.resetConsecutive();
    if (!this.soundEnabled) return;
    this.playSound('levelComplete', SOUND_ASSETS.levelComplete, 1.0, 1.0);
  }

  /**
   * Plays gentle melancholy chime on level timeout / fail.
   */
  static playLevelFailed(): void {
    this.resetConsecutive();
    if (!this.soundEnabled) return;
    this.playSound('levelFailed', SOUND_ASSETS.levelFailed, 0.85, 1.0);
  }

  /**
   * Plays crisp UI tap click.
   */
  static playTap(): void {
    if (!this.soundEnabled) return;
    this.playSound('tap', SOUND_ASSETS.tap, 0.55, 1.0);
  }

  /**
   * Plays rapid coin counter roll + cash chime.
   */
  static playCoinCollect(): void {
    if (!this.soundEnabled) return;
    this.playSound('coinCollect', SOUND_ASSETS.coinCollect, 0.9, 1.0);
  }

  /**
   * Plays premium magical burst when unlocking a theme.
   */
  static playThemeUnlock(): void {
    if (!this.soundEnabled) return;
    this.playSound('themeUnlock', SOUND_ASSETS.themeUnlock, 0.95, 1.0);
  }
}
