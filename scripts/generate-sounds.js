const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

function writeWavFile(filepath, sampleRate, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${path.basename(filepath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const SAMPLE_RATE = 22050;

// 1. Tile Drag (Water droplet / Marimba pop - 35ms)
{
  const duration = 0.045;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 90);
    // Smooth pitch glide 520Hz -> 680Hz
    const freq = 520 + (t / duration) * 160;
    samples[i] = (Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.15) * env;
  }
  writeWavFile(path.join(soundsDir, 'tile_drag.wav'), SAMPLE_RATE, samples);
}

// 2. Word Found (Crystalline bell chime)
{
  const duration = 0.45;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const f1 = 659.25; // E5
  const f2 = 1318.5; // E6 overtone
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 9);
    samples[i] = (Math.sin(2 * Math.PI * f1 * t) * 0.7 + Math.sin(2 * Math.PI * f2 * t) * 0.25) * env;
  }
  writeWavFile(path.join(soundsDir, 'word_found.wav'), SAMPLE_RATE, samples);
}

// 3. Bonus Word (Sparkle Gem two-tone G5 -> D6)
{
  const duration = 0.5;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const notes = [
    { f: 783.99, start: 0.0, dur: 0.18 },
    { f: 1174.66, start: 0.16, dur: 0.34 },
  ];
  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const nSamples = Math.floor(n.dur * SAMPLE_RATE);
    for (let i = 0; i < nSamples; i++) {
      const idx = startIdx + i;
      if (idx < totalSamples) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 7);
        samples[idx] += (Math.sin(2 * Math.PI * n.f * t) * 0.65 + Math.sin(2 * Math.PI * n.f * 2 * t) * 0.2) * env;
      }
    }
  }
  writeWavFile(path.join(soundsDir, 'bonus_word.wav'), SAMPLE_RATE, samples);
}

// 4. Invalid Word (Soft muted low double-thud)
{
  const duration = 0.28;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const thuds = [0.0, 0.12];
  for (const start of thuds) {
    const startIdx = Math.floor(start * SAMPLE_RATE);
    const durSamples = Math.floor(0.12 * SAMPLE_RATE);
    for (let i = 0; i < durSamples; i++) {
      const idx = startIdx + i;
      if (idx < totalSamples) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 35);
        // Low warm frequency 140Hz
        samples[idx] += (Math.sin(2 * Math.PI * 140 * t) * 0.6) * env;
      }
    }
  }
  writeWavFile(path.join(soundsDir, 'word_invalid.wav'), SAMPLE_RATE, samples);
}

// 5. Booster: Hint (Magic upward sparkle sweep)
{
  const duration = 0.55;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    const freq = 380 + progress * 1200;
    const env = Math.sin(progress * Math.PI);
    const shimmer = Math.sin(2 * Math.PI * 16 * t);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * (0.55 + shimmer * 0.15);
  }
  writeWavFile(path.join(soundsDir, 'booster.wav'), SAMPLE_RATE, samples);
}

// 6. Booster: Shuffle (Wooden tile scramble rattle)
{
  const duration = 0.35;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 12);
    // Multi-tap wood rattle
    const rattle = Math.sin(2 * Math.PI * 320 * t) * 0.4 +
                   Math.sin(2 * Math.PI * 540 * (t * 1.3)) * 0.3 +
                   (Math.random() * 2 - 1) * 0.12;
    samples[i] = rattle * env;
  }
  writeWavFile(path.join(soundsDir, 'booster_shuffle.wav'), SAMPLE_RATE, samples);
}

// 7. Level Complete (Triumphant fanfare arpeggio C5 -> E5 -> G5 -> C6)
{
  const duration = 1.25;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const notes = [
    { f: 523.25, start: 0.0, dur: 0.15 },
    { f: 659.25, start: 0.15, dur: 0.15 },
    { f: 783.99, start: 0.3, dur: 0.18 },
    { f: 1046.5, start: 0.48, dur: 0.77 },
  ];
  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const nSamples = Math.floor(n.dur * SAMPLE_RATE);
    for (let i = 0; i < nSamples; i++) {
      const idx = startIdx + i;
      if (idx < totalSamples) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 3.5);
        samples[idx] += (Math.sin(2 * Math.PI * n.f * t) * 0.6 + Math.sin(2 * Math.PI * n.f * 2 * t) * 0.2) * env;
      }
    }
  }
  writeWavFile(path.join(soundsDir, 'level_complete.wav'), SAMPLE_RATE, samples);
}

// 8. Level Failed (Gentle melancholy descending chime E5 -> C5 -> A4)
{
  const duration = 1.1;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const notes = [
    { f: 659.25, start: 0.0, dur: 0.3 },
    { f: 523.25, start: 0.28, dur: 0.35 },
    { f: 440.0, start: 0.58, dur: 0.52 },
  ];
  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const nSamples = Math.floor(n.dur * SAMPLE_RATE);
    for (let i = 0; i < nSamples; i++) {
      const idx = startIdx + i;
      if (idx < totalSamples) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 4);
        samples[idx] += (Math.sin(2 * Math.PI * n.f * t) * 0.5 + Math.sin(2 * Math.PI * n.f * 0.5 * t) * 0.2) * env;
      }
    }
  }
  writeWavFile(path.join(soundsDir, 'level_failed.wav'), SAMPLE_RATE, samples);
}

// 9. UI Tap (Crisp gentle pop - 30ms)
{
  const duration = 0.035;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 110);
    samples[i] = Math.sin(2 * Math.PI * 450 * t) * env * 0.5;
  }
  writeWavFile(path.join(soundsDir, 'tap.wav'), SAMPLE_RATE, samples);
}

// 10. Coin Collect / Reward (Rapid coin roll + cash ding)
{
  const duration = 0.6;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  // 4 rapid clinks followed by a ringing bell
  const clinks = [0.0, 0.07, 0.14, 0.21];
  for (const start of clinks) {
    const startIdx = Math.floor(start * SAMPLE_RATE);
    const durSamples = Math.floor(0.06 * SAMPLE_RATE);
    for (let i = 0; i < durSamples; i++) {
      const idx = startIdx + i;
      if (idx < totalSamples) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * 80);
        samples[idx] += Math.sin(2 * Math.PI * 1800 * t) * env * 0.4;
      }
    }
  }
  // Bell ding at 0.28s (B5: 987.77 Hz)
  const bellStart = Math.floor(0.28 * SAMPLE_RATE);
  const bellDur = Math.floor(0.32 * SAMPLE_RATE);
  for (let i = 0; i < bellDur; i++) {
    const idx = bellStart + i;
    if (idx < totalSamples) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 8);
      samples[idx] += (Math.sin(2 * Math.PI * 987.77 * t) * 0.6 + Math.sin(2 * Math.PI * 1975.5 * t) * 0.2) * env;
    }
  }
  writeWavFile(path.join(soundsDir, 'coin_collect.wav'), SAMPLE_RATE, samples);
}

// 11. Theme Unlock (Magical purchase shimmer burst)
{
  const duration = 0.85;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    const env = Math.sin(progress * Math.PI);
    const f1 = 587.33 + progress * 600; // D5 ->
    const f2 = 880 + progress * 800;   // A5 ->
    samples[i] = (Math.sin(2 * Math.PI * f1 * t) * 0.4 + Math.sin(2 * Math.PI * f2 * t) * 0.3) * env;
  }
  writeWavFile(path.join(soundsDir, 'theme_unlock.wav'), SAMPLE_RATE, samples);
}

// 12. Ambient Background Music (BGM - Relaxing meditative pad 12s seamless loop)
{
  const duration = 12.0;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  const chord1 = [130.81, 196.0, 246.94, 329.63]; // C, G, B, E (Cmaj7)
  const chord2 = [174.61, 220.0, 261.63, 329.63]; // F, A, C, E (Fmaj7)

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const loopPhase = t / duration;
    const windowEnv = Math.sin(loopPhase * Math.PI);

    let val = 0;
    if (t < 6.0) {
      const chordEnv = Math.sin((t / 6.0) * Math.PI);
      for (const f of chord1) {
        val += Math.sin(2 * Math.PI * f * t) * 0.12 * chordEnv;
        val += Math.sin(2 * Math.PI * (f * 1.003) * t) * 0.08 * chordEnv;
      }
    } else {
      const chordEnv = Math.sin(((t - 6.0) / 6.0) * Math.PI);
      for (const f of chord2) {
        val += Math.sin(2 * Math.PI * f * t) * 0.12 * chordEnv;
        val += Math.sin(2 * Math.PI * (f * 1.003) * t) * 0.08 * chordEnv;
      }
    }

    if (t > 1.5 && t < 3.0) {
      const bt = t - 1.5;
      val += Math.sin(2 * Math.PI * 1046.5 * bt) * Math.exp(-bt * 3) * 0.06;
    }
    if (t > 7.5 && t < 9.0) {
      const bt = t - 7.5;
      val += Math.sin(2 * Math.PI * 880.0 * bt) * Math.exp(-bt * 3) * 0.06;
    }

    samples[i] = val * windowEnv;
  }
  writeWavFile(path.join(soundsDir, 'bgm_ambient.wav'), SAMPLE_RATE, samples);
}

console.log('All 12 premium game audio assets successfully synthesized!');
