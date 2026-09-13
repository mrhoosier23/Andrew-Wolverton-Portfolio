// One user-gesture-unlocked audio graph for instruments and recordings.
export class Sound {
  constructor() { this.voices = new Set(); this.volume = .65; this.musicVolume = .25; }
  async unlock() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('This browser cannot play the instruments.');
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.music = this.ctx.createGain();
      this.music.gain.value = this.musicVolume;
      // Only synthesized instruments enter the limiter. The recording cannot
      // turn down a piano note by driving a shared compressor.
      const limiter = this.ctx.createDynamicsCompressor();
      limiter.threshold.value = -12; limiter.ratio.value = 8;
      this.master.connect(limiter); limiter.connect(this.ctx.destination);
      this.music.connect(this.ctx.destination);
      this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state !== 'running') await this.ctx.resume();
  }
  setVolume(value) { this.volume = value; if (this.master) this.master.gain.setTargetAtTime(value, this.ctx.currentTime, .015); }
  setMusicVolume(value) { this.musicVolume = value; if (this.music) this.music.gain.setTargetAtTime(value, this.ctx.currentTime, .015); }
  attach(audio) { if (!this.media) { this.media = this.ctx.createMediaElementSource(audio); this.media.connect(this.music); } }
  piano(midi, when = this.ctx.currentTime, duration) {
    const ctx = this.ctx, gain = ctx.createGain(), osc = ctx.createOscillator();
    osc.type = 'triangle'; osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, when); gain.gain.linearRampToValueAtTime(.23, when + .008);
    gain.gain.exponentialRampToValueAtTime(.085, when + .32);
    osc.connect(gain); gain.connect(this.master); osc.start(when);
    let ended = false;
    const release = () => {
      if (ended) return; ended = true;
      const now = ctx.currentTime;
      gain.gain.cancelAndHoldAtTime ? gain.gain.cancelAndHoldAtTime(now) : gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(.0001, now, .035);
      try { osc.stop(now + .2); } catch { /* Already ended. */ }
    };
    const voice = { stop: release };
    this.voices.add(voice);
    osc.onended = () => { this.voices.delete(voice); gain.disconnect(); osc.disconnect(); };
    if (duration != null) {
      gain.gain.setTargetAtTime(.0001, when + duration, .025);
      osc.stop(when + duration + .18);
    } else osc.stop(when + 12);
    return release;
  }
  drum(kind, when = this.ctx.currentTime) {
    const ctx = this.ctx, gain = ctx.createGain(); gain.connect(this.master);
    const pitched = ['Kick', 'Tom', 'Click'].includes(kind);
    const source = pitched ? ctx.createOscillator() : ctx.createBufferSource();
    const length = ({Kick:.22,Tom:.25,Click:.045,Snare:.15,'Hi-hat':.055,Clap:.12,'Open hat':.34,Shaker:.085,Crash:.65})[kind] || .12;
    if (pitched) {
      source.frequency.setValueAtTime(kind === 'Click' ? 950 : kind === 'Tom' ? 210 : 145, when);
      source.frequency.exponentialRampToValueAtTime(kind === 'Click' ? 700 : kind === 'Tom' ? 90 : 45, when + length);
      source.connect(gain);
    } else {
      source.buffer = this.noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = ['Snare','Clap'].includes(kind) ? 1200 : 6500;
      source.connect(filter); filter.connect(gain);
      source.onended = () => filter.disconnect();
    }
    const level = pitched ? (kind === 'Click' ? .10 : .55) : .24;
    gain.gain.setValueAtTime(level, when);
    if (kind === 'Clap') for (let i = 1; i <= 3; i++) {
      gain.gain.setValueAtTime(.05, when + i * .016 - .005); gain.gain.setValueAtTime(level, when + i * .016);
    }
    gain.gain.exponentialRampToValueAtTime(.0001, when + length);
    source.start(when); source.stop(when + length + .02);
    const voice = { stop: () => { try { source.stop(); } catch { /* Already ended. */ } } };
    this.voices.add(voice);
    const cleanup = source.onended;
    source.onended = () => { cleanup?.(); this.voices.delete(voice); source.disconnect(); gain.disconnect(); };
  }
  stop() { for (const voice of [...this.voices]) voice.stop(); }
}
