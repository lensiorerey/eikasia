// Aquatic Ambient Synthesizer Engine (Web Audio API)
// Inspired by DK64 Aquatic Levels & David Wise "Aquatic Ambience" soundscapes

class AquaticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filterNode = null;
    this.oscillators = [];
    this.lfo = null;
    this.bubbleTimer = null;
    this.volume = 0.25;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Lowpass filter for deep underwater damping (DK64 water vibe)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // Dynamic Filter Modulation LFO (Water wave movement)
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // slow wave ripple
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);
    this.lfo.start();

    // Chain Filter -> Master -> Destination
    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Ambient Ethereal Aquatic Chords (D Minor 9 underwater harmony: D3, F3, A3, C4, E4)
    const freqs = [146.83, 174.61, 220.00, 261.63, 329.63];

    this.oscillators = freqs.map((freq, index) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Sine wave with slight detune for lush spatial warmth
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((index - 2) * 4, this.ctx.currentTime);

      // Smooth subtle volume breathing per harmonic
      oscGain.gain.setValueAtTime(0.08 / (index + 1), this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filterNode);
      osc.start();
      return { osc, gain: oscGain };
    });

    // Start random ambient bubble blips
    this.startBubbleGenerator();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.oscillators.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.oscillators = [];
    if (this.bubbleTimer) clearInterval(this.bubbleTimer);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Generate interactive bubble sound effect
  playBubbleSound() {
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Rapidly ascending pitch simulating rising bubble
      const startFreq = 400 + Math.random() * 600;
      const endFreq = startFreq + 500 + Math.random() * 400;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Water Splash Sound FX
  playSplash() {
    this.playBubbleSound();
  }

  // Sonar Ping Sound FX
  playSonar() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

      gain.gain.setValueAtTime(0.1 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      // Audio context safety fallback
    }
  }

  startBubbleGenerator() {
    if (this.bubbleTimer) clearInterval(this.bubbleTimer);
    this.bubbleTimer = setInterval(() => {
      if (this.isPlaying && Math.random() > 0.4) {
        this.playBubbleSound();
      }
    }, 2500);
  }
}

export const aquaticAudio = new AquaticAudioEngine();
