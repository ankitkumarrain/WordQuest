/**
 * SoundSynthesizer generates clean, lightweight PCM WAV data URIs on-the-fly.
 * 100% offline, zero external asset dependencies, zero network requests.
 */

function base64FromArrayBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa fallback for React Native / Hermes
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;
    result += chars[b0 >> 2];
    result += chars[((b0 & 3) << 4) | (b1 >> 4)];
    result += i + 1 < len ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    result += i + 2 < len ? chars[b2 & 63] : '=';
  }
  return result;
}

function createWavDataUri(sampleRate: number, samples: Float32Array): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF Chunk
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt Subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data Subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  const base64 = base64FromArrayBuffer(buffer);
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export class SoundSynthesizer {
  private static sampleRate = 22050;

  /**
   * Generates a crystalline bell chime.
   * Pitch frequencies follow musical scale for consecutive combos.
   */
  static getChimeUri(pitchLevel: number): string {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5]; // C5 to C6
    const baseFreq = notes[Math.min(Math.max(1, pitchLevel) - 1, notes.length - 1)];
    const duration = 0.35; // seconds
    const totalSamples = Math.floor(this.sampleRate * duration);
    const samples = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / this.sampleRate;
      // Exponential decay envelope
      const env = Math.exp(-t * 9);
      // Fundamental + gentle shimmer octave overtone
      const wave = Math.sin(2 * Math.PI * baseFreq * t) * 0.7 + Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.25;
      samples[i] = wave * env;
    }

    return createWavDataUri(this.sampleRate, samples);
  }

  /**
   * Generates triumphant Level Complete fanfare arpeggio (C5 -> E5 -> G5 -> C6).
   */
  static getFanfareUri(): string {
    const duration = 0.8;
    const totalSamples = Math.floor(this.sampleRate * duration);
    const samples = new Float32Array(totalSamples);
    const notes = [
      { freq: 523.25, start: 0.0, dur: 0.12 },
      { freq: 659.25, start: 0.12, dur: 0.12 },
      { freq: 783.99, start: 0.24, dur: 0.15 },
      { freq: 1046.5, start: 0.39, dur: 0.4 },
    ];

    for (const note of notes) {
      const startIdx = Math.floor(note.start * this.sampleRate);
      const noteSamples = Math.floor(note.dur * this.sampleRate);
      for (let i = 0; i < noteSamples; i++) {
        const idx = startIdx + i;
        if (idx < totalSamples) {
          const t = i / this.sampleRate;
          const env = Math.exp(-t * 4);
          samples[idx] += (Math.sin(2 * Math.PI * note.freq * t) * 0.6 + Math.sin(2 * Math.PI * note.freq * 2 * t) * 0.2) * env;
        }
      }
    }

    return createWavDataUri(this.sampleRate, samples);
  }

  /**
   * Generates a magical upward booster whoosh.
   */
  static getBoosterUri(): string {
    const duration = 0.4;
    const totalSamples = Math.floor(this.sampleRate * duration);
    const samples = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / this.sampleRate;
      const progress = t / duration;
      const freq = 350 + progress * 900;
      const env = Math.sin(progress * Math.PI);
      samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.65;
    }

    return createWavDataUri(this.sampleRate, samples);
  }

  /**
   * Generates celebratory two-tone Bonus Word chime.
   */
  static getBonusWordUri(): string {
    const duration = 0.4;
    const totalSamples = Math.floor(this.sampleRate * duration);
    const samples = new Float32Array(totalSamples);

    const notes = [
      { freq: 783.99, start: 0.0, dur: 0.14 },
      { freq: 1174.66, start: 0.14, dur: 0.26 },
    ];

    for (const note of notes) {
      const startIdx = Math.floor(note.start * this.sampleRate);
      const noteSamples = Math.floor(note.dur * this.sampleRate);
      for (let i = 0; i < noteSamples; i++) {
        const idx = startIdx + i;
        if (idx < totalSamples) {
          const t = i / this.sampleRate;
          const env = Math.exp(-t * 8);
          samples[idx] += Math.sin(2 * Math.PI * note.freq * t) * env * 0.65;
        }
      }
    }

    return createWavDataUri(this.sampleRate, samples);
  }

  /**
   * Subtle UI click tap.
   */
  static getTapUri(): string {
    const duration = 0.04;
    const totalSamples = Math.floor(this.sampleRate * duration);
    const samples = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 80);
      samples[i] = Math.sin(2 * Math.PI * 440 * t) * env * 0.4;
    }

    return createWavDataUri(this.sampleRate, samples);
  }
}
