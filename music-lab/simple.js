import { Sound } from './sound.js';
import { lessons } from './lessons.js';

const $ = id => document.getElementById(id);
const sound = new Sound(), song = new Audio();
song.preload = 'metadata';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const names = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const shortcuts = ['a','w','s','e','d','f','t','g','y','h','u','j'];
let activity = '', base = 60, generation = 0, beat = null, lesson = null, slow = true;
let loopEvents = [], loopBpm = 100, isOverdub = false, tutorialIndex = -1;
let lastFeedback = '', lastReact = 0, reactionTimer;
const held = new Map(), keyButtons = new Map(), seenTutorials = new Set();
const info = {
  piano: ['Play piano', 'Tap a key. Try a few together.'],
  beats: ['Make a beat', 'Try the pads, then record your own rhythm.'],
  lick: ['Learn a lick', 'A lick is a short musical phrase you can play along with the band.'],
};
const tutorials = {
  piano: [
    ['Play a note', 'Tap the named keys. You can hold more than one at a time.', 'keyboard'],
    ['Explore higher or lower notes', 'Lower and Higher move the keyboard by an octave. Volume changes how loud it plays.', 'pianoControls'],
    ['Join the band', 'Play with a song opens three recordings. Choose one, press Play song, and try your own notes.', 'withSong'],
  ],
  beats: [
    ['Try the four pads', 'Each pad is a different drum sound. Hear a beat plays an example you can change.', 'pads'],
    ['Record two bars', 'Press Record my beat. Wait for four clicks, then tap for eight beats. Your rhythm repeats automatically.', 'record'],
    ['Build on your rhythm', 'Add sounds lets you record more taps over the loop. Start over clears it. Tempo and extra drums are below the pads.', 'beatSettings'],
  ],
  lick: [
    ['Hear four notes', 'Hear it plays the phrase and lights the keys. Watch where the notes land.', 'hear'],
    ['Try it yourself', 'Practice it gives you four clicks, then shows which keys to tap. It keeps going if you miss one. Slower gives you more time.', 'practice'],
    ['Play with the band', 'Play with the song starts the whole recording. Follow the cues when they arrive, then listen or make up your own notes between phrases.', 'along'],
  ],
};
function status(text) { if (text !== lastFeedback) { $('status').textContent = text; lastFeedback = text; } }
function react() {
  if (reduced.matches || performance.now() - lastReact < 500) return;
  lastReact = performance.now(); const characters = document.querySelector('.characters');
  characters.classList.remove('react'); void characters.offsetWidth; characters.classList.add('react');
  $('andrew').src = '../assets/characters/flannel-celebrate.webp';
  clearTimeout(reactionTimer); reactionTimer = setTimeout(() => { $('andrew').src = '../assets/characters/flannel-idle.webp'; }, 900);
}
function motionPreference() {
  document.body.classList.toggle('reduced', reduced.matches);
  document.querySelector('.lane-hint').textContent = reduced.matches ? 'Play each key as it lights up.' : 'Play the lit key when its note reaches the line.';
}
reduced.addEventListener('change', motionPreference); motionPreference();
async function unlock() { try { await sound.unlock(); return true; } catch (error) { status(error.message || 'Tap again to enable audio.'); return false; } }
function releaseHeld() { for (const release of held.values()) release?.(); held.clear(); keyButtons.forEach(key => key.classList.remove('active')); }
function stopAll(message = 'All sound stopped. You can start again whenever you like.') {
  generation++; beat = null; lesson = null; releaseHeld(); sound.stop(); song.pause();
  $('songPlay').textContent = 'Play song'; $('loopPlay').textContent = 'Play';
  $('record').textContent = 'Record my beat'; $('tempo').disabled = false;
  $('notes').replaceChildren(); keyButtons.forEach(key => key.classList.remove('target','demo'));
  document.querySelectorAll('#beatDots i').forEach(dot => dot.classList.remove('lit'));
  $('beatReadout').textContent = 'Two bars · 8 beats';
  ['hear','practice','along'].forEach(id => $(id).setAttribute('aria-pressed','false'));
  if (message) status(message);
}
function clearTutorialTarget() { document.querySelectorAll('.tutorial-target').forEach(el => el.classList.remove('tutorial-target')); }
function promptTutorial() {
  clearTutorialTarget(); tutorialIndex = -1; $('tutorial').hidden = false;
  $('tutorialTitle').textContent = 'Want a quick walkthrough?'; $('tutorialCopy').hidden = true;
  $('tutorialNext').textContent = 'Show me'; $('tutorialSkip').textContent = 'Start playing';
}
function closeTutorial() { $('tutorial').hidden = true; clearTutorialTarget(); seenTutorials.add(activity); }
$('tutorialSkip').onclick = closeTutorial;
$('tutorialNext').onclick = () => {
  clearTutorialTarget(); tutorialIndex++;
  if (tutorialIndex >= tutorials[activity].length) { closeTutorial(); return; }
  const [title, copy, target] = tutorials[activity][tutorialIndex];
  $('tutorialTitle').textContent = `${tutorialIndex + 1} of 3 · ${title}`;
  $('tutorialCopy').hidden = false; $('tutorialCopy').textContent = copy;
  $(target).classList.add('tutorial-target'); $('tutorialNext').textContent = tutorialIndex === 2 ? 'Start playing' : 'Next';
  $('tutorialSkip').textContent = 'Skip walkthrough';
};
$('help').onclick = () => { promptTutorial(); $('tutorialNext').focus(); };
$('stop').onclick = () => stopAll();
function selectActivity(value) {
  stopAll(''); activity = value; base = 60;
  document.body.classList.add('in-activity'); $('chooser').hidden = true; $('workspace').hidden = false;
  $('homeLink').hidden = true; ['back','help','stop'].forEach(id => $(id).hidden = false);
  $('activityTitle').textContent = info[value][0]; $('instruction').textContent = info[value][1];
  $('pianoControls').hidden = value !== 'piano'; $('lessonControls').hidden = value !== 'lick';
  $('keysArea').hidden = value === 'beats'; $('beatsArea').hidden = value !== 'beats';
  $('lane').hidden = value !== 'lick'; $('songArea').hidden = value !== 'lick'; $('songPlay').hidden = value === 'lick';
  $('withSong').setAttribute('aria-expanded','false'); $('songProgressRow').hidden = true;
  $('loopControls').hidden = !loopEvents.length;
  renderKeyboard(); status(value === 'lick' ? 'Start with Hear it. You will hear four notes before trying them yourself.' : 'Ready when you are.');
  if (!seenTutorials.has(value)) promptTutorial(); else closeTutorial();
  window.scrollTo(0,0); $('back').focus({preventScroll:true});
}
document.querySelectorAll('[data-activity]').forEach(button => button.onclick = () => selectActivity(button.dataset.activity));
$('back').onclick = () => {
  const old = activity; stopAll(''); closeTutorial(); activity = '';
  document.body.classList.remove('in-activity'); $('chooser').hidden = false; $('workspace').hidden = true;
  $('homeLink').hidden = false; ['back','help','stop'].forEach(id => $(id).hidden = true);
  $('activityTitle').textContent = 'Music Lab'; document.querySelector(`[data-activity="${old}"]`).focus();
};
$('volume').oninput = e => sound.setVolume(Number(e.target.value));

// Keyboard pointer capture keeps independent fingers sounding until each is released.
async function pressNote(midi, token) {
  if (held.has(token)) return;
  const gen = generation; held.set(token, null);
  if (!(await unlock()) || gen !== generation || !held.has(token)) { held.delete(token); return; }
  held.set(token, sound.piano(midi)); keyButtons.get(midi)?.classList.add('active'); react();
  if (lesson && lesson.mode !== 'hear') {
    const time = lesson.mode === 'song' ? song.currentTime : sound.ctx.currentTime;
    const match = lesson.events.find(event => event.midi === midi && !event.hit && Math.abs(event.time - time) < .3);
    if (match) { match.hit = true; lesson.hits++; }
  }
}
function releaseNote(midi, token) {
  held.get(token)?.(); held.delete(token);
  if (![...held.keys()].some(key => String(key).endsWith(`:${midi}`))) keyButtons.get(midi)?.classList.remove('active');
}
function renderKeyboard() {
  releaseHeld(); $('keyboard').replaceChildren(); keyButtons.clear();
  const whites = [0,2,4,5,7,9,11];
  const labels = activity === 'lick' && currentSong().key !== 'B-flat' ? ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'] : names;
  for (let offset = 0; offset < 12; offset++) {
    const midi = base + offset, whiteIndex = whites.indexOf(offset), black = whiteIndex < 0;
    const button = document.createElement('button'); button.type = 'button'; button.className = `piano-key ${black ? 'black' : 'white'}`;
    button.textContent = labels[offset]; button.setAttribute('aria-label', `${labels[offset]}${Math.floor(midi / 12) - 1}`);
    button.dataset.midi = midi;
    const position = black ? whites.findIndex(n => n > offset) : whiteIndex;
    button.style.left = `${position * 100 / 7}%`; button.style.width = black ? '8.2%' : `${100 / 7}%`;
    if (black) button.style.transform = 'translateX(-50%)';
    button.onpointerdown = e => { e.preventDefault(); button.setPointerCapture(e.pointerId); pressNote(midi, `p${e.pointerId}:${midi}`); };
    const release = e => releaseNote(midi, `p${e.pointerId}:${midi}`);
    button.onpointerup = release; button.onpointercancel = release; button.onlostpointercapture = release;
    button.onclick = e => { if (e.detail === 0) { const token = `assist:${midi}`; pressNote(midi, token); setTimeout(() => releaseNote(midi, token), 350); } };
    $('keyboard').append(button); keyButtons.set(midi, button);
  }
  $('octaveLabel').textContent = base === 60 ? 'Middle octave' : `${base < 60 ? 'Lower' : 'Higher'} octave`;
  $('octaveDown').disabled = base <= 36; $('octaveUp').disabled = base >= 84;
}
$('octaveDown').onclick = () => { base -= 12; renderKeyboard(); };
$('octaveUp').onclick = () => { base += 12; renderKeyboard(); };
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { stopAll(); return; }
  if (!['piano','lick'].includes(activity) || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
  const offset = shortcuts.indexOf(e.key.toLowerCase());
  if (offset < 0 || e.repeat) return; e.preventDefault(); pressNote(base + offset, `k${e.code}:${base + offset}`);
});
document.addEventListener('keyup', e => {
  for (const token of [...held.keys()]) if (token.startsWith(`k${e.code}:`)) releaseNote(Number(token.split(':')[1]), token);
});
window.addEventListener('blur', releaseHeld);
document.addEventListener('visibilitychange', () => { if (document.hidden && activity) stopAll('Paused while you were away. Press play to continue.'); });

// The full recordings keep their native tempo and use the media clock for cues.
function currentSong() { return lessons[$('song').value]; }
$('withSong').onclick = () => { $('songArea').hidden = !$('songArea').hidden; $('withSong').setAttribute('aria-expanded', String(!$('songArea').hidden)); };
function setSongSource() {
  const url = new URL(currentSong().file, location.href).href;
  if (song.src !== url) { song.src = url; song.load(); }
  song.playbackRate = 1;
}
async function playSong(reset = false) {
  const gen = generation;
  if (!(await unlock()) || gen !== generation) return false;
  sound.attach(song); setSongSource(); if (reset) song.currentTime = 0;
  status('Loading the recording…');
  try {
    await song.play();
    if (gen !== generation) return false;
    $('songPlay').textContent = 'Pause song'; $('songProgressRow').hidden = false;
    status(activity === 'lick' ? 'Listen to the band. Your first four-note cue is coming.' : 'The band is playing. Try a few notes with them.'); return true;
  } catch { if (gen === generation) status('The recording could not start. Check your connection, then press play again.'); return false; }
}
$('songPlay').onclick = () => { if (!song.paused) { song.pause(); $('songPlay').textContent = 'Play song'; status('Song paused.'); } else playSong(); };
$('song').onchange = () => { stopAll('Song changed. Hear the phrase first, or start the recording.'); $('songProgressRow').hidden = true; renderKeyboard(); };
song.addEventListener('ended', () => { lesson = null; $('songPlay').textContent = 'Play song'; $('along').setAttribute('aria-pressed','false'); clearNoteVisuals(); status('That is the whole song. Play it again, or try another one.'); react(); });
song.addEventListener('error', () => { if (activity) { lesson = null; status('This recording could not load. Try again when your connection is ready.'); } });

// Beat events are recorded on the audio clock, rounded to sixteenth-note slots.
function makePad(kind, target) {
  const button = document.createElement('button'); button.className = 'pad'; button.textContent = kind; button.dataset.drum = kind;
  button.onpointerdown = e => { e.preventDefault(); button.setPointerCapture(e.pointerId); hitPad(kind); button.classList.add('active'); };
  button.onpointerup = button.onpointercancel = button.onlostpointercapture = () => button.classList.remove('active');
  button.onclick = e => { if (e.detail === 0) hitPad(kind); }; $(target).append(button);
}
['Kick','Snare','Hi-hat','Clap'].forEach(kind => makePad(kind,'pads'));
['Tom','Open hat','Shaker','Crash'].forEach(kind => makePad(kind,'extraPads'));
for (let i = 0; i < 8; i++) $('beatDots').append(document.createElement('i'));
async function hitPad(kind) {
  const gen = generation;
  if (!(await unlock()) || gen !== generation) return;
  sound.drum(kind); react();
  if (beat && sound.ctx.currentTime >= beat.start && (beat.recording || isOverdub)) {
    const position = ((sound.ctx.currentTime - beat.start) / beat.spb) % 8;
    const slot = Math.round(position * 4) % 32;
    if (!loopEvents.some(event => event.slot === slot && event.kind === kind)) loopEvents.push({ slot, kind });
  }
}
async function startBeat(recording = false) {
  stopAll(''); const gen = generation;
  if (!(await unlock()) || gen !== generation) return;
  loopBpm = Number($('tempo').value); const spb = 60 / loopBpm;
  const now = sound.ctx.currentTime + .08;
  beat = { start: now + (recording ? 4 * spb : 0), spb, recording, next: 0, count: 0, countStart: now, lastShown: -1 };
  if (recording) { loopEvents = []; isOverdub = false; $('overdub').setAttribute('aria-pressed','false'); $('record').textContent = 'Counting in…'; $('loopControls').hidden = true; }
  else { $('loopControls').hidden = false; $('loopPlay').textContent = 'Pause'; }
  $('tempo').disabled = true; status(recording ? 'Wait for four clicks. Then tap your rhythm for eight beats.' : isOverdub ? 'Your beat is looping. New taps will be added to it.' : 'Your beat is looping. Try Add sounds to build on it.');
}
$('record').onclick = () => startBeat(true);
$('preset').onclick = () => {
  loopEvents = [{slot:0,kind:'Kick'},{slot:8,kind:'Kick'},{slot:16,kind:'Kick'},{slot:24,kind:'Kick'}, {slot:4,kind:'Snare'},{slot:12,kind:'Snare'},{slot:20,kind:'Snare'},{slot:28,kind:'Snare'}, ...Array.from({length:16},(_,i)=>({slot:i*2,kind:'Hi-hat'}))];
  isOverdub = false; $('overdub').setAttribute('aria-pressed','false'); startBeat();
};
$('loopPlay').onclick = () => beat ? stopAll('Beat paused. Press Play when you are ready.') : startBeat();
$('overdub').onclick = () => {
  isOverdub = !isOverdub; $('overdub').setAttribute('aria-pressed',String(isOverdub));
  if (isOverdub && !beat) startBeat();
  status(isOverdub ? 'Adding sounds: your taps become part of the repeating beat. Tap Add sounds again to finish.' : 'Your added sounds are saved in this loop.');
};
$('clear').onclick = () => { stopAll('A fresh start. Try the pads or record a new rhythm.'); loopEvents = []; isOverdub = false; $('overdub').setAttribute('aria-pressed','false'); $('loopControls').hidden = true; };
$('tempo').oninput = () => $('tempoValue').textContent = `${$('tempo').value} BPM`;
function tickBeat(now) {
  if (!beat) return;
  const state = beat;
  if (state.recording && state.count < 4) {
    while (state.count < 4 && state.countStart + state.count * state.spb < now + .08) {
      sound.drum('Click', Math.max(now, state.countStart + state.count * state.spb)); state.count++;
    }
  }
  if (now < state.start) { $('beatReadout').textContent = `Get ready · ${Math.max(1,Math.ceil((state.start-now)/state.spb))}`; return; }
  const elapsed = (now - state.start) / state.spb, beatIndex = Math.floor(elapsed) % 8;
  if (beatIndex !== state.lastShown) {
    state.lastShown = beatIndex;
    document.querySelectorAll('#beatDots i').forEach((dot,i)=>dot.classList.toggle('lit',i===beatIndex));
    $('beatReadout').textContent = `${state.recording ? 'Recording' : 'Looping'} · ${beatIndex + 1} of 8`;
  }
  if (state.recording && elapsed < 8) {
    $('record').textContent = 'Recording…';
    while (state.next < 8 && state.start + state.next * state.spb < now + .08) { sound.drum('Click',Math.max(now,state.start+state.next*state.spb)); state.next++; }
    return;
  }
  if (state.recording) {
    state.recording = false; state.start += 8 * state.spb; state.next = 0;
    $('record').textContent = 'Record my beat'; $('loopControls').hidden = false; $('loopPlay').textContent = 'Pause';
    if (!loopEvents.length) { stopAll('No taps recorded yet. Press Record my beat and tap after the four clicks.'); $('loopControls').hidden = true; return; }
    status('That is your beat. It is looping now. Add sounds, or enjoy what you made.'); react();
  }
  // Schedule a sixteenth-note grid ahead, but always draw from the current event list.
  while (state.start + state.next * state.spb / 4 < now + .08) {
    const time = state.start + state.next * state.spb / 4;
    if (time >= now - .03) for (const event of loopEvents) if (event.slot === state.next % 32) sound.drum(event.kind,Math.max(now,time));
    state.next++;
  }
}

function clearNoteVisuals() { $('notes').replaceChildren(); keyButtons.forEach(key=>key.classList.remove('target','demo')); }
function phraseEvents(data, start, spb, phrase) {
  return data.notes.map((midi,i)=>({midi,name:data.names[i],time:start+data.beats[i]*spb,duration:data.durationBeats*spb,phrase,scheduled:false,hit:false}));
}
async function startLesson(mode) {
  stopAll(''); const gen = generation;
  if (!(await unlock()) || gen !== generation) return;
  const data = currentSong(), spb = 60 / data.bpm / (slow ? .65 : 1);
  base = data.keyboardBase; renderKeyboard();
  ['hear','practice','along'].forEach(id=>$(id).setAttribute('aria-pressed',String(id === ({hear:'hear',practice:'practice',song:'along'})[mode])));
  if (mode === 'song') {
    const events = data.entries.flatMap((time,i)=>phraseEvents(data,time,60/data.bpm,i));
    lesson = { mode, events, hits:0, completed:-1, lastCount:-1 };
    if (!(await playSong(true)) && gen === generation) { lesson = null; $('along').setAttribute('aria-pressed','false'); }
  } else {
    const start = sound.ctx.currentTime + .1, first = start + 4 * spb;
    lesson = { mode, start, first, spb, events:phraseEvents(data,first,spb,0), cycle:0, hits:0, completed:-1, lastCount:-1, count:0 };
    status(mode === 'hear' ? 'Listen after four clicks. The pink keys show the phrase.' : 'Four clicks, then your turn. Follow the lit keys. Missing a note is fine.');
  }
}
$('hear').onclick = () => startLesson('hear'); $('practice').onclick = () => startLesson('practice'); $('along').onclick = () => startLesson('song');
function setSpeed(value) {
  slow = value; $('slower').setAttribute('aria-pressed',String(slow)); $('original').setAttribute('aria-pressed',String(!slow));
  if (lesson && lesson.mode !== 'song') startLesson(lesson.mode);
  else status(lesson?.mode === 'song' ? 'The complete recording stays at its original speed. This setting applies to practice.' : `${slow ? 'Slower' : 'Original'} speed selected for Hear it and Practice it.`);
}
$('slower').onclick = () => setSpeed(true); $('original').onclick = () => setSpeed(false);
function tickLesson(now) {
  if (!lesson) return;
  const state = lesson, data = currentSong(), time = state.mode === 'song' ? song.currentTime : now;
  if (state.mode === 'song' && song.paused) return;
  if (state.mode !== 'song') {
    while (state.count < 4 && state.start + state.count * state.spb < now + .08) {
      sound.drum('Click',Math.max(now,state.start+state.count*state.spb)); state.count++;
    }
    const left = Math.ceil((state.first - now) / state.spb);
    if (left > 0 && left <= 4 && left !== state.lastCount) { state.lastCount = left; status(`Get ready: ${5-left} of 4`); }
    if (state.mode === 'practice' && now > state.first + 4 * state.spb) {
      state.cycle++; state.start = state.first + 4 * state.spb; state.first += 8 * state.spb;
      state.count = 0; state.lastCount = -1;
      state.events = phraseEvents(data,state.first,state.spb,state.cycle);
    }
    if (state.mode === 'hear') for (const event of state.events) if (!event.scheduled && event.time < now + .08) {
      event.scheduled = true; sound.piano(event.midi,Math.max(now,event.time),event.duration);
    }
  }
  keyButtons.forEach(key=>key.classList.remove('target','demo'));
  const visible = [];
  for (const event of state.events) {
    const distance = event.time - time;
    if (distance < .12 && distance > -event.duration) keyButtons.get(event.midi)?.classList.add(state.mode === 'hear' ? 'demo' : 'target');
    if (!reduced.matches && distance < 1.7 && distance > -.2) visible.push(event);
  }
  // Draw a few cues only, positioned directly over their matching piano key.
  const laneRect = $('lane').getBoundingClientRect(), nodes = [];
  for (const event of visible) {
    const key = keyButtons.get(event.midi), rect = key.getBoundingClientRect();
    const node = document.createElement('span'); node.className = 'falling-note'; node.textContent = event.name;
    node.style.left = `${rect.left - laneRect.left + rect.width/2 - 15}px`; node.style.width = '30px';
    node.style.transform = `translateY(${(1-(event.time-time)/1.7)*(laneRect.height-30)}px)`; nodes.push(node);
  }
  $('notes').replaceChildren(...nodes);
  const completed = state.events.filter(event=>time > event.time + event.duration + .3).map(event=>event.phrase);
  for (const phrase of new Set(completed)) {
    const events = state.events.filter(event=>event.phrase===phrase);
    if (phrase > state.completed && events.every(event=>time > event.time+event.duration+.3)) {
      state.completed = phrase;
      if (state.mode === 'hear') { status('That is the phrase. Choose Practice it to try those four notes.'); lesson = null; $('hear').setAttribute('aria-pressed','false'); clearNoteVisuals(); }
      else { status(events.some(event=>event.hit) ? 'You joined in. Keep the phrase easy and relaxed.' : state.mode === 'song' ? 'Keep listening or try your own notes. Another cue will appear when it fits.' : 'Have another go. Start with just the first note if you like.'); react(); }
    }
  }
  if (state.mode === 'song' && time > state.events.at(-1).time + 2 && state.completed === data.entries.length-1) {
    status('Your guided phrases are complete. Enjoy the rest of the song, or make up your own notes.');
  }
}
setInterval(() => {
  if (!sound.ctx || sound.ctx.state !== 'running') return;
  tickBeat(sound.ctx.currentTime);
},25);
function frame() {
  if (sound.ctx) tickLesson(sound.ctx.currentTime);
  if (!song.paused && Number.isFinite(song.duration)) {
    $('songProgress').value = song.currentTime/song.duration*100;
    $('songTime').textContent = `${Math.floor(song.currentTime/60)}:${String(Math.floor(song.currentTime%60)).padStart(2,'0')}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
