(() => {
  "use strict";

  const pageConfig = {
    manifestUrl: document.body.dataset.manifestUrl || "audio/manifest.json",
    assetBaseUrl: document.body.dataset.assetBaseUrl || "./",
    characterRoot: document.body.dataset.characterRoot || "assets/characters/",
    returnHref: document.body.dataset.returnHref || "index.html"
  };

  const DEFAULT_PACKS = [
    { id: "02-110-A", title: "Medium Drive", key: "A", bpm: 110, timeSignature: "4/4", sections: ["intro", "intro-fill", "verse-1", "verse-2", "chorus", "outro"], tracks: {} },
    { id: "05-099-Bb", title: "Slow Pocket", key: "Bb", bpm: 99, timeSignature: "4/4", sections: ["intro", "intro-fill", "verse-1", "verse-2", "chorus", "bridge", "outro"], tracks: {} },
    { id: "14-115-E", title: "Bright Run", key: "E", bpm: 115, timeSignature: "4/4", sections: ["intro", "verse-1", "verse-2", "verse-3", "chorus-1", "bridge", "outro"], tracks: {} }
  ];

  const CHANNELS = [
    { id: "guitar", label: "Guitar", value: 0.72 },
    { id: "banjo", label: "Banjo", value: 0.58 },
    { id: "bass", label: "Bass", value: 0.72 },
    { id: "fiddle", label: "Fiddles", value: 0.58 },
    { id: "mandolin", label: "Mando", value: 0.54 },
    { id: "djembe", label: "Djembe", value: 0.48 },
    { id: "shaker", label: "Shaker", value: 0.36 },
    { id: "master", label: "Master", value: 0.84 }
  ];

  const KNOBS = [
    { id: "room", label: "Room", value: 0.22 },
    { id: "echo", label: "Echo", value: 0.08 },
    { id: "tone", label: "Tone", value: 0.72 },
    { id: "lowcut", label: "Low Cut", value: 0.08 },
    { id: "piano", label: "Keys Level", value: 0.88 },
    { id: "click", label: "Click", value: 0.28 },
    { id: "drive", label: "Drive", value: 0.08 },
    { id: "glow", label: "Pad Glow", value: 0.72 }
  ];

  const PAD_COLORS = ["#28dce0", "#ffc8f7", "#b9d4ff", "#a8eeea", "#91e5ba", "#d7c2ff", "#f2c27d", "#ff9e65"];
  const PIANO_KEY_MAP = new Map([
    ["q", 60], ["2", 61], ["w", 62], ["3", 63], ["e", 64], ["r", 65],
    ["5", 66], ["t", 67], ["6", 68], ["y", 69], ["7", 70], ["u", 71],
    ["i", 72], ["9", 73], ["o", 74], ["0", 75], ["p", 76], ["[", 77]
  ]);
  const PAD_HOTKEYS = ["z", "x", "c", "v", "b", "n", "m", ","];
  const CHALLENGE_DIFFICULTY = {
    "05-099-Bb": { label: "Beginner", bpm: 84, notes: [60,62,64,67,64,62,60,62,64,67,69,67,64,62] },
    "02-110-A": { label: "Intermediate", bpm: 110, notes: [60,64,67,69,71,69,67,66,67,69,71,72,71,69,67,64] },
    "14-115-E": { label: "Advanced", bpm: 132, notes: [60,64,67,71,72,74,76,77,76,75,74,73,72,69,71,72,74,76,77,74] }
  };
  const FREE_PAD_SOUNDS = ["kick", "snare", "hat", "openhat", "clap", "tom", "shaker", "crash"];
  const FREE_PAD_LABELS = [
    ["Kick", "Low"], ["Snare", "Snap"], ["Hat", "Closed"], ["Hat", "Open"],
    ["Clap", "Wide"], ["Tom", "Low"], ["Shaker", "Bright"], ["Crash", "Air"]
  ];

  const CHARACTER_ASSETS = {
    andrew: {
      idle: "flannel-idle.webp",
      listening: "flannel-listening.webp",
      count: "flannel-count.webp",
      celebrate: "flannel-celebrate.webp"
    },
    doon: {
      idle: "doon-idle.gif",
      bounce: "doon-bounce.gif",
      jump: "doon-jump.gif"
    }
  };

  const MODE_COPY = {
    build: {
      title: "Song sections",
      hint: "Queue at the next section boundary",
      message: "Choose a section and build the band.",
      submessage: "The next section begins when the current phrase ends."
    },
    free: {
      title: "Performance pads",
      hint: "No backing track in this mode",
      message: "The keyboard and percussion pads are live.",
      submessage: "Use Keys Level to set the piano volume."
    },
    lick: {
      title: "Challenge controls",
      hint: "Follow the falling notes",
      message: "Ready for a short phrase?",
      submessage: "Use Start Challenge, then follow the pulse."
    }
  };

  const TUTORIALS = {
    build: [
      { selector: ".mode-tabs", title: "Build a Band", copy: "This mode combines recorded stems into a short arrangement. Start by staying on Build.", key: "Build mode" },
      { selector: "#packSelect", title: "Choose a musical pack", copy: "Each pack changes the key, tempo, sections, and available instruments.", key: "Pack selector" },
      { selector: ".pad-bank", title: "Launch a section", copy: "Press a section while stopped to begin. Press another while playing to queue it at the next boundary.", key: "Section pads or keys Z–," },
      { selector: ".mixer-bank", title: "Shape the band", copy: "Use levels, Mute, and Solo to decide which instruments are present. Keys Level keeps the live piano audible.", key: "Mixer + sound shaping" },
      { selector: ".studio-quick-panel", title: "Capture the arrangement", copy: "Shift + R remembers section choices and mixer changes. Replay it with Shift + P. Escape stops everything.", key: "Shift + R, Shift + P, Esc" }
    ],
    free: [
      { selector: ".mode-tabs", title: "Free Play", copy: "Free Play never starts backing stems. The selected pack only changes the highlighted scale.", key: "Free Play mode" },
      { selector: "#packSelect", title: "Choose a scale", copy: "Pick A, B-flat, or E. Highlighted keys show notes that fit the selected pack.", key: "Pack selector" },
      { selector: ".piano-section", title: "Play one permanent map", copy: "White notes run across Q through left bracket. The number keys directly above them play the accidentals. You never need to shift ranges.", key: "Q–[ piano · 2 3 5 6 7 9 0 sharps" },
      { selector: ".pad-bank", title: "Add percussion", copy: "Z, X, C, V, B, N, M, and comma trigger the eight live percussion pads.", key: "Z–, pads" },
      { selector: "#freeLoopSettings", title: "Make a beat loop", copy: "Choose a bar length, set the BPM, record a pass, then play, overdub, undo, or clear the loop.", key: "A record · S play · D overdub · F undo · G clear · H click" },
      { selector: ".tone-bank", title: "Adjust the sound", copy: "Keys Level changes piano volume. Room, Echo, Tone, and Drive shape the live instrument.", key: "Sound shaping controls" }
    ],
    lick: [
      { selector: ".mode-tabs", title: "Play the Lick", copy: "This mode teaches one short phrase using a count-in, falling notes, and timing feedback.", key: "Play the Lick mode" },
      { selector: "#packSelect", title: "Choose a difficulty", copy: "Slow Pocket is beginner, Medium Drive is intermediate, and Bright Run is advanced. The harder phrases use more of the same permanent keyboard map.", key: "Beginner · Intermediate · Advanced" },
      { selector: "#transportRow", title: "Prepare the challenge", copy: "Hear Guide lets you listen first. Slower, Faster, and Practice adjust the attempt without changing the key map.", key: "Guide + tempo + practice" },
      { selector: ".performance-strip", title: "Follow the falling notes", copy: "Each note now falls directly above its matching piano key. Play when the note reaches the aqua timing line.", key: "Note highway" },
      { selector: ".piano-section", title: "Play the matching key", copy: "Use the labeled computer key or press the piano key directly. The score rewards accurate timing.", key: "Keyboard or touch" },
      { selector: "#transportRow", title: "Stop or restart cleanly", copy: "Restart begins another attempt. Stop All or Escape cancels notes, timers, count-ins, and audio immediately.", key: "Restart, Stop All, Esc" }
    ]
  };

  let tutorialStepIndex = 0;
  let tutorialMode = "build";

  const state = {
    mode: "build",
    packs: DEFAULT_PACKS,
    pack: DEFAULT_PACKS[0],
    audio: null,
    audioReady: false,
    audioError: "",
    demoMode: true,
    mobilePianoCompact: null,
    isPlaying: false,
    paused: false,
    currentSection: null,
    queuedSection: null,
    currentStart: 0,
    currentEnd: 0,
    currentDuration: 0,
    boundaryTimer: null,
    sectionCache: new Map(),
    sources: [],
    channelValues: new Map(CHANNELS.map(channel => [channel.id, channel.value])),
    channelMuted: new Set(),
    channelSolo: new Set(),
    knobValues: new Map(KNOBS.map(knob => [knob.id, knob.value])),
    soundOctave: 0,
    sustain: false,
    activeNotes: new Map(),
    sustainedNotes: new Set(),
    activeComputerKeys: new Map(),
    loopCurrent: false,
    captureActive: false,
    captureStartedAt: 0,
    arrangement: [],
    replaying: false,
    replayTimers: [],
    replayLastEventAt: 0,
    metronomeOn: false,
    metronomeTimer: null,
    metronomeNextTime: 0,
    metronomeBeat: 0,
    freeLoop: {
      bpm: 110, bars: 1, recording: false, overdubbing: false, playing: false,
      layers: [], currentLayer: [], pendingNotes: new Map(), loopStartAt: 0,
      cycleTimer: null, recordTimer: null, raf: null
    },
    challenge: null,
    guideTimers: [],
    characterState: { andrew: null, doon: null }
  };

  const dom = {};

  function pianoGainFromControl(value) {
    return value * 1.45;
  }

  function withTrailingSlash(value) {
    return value.endsWith("/") ? value : `${value}/`;
  }

  function resolveProjectAsset(path) {
    return new URL(path, new URL(pageConfig.assetBaseUrl, window.location.href)).href;
  }

  function resolveCharacterAsset(filename) {
    return new URL(filename, new URL(withTrailingSlash(pageConfig.characterRoot), window.location.href)).href;
  }

  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.musicBus = null;
      this.pianoBus = null;
      this.percussionBus = null;
      this.clickBus = null;
      this.lowcutFilter = null;
      this.toneFilter = null;
      this.drive = null;
      this.reverbGain = null;
      this.delay = null;
      this.delayFeedback = null;
      this.delayGain = null;
      this.limiter = null;
      this.channelGains = new Map();
      this.nodes = new Set();
      this.pitchBend = 0;
      this.modulation = 0;
      this.unlocked = false;
    }

    async ensure() {
      try {
        if (!this.ctx) this.setup();
        if (!state.paused && this.ctx.state !== "running") {
          await this.ctx.resume();
        }
        if (!state.paused && this.ctx.state !== "running") {
          state.audioReady = false;
          state.audioError = "Tap Enable sound to let Safari start the audio engine.";
          updateAudioStatus();
          showSoundGate(state.audioError);
          return false;
        }
        if (!this.unlocked) this.primeOutput();
        state.audioReady = this.ctx.state === "running";
        state.audioError = "";
        updateAudioStatus();
        return state.audioReady;
      } catch (error) {
        state.audioReady = false;
        state.audioError = error?.message || "Studio sound could not start.";
        updateAudioStatus();
        showSoundGate(state.audioError);
        return false;
      }
    }

    primeOutput() {
      if (!this.ctx || this.unlocked) return;
      const buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      gain.gain.value = 0.00001;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(0);
      this.unlocked = true;
    }

    setup() {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error("Web Audio API is not supported in this browser.");

      this.ctx = new Context();
      this.ctx.addEventListener?.("statechange", () => {
        const running = this.ctx?.state === "running";
        state.audioReady = running;
        if (!running && !document.hidden) {
          state.audioError = "Studio sound was paused by the browser. Tap to restore it.";
          showSoundGate(state.audioError);
        }
        updateAudioStatus();
      });
      this.master = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();
      this.pianoBus = this.ctx.createGain();
      this.percussionBus = this.ctx.createGain();
      this.clickBus = this.ctx.createGain();
      this.lowcutFilter = this.ctx.createBiquadFilter();
      this.toneFilter = this.ctx.createBiquadFilter();
      this.drive = this.ctx.createWaveShaper();
      this.reverbGain = this.ctx.createGain();
      this.delay = this.ctx.createDelay(1.5);
      this.delayFeedback = this.ctx.createGain();
      this.delayGain = this.ctx.createGain();
      this.limiter = this.ctx.createDynamicsCompressor();

      this.master.gain.value = state.channelValues.get("master");
      this.pianoBus.gain.value = pianoGainFromControl(state.knobValues.get("piano"));
      this.clickBus.gain.value = state.knobValues.get("click") * 0.6;

      this.lowcutFilter.type = "highpass";
      this.lowcutFilter.frequency.value = 30;
      this.toneFilter.type = "lowpass";
      this.toneFilter.frequency.value = 9000;
      this.toneFilter.Q.value = 0.35;
      this.delay.delayTime.value = 0.23;
      this.delayFeedback.gain.value = 0.24;
      this.delayGain.gain.value = state.knobValues.get("echo") * 0.38;
      this.reverbGain.gain.value = state.knobValues.get("room") * 0.45;

      this.limiter.threshold.value = -5;
      this.limiter.knee.value = 3;
      this.limiter.ratio.value = 12;
      this.limiter.attack.value = 0.003;
      this.limiter.release.value = 0.18;
      this.setDrive(state.knobValues.get("drive"));

      const convolver = this.ctx.createConvolver();
      convolver.buffer = this.makeImpulse(1.8, 2.2);

      this.musicBus.connect(this.lowcutFilter);
      this.pianoBus.connect(this.lowcutFilter);
      this.percussionBus.connect(this.lowcutFilter);
      this.lowcutFilter.connect(this.toneFilter);
      this.toneFilter.connect(this.drive);
      this.drive.connect(this.master);
      this.drive.connect(convolver);
      convolver.connect(this.reverbGain);
      this.reverbGain.connect(this.master);
      this.drive.connect(this.delay);
      this.delay.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delay);
      this.delay.connect(this.delayGain);
      this.delayGain.connect(this.master);
      this.clickBus.connect(this.master);
      this.master.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);

      CHANNELS.filter(channel => channel.id !== "master").forEach(channel => {
        const gain = this.ctx.createGain();
        gain.gain.value = channel.value;
        gain.connect(this.musicBus);
        this.channelGains.set(channel.id, gain);
      });
    }

    makeImpulse(seconds, decay) {
      const length = Math.floor(this.ctx.sampleRate * seconds);
      const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
      for (let channel = 0; channel < 2; channel += 1) {
        const data = impulse.getChannelData(channel);
        for (let index = 0; index < length; index += 1) {
          data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / length, decay);
        }
      }
      return impulse;
    }

    trackNode(node) {
      if (!node || typeof node.stop !== "function") return node;
      this.nodes.add(node);
      node.addEventListener?.("ended", () => this.nodes.delete(node), { once: true });
      return node;
    }

    stopAllNodes(at = this.ctx?.currentTime || 0) {
      this.nodes.forEach(node => {
        try { node.stop(at); } catch (error) { /* already stopped */ }
      });
      this.nodes.clear();
    }

    setDrive(value) {
      if (!this.drive) return;
      const amount = value * 75;
      const samples = 22050;
      const curve = new Float32Array(samples);
      const degree = Math.PI / 180;
      for (let index = 0; index < samples; index += 1) {
        const x = index * 2 / samples - 1;
        curve[index] = ((3 + amount) * x * 20 * degree) / (Math.PI + amount * Math.abs(x));
      }
      this.drive.curve = curve;
      this.drive.oversample = "2x";
    }

    updateChannel(id) {
      if (!this.ctx) return;
      if (id === "master") {
        this.master.gain.setTargetAtTime(state.channelValues.get(id), this.ctx.currentTime, 0.025);
        return;
      }
      const soloActive = state.channelSolo.size > 0;
      const muted = state.channelMuted.has(id) || (soloActive && !state.channelSolo.has(id));
      const value = muted ? 0 : state.channelValues.get(id);
      this.channelGains.get(id)?.gain.setTargetAtTime(value, this.ctx.currentTime, 0.025);
    }

    updateAllChannels() {
      CHANNELS.forEach(channel => this.updateChannel(channel.id));
    }

    updateKnob(id, value) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (id === "room") this.reverbGain.gain.setTargetAtTime(value * 0.45, now, 0.03);
      if (id === "echo") this.delayGain.gain.setTargetAtTime(value * 0.38, now, 0.03);
      if (id === "tone") this.toneFilter.frequency.setTargetAtTime(1300 + value * 15500, now, 0.03);
      if (id === "lowcut") this.lowcutFilter.frequency.setTargetAtTime(25 + value * 725, now, 0.03);
      if (id === "piano") this.pianoBus.gain.setTargetAtTime(pianoGainFromControl(value), now, 0.03);
      if (id === "click") this.clickBus.gain.setTargetAtTime(value * 0.6, now, 0.03);
      if (id === "drive") this.setDrive(value);
    }

    async decode(url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${url}`);
      return this.ctx.decodeAudioData(await response.arrayBuffer());
    }

    playBuffer(buffer, destination, startAt) {
      const source = this.trackNode(this.ctx.createBufferSource());
      source.buffer = buffer;
      source.connect(destination);
      source.start(startAt);
      return source;
    }

    midiToFrequency(midi) {
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    noteOn(midi, velocity = 0.72) {
      if (!this.ctx) return null;
      const now = this.ctx.currentTime;
      const frequency = this.midiToFrequency(midi + this.pitchBend);
      const output = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const oscA = this.trackNode(this.ctx.createOscillator());
      const oscB = this.trackNode(this.ctx.createOscillator());
      const body = this.trackNode(this.ctx.createOscillator());
      const oscAGain = this.ctx.createGain();
      const oscBGain = this.ctx.createGain();
      const bodyGain = this.ctx.createGain();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4800 + velocity * 4200, now);
      filter.Q.value = 0.5;
      oscA.type = "triangle";
      oscB.type = "sine";
      body.type = "sine";
      oscA.frequency.value = frequency;
      oscB.frequency.value = frequency * 2.002;
      body.frequency.value = frequency * 0.5;
      oscB.detune.value = 4 + this.modulation * 11;
      oscAGain.gain.value = 0.48;
      oscBGain.gain.value = 0.16;
      bodyGain.gain.value = 0.12;

      oscA.connect(oscAGain);
      oscB.connect(oscBGain);
      body.connect(bodyGain);
      oscAGain.connect(filter);
      oscBGain.connect(filter);
      bodyGain.connect(filter);
      filter.connect(output);
      output.connect(this.pianoBus);

      output.gain.setValueAtTime(0.0001, now);
      output.gain.exponentialRampToValueAtTime(Math.max(0.001, velocity * 0.42), now + 0.012);
      output.gain.exponentialRampToValueAtTime(Math.max(0.001, velocity * 0.18), now + 0.19);
      oscA.start(now);
      oscB.start(now);
      body.start(now);

      return { output, oscillators: [oscA, oscB, body], midi };
    }

    noteOnAt(midi, velocity = 0.72, startAt = null, duration = 0.22) {
      if (!this.ctx) return null;
      const at = startAt ?? this.ctx.currentTime;
      const frequency = this.midiToFrequency(midi + this.pitchBend);
      const output = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const oscA = this.trackNode(this.ctx.createOscillator());
      const oscB = this.trackNode(this.ctx.createOscillator());
      const body = this.trackNode(this.ctx.createOscillator());
      const oscAGain = this.ctx.createGain();
      const oscBGain = this.ctx.createGain();
      const bodyGain = this.ctx.createGain();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4800 + velocity * 4200, at);
      filter.Q.value = 0.5;
      oscA.type = "triangle"; oscB.type = "sine"; body.type = "sine";
      oscA.frequency.value = frequency; oscB.frequency.value = frequency * 2.002; body.frequency.value = frequency * 0.5;
      oscB.detune.value = 4 + this.modulation * 11;
      oscAGain.gain.value = 0.48; oscBGain.gain.value = 0.16; bodyGain.gain.value = 0.12;
      oscA.connect(oscAGain); oscB.connect(oscBGain); body.connect(bodyGain);
      oscAGain.connect(filter); oscBGain.connect(filter); bodyGain.connect(filter); filter.connect(output); output.connect(this.pianoBus);
      output.gain.setValueAtTime(0.0001, at);
      output.gain.exponentialRampToValueAtTime(Math.max(0.001, velocity * 0.42), at + 0.012);
      output.gain.exponentialRampToValueAtTime(Math.max(0.001, velocity * 0.18), at + 0.19);
      output.gain.setTargetAtTime(0.0001, at + Math.max(0.08, duration), 0.08);
      oscA.start(at); oscB.start(at); body.start(at);
      const stopAt = at + Math.max(0.25, duration) + 0.75;
      oscA.stop(stopAt); oscB.stop(stopAt); body.stop(stopAt);
      return { output, oscillators: [oscA, oscB, body], midi };
    }

    noteOff(voice, immediate = false) {
      if (!voice || !this.ctx) return;
      const now = this.ctx.currentTime;
      voice.output.gain.cancelScheduledValues(now);
      const release = immediate ? 0.025 : state.sustain ? 0.85 : 0.11;
      voice.output.gain.setTargetAtTime(0.0001, now, release);
      const stopAt = now + (immediate ? 0.12 : state.sustain ? 3.2 : 0.7);
      voice.oscillators.forEach(oscillator => {
        try { oscillator.stop(stopAt); } catch (error) { /* already stopped */ }
      });
    }

    click(time, accent = false) {
      if (!this.ctx) return;
      const oscillator = this.trackNode(this.ctx.createOscillator());
      const gain = this.ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = accent ? 1300 : 870;
      gain.gain.setValueAtTime(accent ? 0.23 : 0.13, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
      oscillator.connect(gain);
      gain.connect(this.clickBus);
      oscillator.start(time);
      oscillator.stop(time + 0.055);
    }

    percussion(type, velocity = 0.8, time = null) {
      if (!this.ctx) return;
      const at = time ?? this.ctx.currentTime;
      if (type === "kick") {
        const oscillator = this.trackNode(this.ctx.createOscillator());
        const gain = this.ctx.createGain();
        oscillator.frequency.setValueAtTime(150, at);
        oscillator.frequency.exponentialRampToValueAtTime(44, at + 0.18);
        gain.gain.setValueAtTime(velocity * 0.8, at);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.35);
        oscillator.connect(gain);
        gain.connect(this.percussionBus);
        oscillator.start(at);
        oscillator.stop(at + 0.38);
        return;
      }

      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.7, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      const source = this.trackNode(this.ctx.createBufferSource());
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const settings = {
        snare: ["bandpass", 1800, 0.18], hat: ["highpass", 7200, 0.07],
        openhat: ["highpass", 6300, 0.42], clap: ["bandpass", 1300, 0.22],
        tom: ["lowpass", 700, 0.3], shaker: ["highpass", 5200, 0.12],
        crash: ["highpass", 3600, 0.65]
      }[type] || ["bandpass", 1600, 0.18];

      source.buffer = buffer;
      filter.type = settings[0];
      filter.frequency.value = settings[1];
      gain.gain.setValueAtTime(velocity * 0.35, at);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + settings[2]);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.percussionBus);
      source.start(at);
      source.stop(at + settings[2] + 0.03);
    }
  }

  async function boot() {
    cacheDom();
    state.audio = new AudioEngine();
    dom.returnToDesk.href = pageConfig.returnHref;
    await loadManifest();
    buildPackSelect();
    buildFaders();
    buildKnobs();
    buildPiano();
    bindControls();
    setupMobileExperience();
    setPack(state.packs[0].id, false);
    await setMode(isCompactMobileStudio() ? "free" : "build", false);
    setupFallbacks();
    setCharacterState("idle", "idle");
    updateAllUI();
    animateProgress();
  }

  function cacheDom() {
    [
      "returnToDesk", "audioStatus", "modeStatus", "displayMode", "displayTempo", "displayCurrent",
      "displayPack", "displayNext", "displayMeterFill", "packSelect", "faderGrid", "knobGrid",
      "padGrid", "padBankTitle", "padBankHint", "transportRow", "octaveUp", "octaveDown",
      "octaveReadout", "sustainButton", "freeLoopSettings", "freeLoopBpm", "freeLoopStatus", "freeLoopPlayhead",
      "pianoKeyboard", "controller", "hostMessage", "hostSubmessage", "hostCharacter",
      "doonCharacter", "hostFallback", "doonFallback", "arrangementLog", "sessionExplainer",
      "noteHighway", "lickScore", "lickJudgment", "lickCombo", "pitchWheel", "modWheel",
      "studioTutorialButton", "modeTutorialButton", "studioTutorial", "tutorialClose", "tutorialTitle", "tutorialProgress",
      "tutorialStepNumber", "tutorialStepTitle", "tutorialStepCopy", "tutorialKey", "tutorialPrevious",
      "tutorialNext", "mobileStopAll", "tutorialSpotlight", "studioSoundGate", "enableStudioSound",
      "studioSoundGateStatus", "mobileStudioNav", "mobileAudioStatus", "mobileSessionToggle",
      "mobileSessionClose", "mobileSessionScrim", "mobileHelp", "mobileCoachKicker",
      "mobileCoachTitle", "mobileCoachCopy"
    ].forEach(id => { dom[id] = document.getElementById(id); });
  }

  async function loadManifest() {
    try {
      const response = await fetch(pageConfig.manifestUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Manifest not found");
      const manifest = await response.json();
      if (Array.isArray(manifest.packs) && manifest.packs.length) state.packs = manifest.packs;
    } catch (error) {
      console.warn("Using fallback pack definitions:", error.message);
      state.packs = DEFAULT_PACKS;
    }
  }

  function buildPackSelect() {
    dom.packSelect.innerHTML = "";
    state.packs.forEach(pack => {
      const option = document.createElement("option");
      option.value = pack.id;
      option.textContent = `${pack.bpm} BPM · ${pack.key} · ${pack.title}`;
      dom.packSelect.append(option);
    });
  }

  function buildFaders() {
    const template = document.getElementById("faderTemplate");
    dom.faderGrid.innerHTML = "";
    CHANNELS.forEach(channel => {
      const fragment = template.content.cloneNode(true);
      const root = fragment.querySelector(".fader-channel");
      const fader = fragment.querySelector(".channel-fader");
      const mute = fragment.querySelector(".mute-button");
      const solo = fragment.querySelector(".solo-button");
      const label = fragment.querySelector(".channel-label");
      const value = fragment.querySelector(".channel-value");

      root.dataset.channel = channel.id;
      fader.value = channel.value;
      fader.setAttribute("aria-label", `${channel.label} level`);
      label.textContent = channel.label;
      value.textContent = Math.round(channel.value * 100);
      if (channel.id === "master") {
        mute.hidden = true;
        solo.hidden = true;
      }

      fader.addEventListener("input", async event => {
        if (!(await state.audio.ensure())) return;
        setChannelLevel(channel.id, Number(event.target.value), true);
      });

      mute.addEventListener("click", async () => {
        if (!(await state.audio.ensure())) return;
        toggleChannelMute(channel.id, true);
      });

      solo.addEventListener("click", async () => {
        if (!(await state.audio.ensure())) return;
        toggleChannelSolo(channel.id, true);
      });

      dom.faderGrid.append(fragment);
    });
  }

  function buildKnobs() {
    const template = document.getElementById("knobTemplate");
    dom.knobGrid.innerHTML = "";
    KNOBS.forEach(knob => {
      const fragment = template.content.cloneNode(true);
      const root = fragment.querySelector(".knob-control");
      const input = fragment.querySelector(".knob-input");
      const cap = fragment.querySelector(".knob-cap");
      const label = fragment.querySelector(".knob-label");
      const value = fragment.querySelector(".knob-value");

      root.dataset.knob = knob.id;
      input.value = knob.value;
      input.setAttribute("aria-label", knob.label);
      label.textContent = knob.label;
      value.textContent = Math.round(knob.value * 100);
      setKnobVisual(cap, knob.value);

      input.addEventListener("input", async event => {
        const amount = Number(event.target.value);
        state.knobValues.set(knob.id, amount);
        value.textContent = Math.round(amount * 100);
        setKnobVisual(cap, amount);
        if (knob.id === "glow") {
          document.documentElement.style.setProperty("--pad-glow", amount.toFixed(2));
        } else {
          if (!(await state.audio.ensure())) return;
          state.audio.updateKnob(knob.id, amount);
        }
        recordEvent("knob", { id: knob.id, value: amount });
      });

      dom.knobGrid.append(fragment);
    });
  }

  function setKnobVisual(cap, value) {
    cap.style.setProperty("--angle", `${-135 + value * 270}deg`);
  }

  function isCompactMobileStudio() {
    return window.matchMedia("(max-width: 1100px)").matches;
  }

  function buildPiano() {
    dom.pianoKeyboard.innerHTML = "";
    const compact = isCompactMobileStudio();
    const startMidi = compact ? 60 : 48;
    const endMidi = 77;
    state.mobilePianoCompact = compact;
    const whiteMidis = [];
    for (let midi = startMidi; midi <= endMidi; midi += 1) {
      if (![1, 3, 6, 8, 10].includes(midi % 12)) whiteMidis.push(midi);
    }

    const whiteIndexByMidi = new Map();
    whiteMidis.forEach((midi, index) => {
      whiteIndexByMidi.set(midi, index);
      dom.pianoKeyboard.append(makePianoKey(midi, "white"));
    });

    for (let midi = startMidi; midi <= endMidi; midi += 1) {
      if (![1, 3, 6, 8, 10].includes(midi % 12)) continue;
      const previousWhite = [...whiteMidis].reverse().find(value => value < midi);
      const leftIndex = whiteIndexByMidi.get(previousWhite) + 1;
      const key = makePianoKey(midi, "black");
      key.style.setProperty("--left", `${leftIndex / whiteMidis.length * 100}%`);
      dom.pianoKeyboard.append(key);
    }

    updateKeyboardMapping();
  }

  function makePianoKey(baseMidi, kind) {
    const key = document.createElement("button");
    key.type = "button";
    key.className = `piano-key ${kind}`;
    key.dataset.baseMidi = String(baseMidi);
    key.setAttribute("aria-label", `${midiName(baseMidi)} piano key`);
    key.innerHTML = '<span class="key-label"><span class="key-hotkey"></span><span class="key-note"></span></span>';
    key.querySelector(".key-note").textContent = midiName(baseMidi);

    key.addEventListener("pointerdown", async event => {
      event.preventDefault();
      if (!(await prepareForLiveInput())) return;
      const rect = key.getBoundingClientRect();
      const velocity = Math.max(0.32, Math.min(1, 1 - (event.clientY - rect.top) / rect.height * 0.45));
      pressPianoKey(key, velocity);
      key.setPointerCapture?.(event.pointerId);
    });

    ["pointerup", "pointercancel"].forEach(type => key.addEventListener(type, event => {
      event.preventDefault();
      releasePianoKey(key);
    }));

    key.addEventListener("pointerleave", event => {
      if (event.buttons) releasePianoKey(key);
    });

    return key;
  }

  function updateKeyboardMapping() {
    const keys = [...dom.pianoKeyboard.querySelectorAll(".piano-key")];
    keys.forEach(key => {
      delete key.dataset.computerKey;
      key.classList.remove("hotkey-assigned");
      key.querySelector(".key-hotkey").textContent = "";
    });

    PIANO_KEY_MAP.forEach((midi, hotkey) => {
      const key = dom.pianoKeyboard.querySelector(`[data-base-midi="${midi}"]`);
      if (!key) return;
      key.dataset.computerKey = hotkey;
      key.classList.add("hotkey-assigned");
      key.querySelector(".key-hotkey").textContent = hotkey === "[" ? "[" : hotkey.toUpperCase();
    });
    requestAnimationFrame(positionChallengeNotes);
  }

  async function prepareForLiveInput() {
    if (state.paused) {
      await resumeBuildPlayback();
      return state.audio?.ctx?.state === "running";
    }
    return state.audio.ensure();
  }

  function pressPianoKey(key, velocity = 0.72) {
    if (key.classList.contains("active")) return;
    const midi = Number(key.dataset.baseMidi) + state.soundOctave * 12;
    key.classList.add("active");
    const voice = state.audio.noteOn(midi, velocity);
    state.activeNotes.set(key, voice);
    if (state.mode === "free" && state.freeLoop.recording) beginFreeLoopNote(key, midi, velocity);
    judgeChallengeNote(midi);
    setHostReaction("listening");
  }

  function releasePianoKey(key) {
    if (!key?.classList.contains("active")) return;
    key.classList.remove("active");
    const voice = state.activeNotes.get(key);
    if (state.sustain && voice) state.sustainedNotes.add(voice);
    else state.audio.noteOff(voice);
    state.activeNotes.delete(key);
    if (state.mode === "free" && state.freeLoop.recording) finishFreeLoopNote(key);
  }

  function setSustain(enabled) {
    state.sustain = enabled;
    dom.sustainButton.classList.toggle("active", enabled);
    dom.sustainButton.setAttribute("aria-pressed", String(enabled));
    if (!enabled) {
      state.sustainedNotes.forEach(voice => state.audio.noteOff(voice));
      state.sustainedNotes.clear();
    }
    renderTransport();
  }

  function setSoundOctave(value) {
    state.soundOctave = Math.max(-2, Math.min(2, value));
    dom.octaveReadout.textContent = state.soundOctave >= 0 ? `+${state.soundOctave}` : String(state.soundOctave);
  }

  function bindControls() {
    document.querySelectorAll(".mode-tab").forEach(button => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    dom.packSelect.addEventListener("change", event => setPack(event.target.value));
    dom.octaveUp.addEventListener("click", () => setSoundOctave(state.soundOctave + 1));
    dom.octaveDown.addEventListener("click", () => setSoundOctave(state.soundOctave - 1));
    dom.sustainButton.addEventListener("click", () => setSustain(!state.sustain));
    dom.freeLoopBpm?.addEventListener("change", () => {
      const next = Math.max(60, Math.min(180, Number(dom.freeLoopBpm.value) || state.pack.bpm));
      state.freeLoop.bpm = next;
      dom.freeLoopBpm.value = String(next);
      if (state.metronomeOn) startMetronome();
      if (state.freeLoop.playing) restartFreeLoopPlayback();
      updateDisplay();
    });
    document.querySelectorAll("[data-loop-bars]").forEach(button => button.addEventListener("click", () => {
      state.freeLoop.bars = Number(button.dataset.loopBars) || 1;
      document.querySelectorAll("[data-loop-bars]").forEach(item => item.classList.toggle("active", item === button));
      if (state.freeLoop.playing) restartFreeLoopPlayback();
      updateFreeLoopStatus();
    }));
    dom.studioTutorialButton?.addEventListener("click", openTutorial);
    dom.modeTutorialButton?.addEventListener("click", openTutorial);
    dom.tutorialClose?.addEventListener("click", closeTutorial);
    dom.tutorialPrevious?.addEventListener("click", () => changeTutorialStep(-1));
    dom.tutorialNext?.addEventListener("click", () => changeTutorialStep(1));
    document.querySelectorAll("[data-close-tutorial]").forEach(button => button.addEventListener("click", closeTutorial));
    dom.mobileStopAll?.addEventListener("click", () => stopAllPlayback());
    window.addEventListener("resize", () => {
      window.clearTimeout(window.__studioLaneTimer);
      window.__studioLaneTimer = window.setTimeout(handleStudioViewportChange, 140);
    });
    window.addEventListener("orientationchange", () => {
      window.setTimeout(handleStudioViewportChange, 240);
    });

    dom.pitchWheel.addEventListener("input", async event => {
      if (!(await state.audio.ensure())) return;
      state.audio.pitchBend = Number(event.target.value);
    });
    dom.pitchWheel.addEventListener("change", event => {
      event.target.value = 0;
      state.audio.pitchBend = 0;
    });
    dom.modWheel.addEventListener("input", async event => {
      if (!(await state.audio.ensure())) return;
      state.audio.modulation = Number(event.target.value);
    });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }

  const MOBILE_VIEWS = new Set(["play", "build", "mix"]);

  function setMobileSession(open) {
    const isOpen = Boolean(open) && isCompactMobileStudio();
    document.body.dataset.mobileSession = isOpen ? "open" : "closed";
    dom.mobileSessionToggle?.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      window.setTimeout(() => dom.mobileSessionClose?.focus(), 80);
    }
  }

  function updateMobileCoach() {
    if (!dom.mobileCoachTitle) return;
    const view = document.body.dataset.mobileView || "play";
    let kicker = "Play";
    let title = "Make your first sound";
    let copy = "Tap a piano key, then add a percussion pad or record a short loop.";

    if (view === "build") {
      kicker = "Build";
      title = "Build a short arrangement";
      copy = "Choose a musical pack, start a section, then queue the next part when you are ready.";
    } else if (view === "mix") {
      kicker = "Mix";
      title = "Shape what you hear";
      copy = "Balance the band, mute or solo instruments, and adjust the piano sound.";
    } else if (state.mode === "lick") {
      kicker = "Play · Learn";
      title = "Learn one short phrase";
      copy = "Choose a difficulty, hear the guide, then follow the falling notes on the piano.";
    } else if (state.mode === "free") {
      kicker = "Play · Free";
      title = "Play, tap, and loop";
      copy = "The piano and percussion pads are live. Record a one-bar idea when you are ready.";
    }

    dom.mobileCoachKicker.textContent = kicker;
    dom.mobileCoachTitle.textContent = title;
    dom.mobileCoachCopy.textContent = copy;
  }

  async function setMobileView(view, scroll = true, syncMode = true) {
    const next = MOBILE_VIEWS.has(view) ? view : "play";
    document.body.dataset.mobileView = next;
    setMobileSession(false);

    document.querySelectorAll("[data-mobile-view]").forEach(button => {
      if (!(button instanceof HTMLButtonElement)) return;
      const active = button.dataset.mobileView === next;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (syncMode) {
      if (next === "build" && state.mode !== "build") {
        await setMode("build", false, false);
      } else if (next === "play" && state.mode === "build") {
        await setMode("free", false, false);
      }
    }

    updateMobileCoach();
    if (scroll && isCompactMobileStudio()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.setTimeout(positionChallengeNotes, 80);
  }

  function showSoundGate(message = "Tap Enable sound to start the studio.") {
    if (!isCompactMobileStudio() && !window.matchMedia("(pointer: coarse)").matches) return;
    if (!dom.studioSoundGate) return;
    dom.studioSoundGate.classList.add("open");
    dom.studioSoundGate.setAttribute("aria-hidden", "false");
    if (dom.studioSoundGateStatus) dom.studioSoundGateStatus.textContent = message;
  }

  function hideSoundGate() {
    if (!dom.studioSoundGate) return;
    dom.studioSoundGate.classList.remove("open");
    dom.studioSoundGate.setAttribute("aria-hidden", "true");
  }

  async function unlockStudioAudio() {
    if (dom.studioSoundGateStatus) dom.studioSoundGateStatus.textContent = "Starting audio…";
    const ready = await state.audio.ensure();
    if (!ready || state.audio.ctx?.state !== "running") {
      showSoundGate(state.audioError || "Safari did not start the audio engine. Tap again.");
      return false;
    }
    state.audio.click(state.audio.ctx.currentTime + 0.025, true);
    state.audioError = "";
    updateAudioStatus();
    if (dom.studioSoundGateStatus) dom.studioSoundGateStatus.textContent = "Sound ready";
    window.setTimeout(hideSoundGate, 220);
    return true;
  }

  async function restoreStudioAudio() {
    if (!state.audio?.ctx || document.hidden) return;
    if (state.audio.ctx.state === "running") {
      state.audioReady = true;
      state.audioError = "";
      updateAudioStatus();
      return;
    }
    showSoundGate("Studio sound was paused by Safari. Tap to restore it.");
  }

  async function handleStudioViewportChange() {
    const compact = isCompactMobileStudio();
    if (state.mobilePianoCompact !== compact) {
      await stopAllPlayback({ keepMessage: true });
      buildPiano();
      highlightScale(state.mode !== "build");
      if (compact && state.mode === "build" && document.body.dataset.mobileView === "play") {
        await setMode("free", false, false);
      }
    }
    if (!compact) setMobileSession(false);
    updateMobileCoach();
    positionChallengeNotes();
  }

  function setupMobileExperience() {
    setMobileView(document.body.dataset.mobileView || "play", false, false);
    document.querySelectorAll("[data-mobile-view]").forEach(button => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.addEventListener("click", () => setMobileView(button.dataset.mobileView));
    });

    dom.enableStudioSound?.addEventListener("click", unlockStudioAudio);
    dom.mobileSessionToggle?.addEventListener("click", () => {
      setMobileSession(document.body.dataset.mobileSession !== "open");
    });
    dom.mobileSessionClose?.addEventListener("click", () => setMobileSession(false));
    dom.mobileSessionScrim?.addEventListener("click", () => setMobileSession(false));
    dom.mobileHelp?.addEventListener("click", openTutorial);

    if (window.matchMedia("(pointer: coarse)").matches) {
      showSoundGate("Tap Enable sound before playing the keyboard or pads.");
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) window.setTimeout(restoreStudioAudio, 120);
    });
    window.addEventListener("pageshow", () => window.setTimeout(restoreStudioAudio, 120));

    document.querySelectorAll(".mode-tab").forEach(button => {
      button.addEventListener("click", () => {
        if (isCompactMobileStudio()) setMobileView(button.dataset.mode === "build" ? "build" : "play", false, false);
      });
    });
  }

  function clearTutorialFocus() {
    document.querySelectorAll(".tutorial-focus").forEach(element => element.classList.remove("tutorial-focus"));
    if (dom.tutorialSpotlight) dom.tutorialSpotlight.hidden = true;
  }

  function placeTutorialSpotlight(target) {
    if (!target || !dom.tutorialSpotlight) return;
    const rect = target.getBoundingClientRect();
    const pad = 8;
    dom.tutorialSpotlight.hidden = false;
    dom.tutorialSpotlight.style.left = `${Math.max(8, rect.left - pad)}px`;
    dom.tutorialSpotlight.style.top = `${Math.max(8, rect.top - pad)}px`;
    dom.tutorialSpotlight.style.width = `${Math.min(window.innerWidth - 16, rect.width + pad * 2)}px`;
    dom.tutorialSpotlight.style.height = `${Math.min(window.innerHeight - 16, rect.height + pad * 2)}px`;

    const card = dom.studioTutorial?.querySelector(".tutorial-card");
    if (!card) return;
    card.classList.toggle("dock-left", rect.left > window.innerWidth * 0.56);
    card.classList.toggle("dock-top", rect.bottom > window.innerHeight * 0.66);
  }

  function openTutorial() {
    tutorialMode = state.mode;
    tutorialStepIndex = 0;
    dom.studioTutorial.classList.add("open");
    dom.studioTutorial.setAttribute("aria-hidden", "false");
    document.body.classList.add("tutorial-open");
    renderTutorialStep();
    dom.tutorialClose?.focus();
  }

  function closeTutorial() {
    clearTutorialFocus();
    dom.studioTutorial.classList.remove("open");
    dom.studioTutorial.setAttribute("aria-hidden", "true");
    document.body.classList.remove("tutorial-open");
    (dom.modeTutorialButton || dom.studioTutorialButton)?.focus();
  }

  function changeTutorialStep(direction) {
    const steps = TUTORIALS[tutorialMode] || [];
    const next = tutorialStepIndex + direction;
    if (next >= steps.length) {
      closeTutorial();
      return;
    }
    tutorialStepIndex = Math.max(0, next);
    renderTutorialStep();
  }

  function renderTutorialStep() {
    const steps = TUTORIALS[tutorialMode] || TUTORIALS.build;
    const step = steps[tutorialStepIndex] || steps[0];
    clearTutorialFocus();
    dom.tutorialTitle.textContent = tutorialMode === "build" ? "Build a Band" : tutorialMode === "free" ? "Free Play" : "Play the Lick";
    dom.tutorialStepNumber.textContent = `Step ${tutorialStepIndex + 1} of ${steps.length}`;
    dom.tutorialStepTitle.textContent = step.title;
    dom.tutorialStepCopy.textContent = step.copy;
    dom.tutorialKey.textContent = step.key;
    dom.tutorialProgress.style.width = `${((tutorialStepIndex + 1) / steps.length) * 100}%`;
    dom.tutorialPrevious.disabled = tutorialStepIndex === 0;
    dom.tutorialNext.textContent = tutorialStepIndex === steps.length - 1 ? "Finish" : "Next";
    const target = document.querySelector(step.selector);
    if (target) {
      target.classList.add("tutorial-focus");
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      window.setTimeout(() => placeTutorialSpotlight(target), 260);
    }
  }

  function isEditableTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
  }

  async function handleKeyDown(event) {
    if (isEditableTarget(event.target)) return;

    if (event.key === "Escape") {
      event.preventDefault();
      if (dom.studioTutorial?.classList.contains("open")) { closeTutorial(); return; }
      if (document.body.dataset.mobileSession === "open") { setMobileSession(false); return; }
      await stopAllPlayback();
      return;
    }

    if (event.shiftKey) {
      const key = event.key.toLowerCase();
      if (key === "r") { event.preventDefault(); toggleCapture(); return; }
      if (key === "p") { event.preventDefault(); replayArrangement(); return; }
      if (key === "c") { event.preventDefault(); clearArrangement(); return; }
      if (key === "l") { event.preventDefault(); toggleLoopCurrent(); return; }
    }

    if (event.key === " ") {
      if (!event.repeat) { event.preventDefault(); setSustain(true); }
      return;
    }

    const lower = event.key.toLowerCase();
    if (state.mode === "free" && !event.repeat) {
      if (lower === "a") { event.preventDefault(); toggleFreeLoopRecord(); return; }
      if (lower === "s") { event.preventDefault(); toggleFreeLoopPlayback(); return; }
      if (lower === "d") { event.preventDefault(); startFreeLoopOverdub(); return; }
      if (lower === "f") { event.preventDefault(); undoFreeLoopLayer(); return; }
      if (lower === "g") { event.preventDefault(); clearFreeLoop(); return; }
      if (lower === "h") { event.preventDefault(); toggleMetronome(); return; }
    }

    const padIndex = PAD_HOTKEYS.indexOf(lower);
    if (padIndex >= 0 && !event.repeat) {
      const pad = dom.padGrid.querySelectorAll(".performance-pad")[padIndex];
      if (pad && !pad.disabled) { event.preventDefault(); pad.click(); }
      return;
    }

    if (event.repeat) return;
    const midi = PIANO_KEY_MAP.get(lower);
    if (midi == null) return;
    const key = dom.pianoKeyboard.querySelector(`[data-base-midi="${midi}"]`);
    if (!key) return;
    event.preventDefault();
    if (!(await prepareForLiveInput())) return;
    state.activeComputerKeys.set(lower, key);
    pressPianoKey(key, 0.78);
  }

  function handleKeyUp(event) {
    if (event.key === " ") {
      if (!isEditableTarget(event.target)) {
        event.preventDefault();
        setSustain(false);
      }
      return;
    }
    const hotkey = event.key.toLowerCase();
    const key = state.activeComputerKeys.get(hotkey);
    if (!key) return;
    releasePianoKey(key);
    state.activeComputerKeys.delete(hotkey);
  }

  async function setMode(mode, stopFirst = true, syncMobile = true) {
    if (!MODE_COPY[mode]) return;
    if (stopFirst) await stopAllPlayback({ keepMessage: true });
    if (state.mode === "build" && mode !== "build") state.captureActive = false;
    state.mode = mode;
    dom.controller.classList.toggle("lick-mode", mode === "lick");
    dom.controller.classList.toggle("free-mode", mode === "free");
    if (dom.freeLoopSettings) dom.freeLoopSettings.hidden = mode !== "free";
    document.querySelectorAll(".mode-tab").forEach(button => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    dom.padBankTitle.textContent = MODE_COPY[mode].title;
    dom.padBankHint.textContent = MODE_COPY[mode].hint;
    dom.modeStatus.textContent = mode === "build" ? "Build a Band is ready" : mode === "free" ? "Free Play has no backing track" : "Play the Lick is ready";
    setHostText(MODE_COPY[mode].message, MODE_COPY[mode].submessage);
    buildPads();
    renderTransport();
    highlightScale(mode !== "build");
    if (mode === "lick") setupChallenge();
    if (mode === "free") {
      state.freeLoop.bpm = state.pack.bpm;
      if (dom.freeLoopBpm) dom.freeLoopBpm.value = String(state.freeLoop.bpm);
      updateFreeLoopStatus();
    }
    updateDisplay();
    updateMobileCoach();
    if (isCompactMobileStudio() && syncMobile) {
      setMobileView(mode === "build" ? "build" : "play", false, false);
    }
    if (dom.studioTutorial?.classList.contains("open")) {
      tutorialMode = mode;
      tutorialStepIndex = 0;
      renderTutorialStep();
    }
  }

  async function setPack(packId, stopFirst = true) {
    const pack = state.packs.find(item => item.id === packId) || state.packs[0];
    if (stopFirst) await stopAllPlayback({ keepMessage: true });
    state.pack = pack;
    state.sectionCache.clear();
    dom.packSelect.value = pack.id;
    buildPads();
    highlightScale(state.mode !== "build");
    if (state.mode === "lick") setupChallenge();
    if (state.mode === "free") {
      state.freeLoop.bpm = pack.bpm;
      if (dom.freeLoopBpm) dom.freeLoopBpm.value = String(pack.bpm);
    }
    updateDisplay();
  }

  function buildPads() {
    dom.padGrid.innerHTML = "";
    let pads = [];
    if (state.mode === "build") {
      pads = state.pack.sections.slice(0, 7).map((section, index) => ({ id: section, label: sectionLabel(section), sub: index === 0 ? "Start here" : "Queue section" }));
      pads.push({ id: "stop-all", label: "Stop All", sub: "Esc" });
    } else if (state.mode === "free") {
      pads = FREE_PAD_LABELS.map(([label, sub], index) => ({ id: FREE_PAD_SOUNDS[index], label, sub }));
    } else {
      pads = [
        { id: "start-challenge", label: "Start", sub: "Count in" },
        { id: "slower", label: "Slower", sub: "−5 BPM" },
        { id: "faster", label: "Faster", sub: "+5 BPM" },
        { id: "restart-challenge", label: "Restart", sub: "Try again" },
        { id: "guide", label: "Hear Guide", sub: "Listen first" },
        { id: "practice", label: "Practice", sub: "No penalties" },
        { id: "stop-all", label: "Stop All", sub: "Esc" },
        { id: "return-build", label: "Build", sub: "Return" }
      ];
    }

    pads.forEach((pad, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "performance-pad";
      button.dataset.pad = pad.id;
      button.style.setProperty("--pad-color", PAD_COLORS[index % PAD_COLORS.length]);
      const hotkey = PAD_HOTKEYS[index] === "," ? "," : PAD_HOTKEYS[index].toUpperCase();
      button.innerHTML = `<em>${hotkey}</em><strong>${pad.label}</strong><span>${pad.sub}</span>`;
      button.addEventListener("click", () => handlePad(pad.id, button));
      dom.padGrid.append(button);
    });
    updatePadStates();
  }

  async function handlePad(id, button) {
    button.classList.add("is-hit");
    setTimeout(() => button.classList.remove("is-hit"), 110);

    if (id === "stop-all") { await stopAllPlayback(); return; }
    if (id === "return-build") { await setMode("build"); return; }

    if (!(await state.audio.ensure())) return;
    if (state.mode === "build") {
      queueOrStartSection(id, true);
      return;
    }
    if (state.mode === "free") {
      state.audio.percussion(id);
      recordFreeLoopPad(id, 0.82);
      setHostReaction("groove");
      return;
    }

    if (id === "start-challenge") startChallenge();
    if (id === "restart-challenge") { stopChallenge(true); startChallenge(); }
    if (id === "slower") changeChallengeTempo(-5);
    if (id === "faster") changeChallengeTempo(5);
    if (id === "guide") playChallengeGuide();
    if (id === "practice") togglePracticeMode();
  }

  function transportDefinitions() {
    if (state.mode === "build") {
      return [
        { action: "capture", icon: "●︎", label: state.captureActive ? "Capturing" : "Capture", on: state.captureActive },
        { action: "play-pause", icon: state.paused ? "▶︎" : "Ⅱ", label: state.paused ? "Resume" : state.isPlaying ? "Pause" : "Play" },
        { action: "stop-all", icon: "■︎", label: "Stop All", stop: true },
        { action: "replay", icon: "↻︎", label: "Replay", disabled: !hasArrangement() },
        { action: "loop", icon: "∞︎", label: "Loop Current", on: state.loopCurrent },
        { action: "clear", icon: "×", label: "Clear", disabled: !state.arrangement.length }
      ];
    }
    if (state.mode === "free") {
      const loop = state.freeLoop;
      return [
        { action: "free-record", icon: loop.recording ? "■︎" : "●︎", label: loop.recording ? "Finish" : "Record", on: loop.recording },
        { action: "free-play", icon: loop.playing ? "Ⅱ" : "▶︎", label: loop.playing ? "Pause Loop" : "Play Loop", on: loop.playing, disabled: !freeLoopEvents().length && !loop.recording },
        { action: "free-overdub", icon: "+", label: "Overdub", on: loop.overdubbing, disabled: !freeLoopEvents().length },
        { action: "free-undo", icon: "↶", label: "Undo Layer", disabled: !loop.layers.length },
        { action: "free-clear", icon: "×", label: "Clear", disabled: !loop.layers.length },
        { action: "metronome", icon: "♩︎", label: "Metronome", on: state.metronomeOn },
        { action: "sustain", icon: "S", label: "Sustain", on: state.sustain },
        { action: "stop-all", icon: "■︎", label: "Stop All", stop: true }
      ];
    }
    return [
      { action: "challenge-start", icon: "▶︎", label: state.challenge?.running ? "Running" : "Start", disabled: state.challenge?.running },
      { action: "stop-all", icon: "■︎", label: "Stop All", stop: true },
      { action: "challenge-restart", icon: "↻︎", label: "Restart" },
      { action: "challenge-guide", icon: "♫︎", label: "Hear Guide" },
      { action: "challenge-slower", icon: "−", label: "Slower" },
      { action: "challenge-faster", icon: "+", label: "Faster" },
      { action: "challenge-practice", icon: "P", label: "Practice", on: state.challenge?.practice },
      { action: "return-build", icon: "←", label: "Build" }
    ];
  }

  function renderTransport() {
    dom.transportRow.innerHTML = "";
    transportDefinitions().forEach(definition => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "transport-button";
      if (definition.on) button.classList.add("is-on");
      if (definition.stop) button.classList.add("stop-all");
      button.disabled = Boolean(definition.disabled);
      button.dataset.action = definition.action;
      button.innerHTML = `<span class="transport-icon">${definition.icon}</span><small>${definition.label}</small>`;
      button.addEventListener("click", () => handleTransport(definition.action));
      dom.transportRow.append(button);
    });
  }

  async function handleTransport(action) {
    if (action === "stop-all") { await stopAllPlayback(); return; }
    if (action === "capture") { toggleCapture(); return; }
    if (action === "play-pause") { toggleBuildPlayPause(); return; }
    if (action === "replay") { replayArrangement(); return; }
    if (action === "loop") { toggleLoopCurrent(); return; }
    if (action === "clear") { clearArrangement(); return; }
    if (action === "free-record") { toggleFreeLoopRecord(); return; }
    if (action === "free-play") { toggleFreeLoopPlayback(); return; }
    if (action === "free-overdub") { startFreeLoopOverdub(); return; }
    if (action === "free-undo") { undoFreeLoopLayer(); return; }
    if (action === "free-clear") { clearFreeLoop(); return; }
    if (action === "metronome") { toggleMetronome(); return; }
    if (action === "sustain") { setSustain(!state.sustain); return; }
    if (action === "octave-down") { setSoundOctave(state.soundOctave - 1); renderTransport(); return; }
    if (action === "octave-up") { setSoundOctave(state.soundOctave + 1); renderTransport(); return; }
    if (action === "challenge-start") { startChallenge(); return; }
    if (action === "challenge-restart") { stopChallenge(true); startChallenge(); return; }
    if (action === "challenge-guide") { playChallengeGuide(); return; }
    if (action === "challenge-slower") { changeChallengeTempo(-5); return; }
    if (action === "challenge-faster") { changeChallengeTempo(5); return; }
    if (action === "challenge-practice") { togglePracticeMode(); return; }
    if (action === "return-build") { setMode("build"); }
  }

  async function toggleBuildPlayPause() {
    if (!(await state.audio.ensure())) return;
    if (!state.isPlaying) {
      await startSection(state.currentSection || state.pack.sections[0], true);
      return;
    }
    if (state.paused) await resumeBuildPlayback();
    else await pauseBuildPlayback();
  }

  async function pauseBuildPlayback() {
    if (!state.isPlaying || state.paused || !state.audio?.ctx) return;
    clearTimeout(state.boundaryTimer);
    state.paused = true;
    await state.audio.ctx.suspend();
    setHostText("Playback paused.", "Resume when you are ready.");
    updateAllUI();
  }

  async function resumeBuildPlayback() {
    if (!state.paused || !state.audio?.ctx) return;
    await state.audio.ctx.resume();
    state.paused = false;
    scheduleBoundary();
    setHostReaction("groove");
    updateAllUI();
  }

  function toggleLoopCurrent() {
    state.loopCurrent = !state.loopCurrent;
    renderTransport();
    updateDisplay();
    setHostText(state.loopCurrent ? "Loop Current is on." : "Loop Current is off.", state.loopCurrent ? "The active section will repeat until another section is queued." : "Playback will stop when a section ends and nothing is queued.");
  }

  function currentTempo() {
    if (state.mode === "free") return state.freeLoop.bpm;
    if (state.mode === "lick" && state.challenge) return state.challenge.bpm;
    return state.pack.bpm;
  }

  async function toggleMetronome() {
    if (!(await state.audio.ensure())) return;
    if (state.metronomeOn) stopMetronome();
    else startMetronome();
    renderTransport();
    updateFreeLoopStatus();
  }

  function startMetronome() {
    clearInterval(state.metronomeTimer);
    state.metronomeOn = true;
    state.metronomeBeat = 0;
    state.metronomeNextTime = state.audio.ctx.currentTime + 0.06;
    const schedule = () => {
      if (!state.metronomeOn || !state.audio?.ctx) return;
      const secondsPerBeat = 60 / currentTempo();
      while (state.metronomeNextTime < state.audio.ctx.currentTime + 0.12) {
        state.audio.click(state.metronomeNextTime, state.metronomeBeat % 4 === 0);
        state.metronomeNextTime += secondsPerBeat;
        state.metronomeBeat += 1;
        dom.controller.classList.toggle("metronome-accent", state.metronomeBeat % 4 === 1);
      }
    };
    schedule();
    state.metronomeTimer = setInterval(schedule, 25);
  }

  function stopMetronome() {
    clearInterval(state.metronomeTimer);
    state.metronomeTimer = null;
    state.metronomeOn = false;
    dom.controller?.classList.remove("metronome-accent");
  }

  function freeLoopDuration() {
    return state.freeLoop.bars * 4 * 60 / state.freeLoop.bpm;
  }

  function freeLoopEvents() {
    return state.freeLoop.layers.flat();
  }

  function freeLoopPosition() {
    if (!state.audio?.ctx || !state.freeLoop.loopStartAt) return 0;
    const duration = freeLoopDuration();
    return ((state.audio.ctx.currentTime - state.freeLoop.loopStartAt) % duration + duration) % duration;
  }

  function updateFreeLoopStatus(message = null) {
    if (!dom.freeLoopStatus) return;
    const loop = state.freeLoop;
    if (message) dom.freeLoopStatus.textContent = message;
    else if (loop.recording && loop.overdubbing) dom.freeLoopStatus.textContent = `Overdubbing ${loop.bars} bar${loop.bars === 1 ? "" : "s"}`;
    else if (loop.recording) dom.freeLoopStatus.textContent = `Recording ${loop.bars} bar${loop.bars === 1 ? "" : "s"}`;
    else if (loop.playing) dom.freeLoopStatus.textContent = `Loop playing · ${freeLoopEvents().length} events`;
    else if (freeLoopEvents().length) dom.freeLoopStatus.textContent = `Loop ready · ${loop.layers.length} layer${loop.layers.length === 1 ? "" : "s"}`;
    else dom.freeLoopStatus.textContent = "Ready to record";
  }

  function startFreeLoopAnimation() {
    cancelAnimationFrame(state.freeLoop.raf);
    const frame = () => {
      if (!state.freeLoop.playing && !state.freeLoop.recording) { if (dom.freeLoopPlayhead) dom.freeLoopPlayhead.style.width = "0%"; return; }
      const percent = Math.max(0, Math.min(100, freeLoopPosition() / freeLoopDuration() * 100));
      if (dom.freeLoopPlayhead) dom.freeLoopPlayhead.style.width = `${percent}%`;
      state.freeLoop.raf = requestAnimationFrame(frame);
    };
    frame();
  }

  function beginFreeLoopNote(key, midi, velocity) {
    const loop = state.freeLoop;
    if (!loop.recording || !state.audio?.ctx) return;
    loop.pendingNotes.set(key, { type: "note", midi, velocity, time: freeLoopPosition(), startedAt: state.audio.ctx.currentTime });
  }

  function finishFreeLoopNote(key) {
    const loop = state.freeLoop;
    const pending = loop.pendingNotes.get(key);
    if (!pending || !state.audio?.ctx) return;
    pending.duration = Math.max(0.08, Math.min(freeLoopDuration(), state.audio.ctx.currentTime - pending.startedAt));
    delete pending.startedAt;
    loop.currentLayer.push(pending);
    loop.pendingNotes.delete(key);
  }

  function recordFreeLoopPad(sound, velocity = 0.82) {
    const loop = state.freeLoop;
    if (!loop.recording) return;
    loop.currentLayer.push({ type: "pad", sound, velocity, time: freeLoopPosition() });
  }

  async function toggleFreeLoopRecord() {
    if (state.freeLoop.recording) { finishFreeLoopRecording(); return; }
    await startFreeLoopRecording(false);
  }

  async function startFreeLoopRecording(overdub = false) {
    if (state.mode !== "free") return;
    if (!(await state.audio.ensure())) return;
    const loop = state.freeLoop;
    if (!overdub) {
      stopFreeLoopPlayback(false);
      loop.layers = [];
      loop.loopStartAt = state.audio.ctx.currentTime + 0.08;
    } else if (!loop.playing) {
      await startFreeLoopPlayback();
    }
    loop.currentLayer = [];
    loop.pendingNotes.clear();
    loop.recording = true;
    loop.overdubbing = overdub;
    clearTimeout(loop.recordTimer);
    const remaining = overdub ? Math.max(0.15, freeLoopDuration() - freeLoopPosition()) : freeLoopDuration();
    loop.recordTimer = setTimeout(finishFreeLoopRecording, remaining * 1000);
    renderTransport();
    updateFreeLoopStatus();
    startFreeLoopAnimation();
    setHostText(overdub ? "Overdub is listening." : "Recording a new loop.", "Play piano notes and percussion. The pass closes at the loop boundary.");
  }

  function finishFreeLoopRecording() {
    const loop = state.freeLoop;
    if (!loop.recording) return;
    clearTimeout(loop.recordTimer);
    loop.pendingNotes.forEach(pending => {
      pending.duration = Math.max(0.08, state.audio?.ctx ? state.audio.ctx.currentTime - pending.startedAt : 0.18);
      delete pending.startedAt;
      loop.currentLayer.push(pending);
    });
    loop.pendingNotes.clear();
    if (loop.currentLayer.length) loop.layers.push(loop.currentLayer.slice());
    loop.currentLayer = [];
    loop.recording = false;
    loop.overdubbing = false;
    if (!loop.playing && freeLoopEvents().length) startFreeLoopPlayback();
    renderTransport();
    updateFreeLoopStatus();
  }

  async function startFreeLoopOverdub() {
    if (!freeLoopEvents().length) { await startFreeLoopRecording(false); return; }
    await startFreeLoopRecording(true);
  }

  function scheduleFreeLoopCycle(cycleStart) {
    const duration = freeLoopDuration();
    freeLoopEvents().forEach(event => {
      const at = cycleStart + Math.max(0, Math.min(duration - 0.001, event.time));
      if (event.type === "note") state.audio.noteOnAt(event.midi, event.velocity, at, event.duration || 0.18);
      else if (event.type === "pad") state.audio.percussion(event.sound, event.velocity, at);
    });
  }

  async function startFreeLoopPlayback() {
    if (!freeLoopEvents().length || state.mode !== "free") { updateFreeLoopStatus("Record a loop first"); return; }
    if (!(await state.audio.ensure())) return;
    stopFreeLoopPlayback(false);
    const loop = state.freeLoop;
    loop.playing = true;
    loop.loopStartAt = state.audio.ctx.currentTime + 0.08;
    const scheduleCycle = cycleStart => {
      if (!loop.playing) return;
      scheduleFreeLoopCycle(cycleStart);
      const wait = Math.max(20, (cycleStart + freeLoopDuration() - state.audio.ctx.currentTime - 0.08) * 1000);
      loop.cycleTimer = setTimeout(() => scheduleCycle(cycleStart + freeLoopDuration()), wait);
    };
    scheduleCycle(loop.loopStartAt);
    startFreeLoopAnimation();
    renderTransport();
    updateFreeLoopStatus();
    setHostText("Your loop is playing.", "Overdub another layer or change the sound while it runs.");
  }

  function stopFreeLoopPlayback(stopVoices = true) {
    const loop = state.freeLoop;
    clearTimeout(loop.cycleTimer); clearTimeout(loop.recordTimer); cancelAnimationFrame(loop.raf);
    loop.cycleTimer = null; loop.recordTimer = null; loop.raf = null;
    loop.playing = false; loop.recording = false; loop.overdubbing = false; loop.pendingNotes.clear();
    if (stopVoices && state.audio?.ctx) state.audio.stopAllNodes(state.audio.ctx.currentTime + 0.01);
    if (dom.freeLoopPlayhead) dom.freeLoopPlayhead.style.width = "0%";
    renderTransport(); updateFreeLoopStatus();
  }

  function toggleFreeLoopPlayback() {
    if (state.freeLoop.playing) stopFreeLoopPlayback();
    else startFreeLoopPlayback();
  }

  function restartFreeLoopPlayback() {
    const shouldRestart = state.freeLoop.playing;
    stopFreeLoopPlayback();
    if (shouldRestart && freeLoopEvents().length) startFreeLoopPlayback();
  }

  function undoFreeLoopLayer() {
    if (!state.freeLoop.layers.length) return;
    state.freeLoop.layers.pop();
    if (!freeLoopEvents().length) stopFreeLoopPlayback();
    else if (state.freeLoop.playing) restartFreeLoopPlayback();
    renderTransport(); updateFreeLoopStatus("Last layer removed");
  }

  function clearFreeLoop() {
    stopFreeLoopPlayback();
    state.freeLoop.layers = [];
    state.freeLoop.currentLayer = [];
    renderTransport(); updateFreeLoopStatus("Loop cleared");
  }

  function toggleCapture() {
    if (state.mode !== "build") return;
    state.captureActive = !state.captureActive;
    if (state.captureActive) {
      state.arrangement = [];
      state.captureStartedAt = performance.now();
      recordEvent("snapshot", {
        levels: Object.fromEntries(state.channelValues),
        muted: [...state.channelMuted],
        solo: [...state.channelSolo]
      }, 0);
      setHostText("Capturing arrangement decisions.", "Section choices and mixer changes will be remembered.");
    } else {
      setHostText("Arrangement capture ended.", hasArrangement() ? "Replay is now available." : "No section choices were captured.");
    }
    updateArrangementLog();
    renderTransport();
    updateDisplay();
  }

  function recordEvent(type, data, forcedTime = null) {
    if (!state.captureActive && forcedTime === null) return;
    const timeMs = forcedTime ?? Math.max(0, performance.now() - state.captureStartedAt);
    state.arrangement.push({ type, timeMs, ...data });
    updateArrangementLog();
    renderTransport();
  }

  function hasArrangement() {
    return state.arrangement.some(event => event.type === "section-select");
  }

  function clearArrangement() {
    state.captureActive = false;
    state.replaying = false;
    clearReplayTimers();
    state.arrangement = [];
    updateArrangementLog();
    renderTransport();
    updateDisplay();
    setHostText("Arrangement cleared.", "Choose Capture Arrangement to begin another pass.");
  }

  async function replayArrangement() {
    if (!hasArrangement() || state.mode !== "build") return;
    await stopAllPlayback({ keepMessage: true });
    if (!(await state.audio.ensure())) return;
    state.replaying = true;
    state.captureActive = false;
    state.replayLastEventAt = Math.max(...state.arrangement.map(event => event.timeMs));

    state.arrangement.forEach(event => {
      const timer = setTimeout(() => applyReplayEvent(event), event.timeMs);
      state.replayTimers.push(timer);
    });

    setHostText("Replaying arrangement.", "Stop All cancels the replay immediately.");
    renderTransport();
    updateDisplay();
  }

  function applyReplayEvent(event) {
    if (!state.replaying) return;
    if (event.type === "snapshot") {
      Object.entries(event.levels || {}).forEach(([id, value]) => setChannelLevel(id, Number(value), false));
      state.channelMuted = new Set(event.muted || []);
      state.channelSolo = new Set(event.solo || []);
      updateFaderButtons();
      state.audio.updateAllChannels();
    }
    if (event.type === "section-select") queueOrStartSection(event.section, false);
    if (event.type === "level") setChannelLevel(event.channel, event.value, false);
    if (event.type === "mute") setChannelMute(event.channel, event.enabled, false);
    if (event.type === "solo") setChannelSolo(event.channel, event.enabled, false);
    if (event.type === "knob") applyKnobValue(event.id, event.value);
  }

  function clearReplayTimers() {
    state.replayTimers.forEach(timer => clearTimeout(timer));
    state.replayTimers = [];
    state.replaying = false;
  }

  function setChannelLevel(id, value, capture = false) {
    state.channelValues.set(id, value);
    const root = dom.faderGrid.querySelector(`[data-channel="${id}"]`);
    if (root) {
      root.querySelector(".channel-fader").value = value;
      root.querySelector(".channel-value").textContent = Math.round(value * 100);
    }
    state.audio.updateChannel(id);
    if (capture) recordEvent("level", { channel: id, value });
  }

  function toggleChannelMute(id, capture = false) {
    setChannelMute(id, !state.channelMuted.has(id), capture);
  }

  function setChannelMute(id, enabled, capture = false) {
    if (enabled) state.channelMuted.add(id);
    else state.channelMuted.delete(id);
    updateFaderButtons();
    state.audio.updateAllChannels();
    if (capture) recordEvent("mute", { channel: id, enabled });
  }

  function toggleChannelSolo(id, capture = false) {
    setChannelSolo(id, !state.channelSolo.has(id), capture);
  }

  function setChannelSolo(id, enabled, capture = false) {
    if (enabled) state.channelSolo.add(id);
    else state.channelSolo.delete(id);
    updateFaderButtons();
    state.audio.updateAllChannels();
    if (capture) recordEvent("solo", { channel: id, enabled });
  }

  function updateFaderButtons() {
    dom.faderGrid.querySelectorAll(".fader-channel").forEach(root => {
      const id = root.dataset.channel;
      const mute = root.querySelector(".mute-button");
      const solo = root.querySelector(".solo-button");
      if (mute) {
        const active = state.channelMuted.has(id);
        mute.classList.toggle("active", active);
        mute.setAttribute("aria-pressed", String(active));
      }
      if (solo) {
        const active = state.channelSolo.has(id);
        solo.classList.toggle("active", active);
        solo.setAttribute("aria-pressed", String(active));
      }
    });
  }

  function applyKnobValue(id, value) {
    state.knobValues.set(id, value);
    const root = dom.knobGrid.querySelector(`[data-knob="${id}"]`);
    if (root) {
      root.querySelector(".knob-input").value = value;
      root.querySelector(".knob-value").textContent = Math.round(value * 100);
      setKnobVisual(root.querySelector(".knob-cap"), value);
    }
    if (id === "glow") document.documentElement.style.setProperty("--pad-glow", value.toFixed(2));
    else state.audio.updateKnob(id, value);
  }

  async function queueOrStartSection(sectionId, capture = false) {
    if (state.mode !== "build") return;
    if (capture) recordEvent("section-select", { section: sectionId });
    if (!state.isPlaying) {
      await startSection(sectionId, false);
      return;
    }
    state.queuedSection = sectionId;
    void getSectionData(sectionId);
    updatePadStates();
    updateDisplay();
    setHostText(`${sectionLabel(sectionId)} is queued.`, "It will enter when the current section finishes.");
  }

  async function getSectionData(sectionId) {
    const key = `${state.pack.id}:${sectionId}`;
    if (state.sectionCache.has(key)) return state.sectionCache.get(key);
    const tracks = state.pack.tracks?.[sectionId] || [];
    const groups = new Map();
    const failed = [];
    let loaded = 0;

    if (tracks.length) {
      await Promise.all(tracks.map(async track => {
        try {
          const url = resolveProjectAsset(track.path);
          const buffer = await state.audio.decode(url);
          const family = normalizeFamily(track.family || track.instrument);
          if (!groups.has(family)) groups.set(family, []);
          groups.get(family).push(buffer);
          loaded += 1;
        } catch (error) {
          failed.push(track.path || "Unknown audio file");
          console.warn(error.message);
        }
      }));
    }

    const data = loaded
      ? { type: "stems", groups, duration: Math.max(...[...groups.values()].flat().map(buffer => buffer.duration)), loaded }
      : { type: "demo", duration: demoSectionDuration(sectionId), loaded: 0 };

    state.demoMode = data.type === "demo";
    if (tracks.length && failed.length === tracks.length) {
      state.audioError = "Backing tracks are unavailable. Piano and pads are still ready.";
    } else if (failed.length) {
      state.audioError = `${failed.length} backing track${failed.length === 1 ? "" : "s"} could not load.`;
    } else if (state.audio?.ctx?.state === "running") {
      state.audioError = "";
    }
    state.sectionCache.set(key, data);
    updateAudioStatus();
    return data;
  }

  function normalizeFamily(value) {
    const text = String(value).toLowerCase();
    if (text.includes("guitar")) return "guitar";
    if (text.includes("banjo")) return "banjo";
    if (text.includes("bass")) return "bass";
    if (text.includes("fiddle")) return "fiddle";
    if (text.includes("mando")) return "mandolin";
    if (text.includes("djembe")) return "djembe";
    if (text.includes("shaker")) return "shaker";
    return text;
  }

  function demoSectionDuration(sectionId) {
    const bars = sectionId === "intro-fill" ? 2 : sectionId === "outro" ? 4 : 8;
    return bars * 4 * 60 / state.pack.bpm;
  }

  async function startSection(sectionId, capture = false, scheduledTime = null) {
    if (!(await state.audio.ensure())) return;
    if (capture) recordEvent("section-select", { section: sectionId });
    const data = await getSectionData(sectionId);
    const startAt = scheduledTime ?? state.audio.ctx.currentTime + 0.08;
    stopCurrentSources(startAt);
    state.currentSection = sectionId;
    state.queuedSection = null;
    state.currentStart = startAt;
    state.currentDuration = data.duration;
    state.currentEnd = startAt + data.duration;
    state.isPlaying = true;
    state.paused = false;

    if (data.type === "stems") {
      data.groups.forEach((buffers, family) => {
        const destination = state.audio.channelGains.get(family) || state.audio.musicBus;
        buffers.forEach(buffer => state.sources.push(state.audio.playBuffer(buffer, destination, startAt)));
      });
    } else {
      scheduleDemoSection(sectionId, startAt, data.duration);
    }

    scheduleBoundary();
    updateAllUI();
    setHostReaction(sectionId.includes("chorus") ? "celebrate" : "groove");
  }

  function scheduleDemoSection(sectionId, startAt, duration) {
    const beat = 60 / state.pack.bpm;
    const totalBeats = Math.floor(duration / beat);
    const rootMidi = { A: 57, Bb: 58, E: 52 }[state.pack.key] || 57;
    const progressions = {
      intro: [0, 5, 7, 0], "intro-fill": [0, 7], "verse-1": [0, 0, 5, 0, 7, 5, 0, 0],
      "verse-2": [0, 5, 0, 7, 0, 5, 7, 0], "verse-3": [0, 7, 5, 0, 5, 7, 0, 0],
      chorus: [0, 5, 0, 7, 0, 5, 7, 0], "chorus-1": [0, 5, 0, 7, 0, 5, 7, 0],
      bridge: [5, 5, 0, 0, 7, 7, 0, 0], outro: [0, 5, 7, 0]
    };
    const chords = progressions[sectionId] || progressions["verse-1"];

    for (let index = 0; index < totalBeats; index += 1) {
      const time = startAt + index * beat;
      const beatInBar = index % 4;
      const chordOffset = chords[Math.floor(index / 4) % chords.length] || 0;
      if (!isChannelSilenced("djembe")) {
        if (beatInBar === 0 || beatInBar === 2) state.audio.percussion("kick", 0.6, time);
        if (beatInBar === 1 || beatInBar === 3) state.audio.percussion("snare", 0.42, time);
      }
      if (!isChannelSilenced("shaker")) {
        state.audio.percussion("shaker", 0.19, time);
        state.audio.percussion("shaker", 0.13, time + beat * 0.5);
      }
      if (!isChannelSilenced("bass") && (beatInBar === 0 || beatInBar === 2)) scheduleDemoPluck(rootMidi + chordOffset - 12, time, 0.34, "bass");
      if (!isChannelSilenced("guitar")) [0, 4, 7].forEach((interval, step) => scheduleDemoPluck(rootMidi + chordOffset + interval, time + step * 0.018, 0.13, "guitar"));
      if (!isChannelSilenced("banjo") && index % 2 === 0) [12, 7, 16, 12].forEach((interval, step) => scheduleDemoPluck(rootMidi + chordOffset + interval, time + step * beat * 0.22, 0.09, "banjo"));
      if (!isChannelSilenced("mandolin") && beatInBar === 1) [12, 16, 19].forEach((interval, step) => scheduleDemoPluck(rootMidi + chordOffset + interval, time + step * 0.015, 0.08, "mandolin"));
      if (!isChannelSilenced("fiddle") && (sectionId.includes("chorus") || sectionId === "bridge") && index % 2 === 1) scheduleDemoPluck(rootMidi + chordOffset + 19 + (index % 4 === 1 ? 2 : 0), time, 0.15, "fiddle");
    }
  }

  function isChannelSilenced(id) {
    const soloActive = state.channelSolo.size > 0;
    return state.channelMuted.has(id) || (soloActive && !state.channelSolo.has(id));
  }

  function scheduleDemoPluck(midi, time, amount, family) {
    const oscillator = state.audio.trackNode(state.audio.ctx.createOscillator());
    const gain = state.audio.ctx.createGain();
    const filter = state.audio.ctx.createBiquadFilter();
    oscillator.type = family === "bass" ? "triangle" : family === "fiddle" ? "sawtooth" : "triangle";
    oscillator.frequency.value = state.audio.midiToFrequency(midi);
    filter.type = "lowpass";
    filter.frequency.value = family === "bass" ? 800 : family === "fiddle" ? 3500 : 2400;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(amount, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + (family === "fiddle" ? 0.42 : 0.22));
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(state.audio.channelGains.get(family) || state.audio.musicBus);
    oscillator.start(time);
    oscillator.stop(time + 0.5);
    state.sources.push(oscillator);
  }

  function scheduleBoundary() {
    clearTimeout(state.boundaryTimer);
    if (!state.isPlaying || state.paused || !state.audio?.ctx) return;
    const waitMs = Math.max(0, (state.currentEnd - state.audio.ctx.currentTime) * 1000);
    state.boundaryTimer = setTimeout(handleSectionBoundary, waitMs);
  }

  async function handleSectionBoundary() {
    if (!state.isPlaying) return;
    if (state.queuedSection) {
      const next = state.queuedSection;
      state.queuedSection = null;
      await startSection(next, false, state.currentEnd);
      return;
    }
    if (state.loopCurrent && state.currentSection) {
      await startSection(state.currentSection, false, state.currentEnd);
      return;
    }
    state.replaying = false;
    await stopPlaybackAtBoundary();
    setHostText("Section complete.", "Choose another section or turn on Loop Current.");
  }

  async function stopPlaybackAtBoundary() {
    clearTimeout(state.boundaryTimer);
    state.boundaryTimer = null;
    state.isPlaying = false;
    state.paused = false;
    state.currentSection = null;
    state.queuedSection = null;
    state.sources = [];
    updateAllUI();
  }

  function stopCurrentSources(at = null) {
    const time = at ?? state.audio?.ctx?.currentTime ?? 0;
    state.sources.forEach(source => {
      try { source.stop(time); } catch (error) { /* already ended */ }
    });
    state.sources = [];
  }

  async function stopAllPlayback(options = {}) {
    const { keepMessage = false } = options;
    clearTimeout(state.boundaryTimer);
    state.boundaryTimer = null;
    clearReplayTimers();
    stopMetronome();
    stopFreeLoopPlayback(false);
    stopChallenge(true);
    clearGuideTimers();

    if (state.audio?.ctx && state.audio.ctx.state !== "running") { try { await state.audio.ctx.resume(); } catch (error) { /* Safari may require a new tap */ } }
    if (state.audio?.ctx) {
      stopCurrentSources(state.audio.ctx.currentTime + 0.01);
      state.audio.stopAllNodes(state.audio.ctx.currentTime + 0.01);
    }

    state.activeNotes.forEach(voice => state.audio?.noteOff(voice, true));
    state.sustainedNotes.forEach(voice => state.audio?.noteOff(voice, true));
    state.activeNotes.clear();
    state.sustainedNotes.clear();
    state.activeComputerKeys.clear();
    state.isPlaying = false;
    state.paused = false;
    state.currentSection = null;
    state.queuedSection = null;
    state.currentStart = 0;
    state.currentEnd = 0;
    state.currentDuration = 0;
    state.replaying = false;
    dom.pianoKeyboard.querySelectorAll(".piano-key.active").forEach(key => key.classList.remove("active"));
    updateAllUI();
    if (!keepMessage) setHostReaction("stopped");
  }

  function updateArrangementLog() {
    dom.arrangementLog.innerHTML = "";
    const sectionEvents = state.arrangement.filter(event => event.type === "section-select");
    if (!sectionEvents.length) {
      dom.arrangementLog.innerHTML = '<span class="empty-log">Choose Capture Arrangement, then launch sections.</span>';
      return;
    }
    sectionEvents.forEach((event, index) => {
      const chip = document.createElement("span");
      chip.className = "arrangement-chip";
      chip.textContent = `${String(index + 1).padStart(2, "0")} ${sectionLabel(event.section)}`;
      dom.arrangementLog.append(chip);
    });
    const mixCount = state.arrangement.filter(event => ["level", "mute", "solo", "knob"].includes(event.type)).length;
    if (mixCount) {
      const chip = document.createElement("span");
      chip.className = "arrangement-chip mix-chip";
      chip.textContent = `${mixCount} mixer changes`;
      dom.arrangementLog.append(chip);
    }
  }

  function updatePadStates() {
    dom.padGrid.querySelectorAll(".performance-pad").forEach(button => {
      button.classList.toggle("active", state.mode === "build" && button.dataset.pad === state.currentSection);
      button.classList.toggle("queued", state.mode === "build" && button.dataset.pad === state.queuedSection);
    });
  }

  function updateDisplay() {
    const modeLabels = { build: "BUILD A BAND", free: "FREE PLAY", lick: "PLAY THE LICK" };
    dom.displayMode.textContent = modeLabels[state.mode];
    dom.displayTempo.textContent = `${state.mode === "lick" && state.challenge ? state.challenge.bpm : state.pack.bpm} BPM`;
    dom.displayPack.textContent = `${state.pack.key} · ${state.pack.title.toUpperCase()}`;

    if (state.mode === "free") {
      dom.displayCurrent.textContent = "KEYBOARD LIVE";
      dom.displayNext.textContent = "NO BACKING TRACK";
      return;
    }
    if (state.mode === "lick") {
      dom.displayCurrent.textContent = state.challenge?.running ? "PHRASE LIVE" : (state.challenge?.difficulty || "READY").toUpperCase();
      dom.displayNext.textContent = state.challenge?.practice ? "PRACTICE MODE" : "SCORING ON";
      return;
    }

    if (state.captureActive) dom.displayCurrent.textContent = "CAPTURING";
    else if (state.replaying) dom.displayCurrent.textContent = "REPLAYING";
    else if (state.paused) dom.displayCurrent.textContent = "PAUSED";
    else dom.displayCurrent.textContent = state.currentSection ? sectionLabel(state.currentSection).toUpperCase() : "READY";

    if (state.queuedSection) dom.displayNext.textContent = `NEXT: ${sectionLabel(state.queuedSection).toUpperCase()}`;
    else if (state.loopCurrent && state.currentSection) dom.displayNext.textContent = "LOOP CURRENT ON";
    else dom.displayNext.textContent = state.currentSection ? "STOPS AFTER SECTION" : "SELECT A SECTION";
  }

  function updateAudioStatus() {
    if (dom.audioStatus) {
      if (state.audioError) dom.audioStatus.textContent = state.audioError;
      else if (!state.audioReady) dom.audioStatus.textContent = "Tap to enable Studio sound";
      else dom.audioStatus.textContent = state.demoMode ? "Sound ready · demo instruments" : "Sound ready · backing tracks loaded";
    }
    if (dom.mobileAudioStatus) {
      if (state.audioError) dom.mobileAudioStatus.textContent = "Sound needs tap";
      else if (!state.audioReady) dom.mobileAudioStatus.textContent = "Sound off";
      else dom.mobileAudioStatus.textContent = "Sound ready";
    }
  }

  function updateAllUI() {
    updatePadStates();
    updateDisplay();
    renderTransport();
    updateArrangementLog();
    updateMobileCoach();
  }

  function animateProgress() {
    const frame = () => {
      let progress = 0;
      if (state.isPlaying && !state.paused && state.currentDuration && state.audio?.ctx) {
        progress = (state.audio.ctx.currentTime - state.currentStart) / state.currentDuration;
      }
      dom.displayMeterFill.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function highlightScale(enabled) {
    const root = keyPitchClass(state.pack.key);
    const scale = [0, 2, 4, 5, 7, 9, 11].map(interval => (root + interval) % 12);
    dom.pianoKeyboard.querySelectorAll(".piano-key").forEach(key => {
      key.classList.toggle("highlight", enabled && scale.includes(Number(key.dataset.baseMidi) % 12));
    });
  }

  function keyPitchClass(key) {
    return { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 }[key] ?? 0;
  }

  function setupChallenge() {
    const difficulty = CHALLENGE_DIFFICULTY[state.pack.id] || CHALLENGE_DIFFICULTY["02-110-A"];
    const notes = difficulty.notes.map((midi, index) => ({ midi, beat: index, hit: false, missed: false }));
    state.challenge = { running: false, practice: false, difficulty: difficulty.label, notes, startAt: 0, score: 0, combo: 0, bpm: difficulty.bpm, travelBeats: 4, timers: [], raf: null };
    updateKeyboardMapping();
    renderChallengeNotes();
    updateChallengeReadout(`${difficulty.label} · Ready`);
    setHostText(`${difficulty.label} phrase selected.`, "The keyboard map stays the same. Harder phrases simply use more of it.");
  }

  function renderChallengeNotes() {
    dom.noteHighway.innerHTML = "";
    if (!state.challenge) return;
    state.challenge.notes.forEach((note, index) => {
      const block = document.createElement("span");
      block.className = "falling-note";
      block.dataset.index = String(index);
      block.dataset.midi = String(note.midi);
      block.style.setProperty("--note-color", PAD_COLORS[index % PAD_COLORS.length]);
      block.textContent = midiName(note.midi);
      dom.noteHighway.append(block);
    });
    requestAnimationFrame(positionChallengeNotes);
  }

  function positionChallengeNotes() {
    if (!state.challenge || !dom.noteHighway || !dom.pianoKeyboard) return;
    const highwayRect = dom.noteHighway.getBoundingClientRect();
    if (!highwayRect.width) return;
    state.challenge.notes.forEach((note, index) => {
      const block = dom.noteHighway.querySelector(`[data-index="${index}"]`);
      const key = dom.pianoKeyboard.querySelector(`[data-base-midi="${note.midi}"]`);
      if (!block || !key) return;
      const keyRect = key.getBoundingClientRect();
      const width = Math.max(30, Math.min(74, keyRect.width * (key.classList.contains("black") ? 0.92 : 0.7)));
      const center = keyRect.left + keyRect.width / 2 - highwayRect.left;
      block.style.left = `${center - width / 2}px`;
      block.style.width = `${width}px`;
    });
  }

  async function startChallenge() {
    await stopAllPlayback({ keepMessage: true });
    if (!(await state.audio.ensure())) return;
    if (!state.challenge) setupChallenge();
    const challenge = state.challenge;
    challenge.running = true;
    challenge.score = 0;
    challenge.combo = 0;
    challenge.notes.forEach(note => { note.hit = false; note.missed = false; });
    challenge.startAt = state.audio.ctx.currentTime + 4 * 60 / challenge.bpm;
    updateChallengeReadout("Count in");
    setHostReaction("count");
    const beat = 60 / challenge.bpm;
    for (let index = 0; index < 4; index += 1) state.audio.click(state.audio.ctx.currentTime + 0.08 + index * beat, index === 0);
    const delay = Math.max(0, (challenge.startAt - state.audio.ctx.currentTime) * 1000);
    challenge.timers.push(setTimeout(() => { updateChallengeReadout("Play"); setHostReaction("groove"); }, delay));
    const finishBeat = Math.max(...challenge.notes.map(note => note.beat)) + 2;
    challenge.timers.push(setTimeout(finishChallenge, delay + finishBeat * beat * 1000));
    animateChallenge();
    updateAllUI();
  }

  function animateChallenge() {
    const challenge = state.challenge;
    if (!challenge?.running) return;
    const beat = 60 / challenge.bpm;
    const elapsed = (state.audio.ctx.currentTime - challenge.startAt) / beat;
    const height = dom.noteHighway.clientHeight || 160;
    challenge.notes.forEach((note, index) => {
      const block = dom.noteHighway.querySelector(`[data-index="${index}"]`);
      const distance = note.beat - elapsed;
      const normalized = 1 - distance / challenge.travelBeats;
      const y = normalized * height * 0.82;
      if (block) {
        block.style.transform = `translateY(${y}px)`;
        block.style.opacity = note.hit || note.missed ? "0.15" : normalized < -0.1 || normalized > 1.25 ? "0" : "1";
      }
      if (!note.hit && !note.missed && elapsed - note.beat > 0.32) {
        note.missed = true;
        if (!challenge.practice) {
          challenge.combo = 0;
          updateChallengeReadout("Miss");
        }
      }
    });
    challenge.raf = requestAnimationFrame(animateChallenge);
  }

  function judgeChallengeNote(midi) {
    const challenge = state.challenge;
    if (!challenge?.running) return;
    const beat = 60 / challenge.bpm;
    const elapsed = (state.audio.ctx.currentTime - challenge.startAt) / beat;
    const candidates = challenge.notes
      .map(note => ({ note, delta: Math.abs(note.beat - elapsed) }))
      .filter(item => !item.note.hit && !item.note.missed && item.note.midi === midi)
      .sort((a, b) => a.delta - b.delta);

    if (!candidates.length) {
      if (!challenge.practice) { challenge.combo = 0; updateChallengeReadout("Outside"); }
      return;
    }

    const candidate = candidates[0];
    if (candidate.delta > 0.42) {
      if (!challenge.practice) { challenge.combo = 0; updateChallengeReadout(candidate.note.beat > elapsed ? "Early" : "Late"); }
      return;
    }

    candidate.note.hit = true;
    let judgment = "Good";
    let points = 70;
    if (candidate.delta < 0.13) { judgment = "Perfect"; points = 100; }
    if (!challenge.practice) {
      challenge.combo += 1;
      challenge.score += points * Math.max(1, Math.floor(challenge.combo / 4) + 1);
    }
    updateChallengeReadout(judgment);
  }

  function updateChallengeReadout(judgment) {
    if (!state.challenge) return;
    dom.lickScore.textContent = `Score ${String(state.challenge.score).padStart(4, "0")}`;
    dom.lickCombo.textContent = `Combo ${state.challenge.combo}`;
    dom.lickJudgment.textContent = judgment;
  }

  function finishChallenge() {
    const challenge = state.challenge;
    if (!challenge?.running) return;
    stopChallenge(false);
    const percent = Math.round(challenge.notes.filter(note => note.hit).length / challenge.notes.length * 100);
    updateChallengeReadout(`${percent}%`);
    if (percent >= 75) setHostReaction("celebrate");
    else setHostReaction("encourage");
    renderTransport();
  }

  function stopChallenge(reset = false) {
    const challenge = state.challenge;
    if (!challenge) return;
    challenge.running = false;
    challenge.timers.forEach(timer => clearTimeout(timer));
    challenge.timers = [];
    cancelAnimationFrame(challenge.raf);
    if (reset) {
      challenge.notes.forEach(note => { note.hit = false; note.missed = false; });
      renderChallengeNotes();
      updateChallengeReadout("Ready");
    }
  }

  function changeChallengeTempo(delta) {
    if (!state.challenge) setupChallenge();
    state.challenge.bpm = Math.max(70, Math.min(160, state.challenge.bpm + delta));
    updateDisplay();
    setHostText(`Challenge tempo: ${state.challenge.bpm} BPM.`, "Start the phrase when you are ready.");
  }

  function togglePracticeMode() {
    if (!state.challenge) setupChallenge();
    state.challenge.practice = !state.challenge.practice;
    setHostText(state.challenge.practice ? "Practice mode is on." : "Scoring is back on.", state.challenge.practice ? "Missed notes will not reset the score." : "Perfect and Good timing build your score.");
    renderTransport();
    updateDisplay();
  }

  async function playChallengeGuide() {
    if (!state.challenge) setupChallenge();
    if (!(await state.audio.ensure())) return;
    clearGuideTimers();
    const beat = 60 / state.challenge.bpm;
    const start = state.audio.ctx.currentTime + 0.12;
    state.challenge.notes.forEach(note => {
      const timer = setTimeout(() => {
        const voice = state.audio.noteOn(note.midi, 0.5);
        const offTimer = setTimeout(() => state.audio.noteOff(voice), beat * 420);
        state.guideTimers.push(offTimer);
      }, Math.max(0, (start + note.beat * beat - state.audio.ctx.currentTime) * 1000));
      state.guideTimers.push(timer);
    });
    setHostText("Listen for the shape of the phrase.", "Stop All cancels the guide immediately.");
  }

  function clearGuideTimers() {
    state.guideTimers.forEach(timer => clearTimeout(timer));
    state.guideTimers = [];
  }

  function setupFallbacks() {
    [[dom.hostCharacter, dom.hostFallback], [dom.doonCharacter, dom.doonFallback]].forEach(([image, fallback]) => {
      image.addEventListener("load", () => { image.hidden = false; fallback.hidden = true; });
      image.addEventListener("error", () => { image.hidden = true; fallback.hidden = false; });
    });
  }

  function setCharacterState(andrewState = "idle", doonState = "idle") {
    const andrewFile = CHARACTER_ASSETS.andrew[andrewState] || CHARACTER_ASSETS.andrew.idle;
    const doonFile = CHARACTER_ASSETS.doon[doonState] || CHARACTER_ASSETS.doon.idle;
    if (state.characterState.andrew !== andrewState) {
      state.characterState.andrew = andrewState;
      dom.hostCharacter.src = resolveCharacterAsset(andrewFile);
    }
    if (state.characterState.doon !== doonState) {
      state.characterState.doon = doonState;
      dom.doonCharacter.src = resolveCharacterAsset(doonFile);
    }
  }

  function setHostText(message, submessage) {
    dom.hostMessage.textContent = message;
    dom.hostSubmessage.textContent = submessage;
  }

  function setHostReaction(reaction) {
    const reactions = {
      idle: { andrew: "idle", doon: "idle", message: MODE_COPY[state.mode].message, submessage: MODE_COPY[state.mode].submessage },
      listening: { andrew: "listening", doon: "idle", message: "That note is in the room.", submessage: "Use the highlighted scale notes or play freely." },
      groove: { andrew: "idle", doon: "bounce", message: "The band is moving.", submessage: "Bring instruments in and out with the mixer." },
      count: { andrew: "count", doon: "bounce", message: "One, two, ready, play.", submessage: "Watch the note highway and stay with the pulse." },
      celebrate: { andrew: "celebrate", doon: "jump", message: "That landed.", submessage: "Try another section or capture the arrangement." },
      encourage: { andrew: "listening", doon: "idle", message: "Stay with the pulse.", submessage: "Use Slower or Hear Guide, then take another run." },
      stopped: { andrew: "idle", doon: "idle", message: "Everything is stopped.", submessage: "Choose a section or play a note when you are ready." }
    };
    const selected = reactions[reaction] || reactions.idle;
    setCharacterState(selected.andrew, selected.doon);
    setHostText(selected.message, selected.submessage);
  }

  function sectionLabel(id) {
    return id.replace(/-/g, " ").replace(/\b\w/g, character => character.toUpperCase());
  }

  function midiName(midi) {
    const names = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
    return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
  }

  window.addEventListener("DOMContentLoaded", boot);
})();
