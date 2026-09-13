/* Deterministic controller checks. Run: node music-lab/tools/test-simple.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
class Element {
  constructor(id = '') {
    this.id=id; this.children=[]; this.attributes={}; this.style={}; this.dataset={}; this.hidden=false; this.value='';
    const classes=new Set(); this.classList={add:(...a)=>a.forEach(x=>classes.add(x)),remove:(...a)=>a.forEach(x=>classes.delete(x)),toggle:(x,on)=>on?classes.add(x):classes.delete(x),contains:x=>classes.has(x)};
  }
  append(el){this.children.push(el)}
  replaceChildren(...els){this.children=els}
  setAttribute(k,v){this.attributes[k]=v}
  getAttribute(k){return this.attributes[k]}
  getBoundingClientRect(){return {left:0,width:50,height:120}}
  focus(){}
  setPointerCapture(){}
  querySelector(){return this.children[1]}
}
const elements = new Map();
const el = id => { if(!elements.has(id)) elements.set(id,new Element(id)); return elements.get(id); };
const cards=['piano','beats','lick'].map(a=>{const e=new Element();e.dataset.activity=a;return e;});
el('stepSound').value='Kick'; el('song').value='05-099-Bb'; el('tempo').value='100'; el('volume').value='.65';
class AudioStub {
  constructor(){this.paused=true;this.currentTime=0;this.duration=100;this.src=''}
  load(){} addEventListener(){} pause(){this.paused=true} async play(){this.paused=false}
}
class SoundStub {
  constructor(){this.ctx={currentTime:0,state:'running'};this.calls=[];this.releases=0;this.stops=0}
  async unlock(){}
  piano(...args){this.calls.push(['piano',...args]);return ()=>this.releases++}
  drum(...args){this.calls.push(['drum',...args])}
  stop(){this.stops++} attach(){} setVolume(value){this.volume=value} setMusicVolume(value){this.musicVolume=value}
}
const listeners={};
const context=vm.createContext({
  Sound:SoundStub,Audio:AudioStub,URL,console,performance:{now:()=>1000},
  matchMedia:()=>({matches:false,addEventListener(){}}),setTimeout:()=>0,clearTimeout(){},setInterval(){},requestAnimationFrame(){},
  location:{href:'http://localhost/music-lab/'},
  document:{body:el('body'),getElementById:el,createElement:()=>new Element(),addEventListener:(name,fn)=>listeners[name]=fn,
    querySelector:s=>s.startsWith('[data-activity=')?cards.find(c=>s.includes(c.dataset.activity)):el(s),
    querySelectorAll:s=>s==='[data-activity]'?cards:s==='#beatDots i'?el('beatDots').children:[]},
  window:{scrollTo(){},addEventListener(){}},
});
vm.runInContext(fs.readFileSync(path.join(root,'lessons.js'),'utf8').replace('export const lessons','const lessons'),context);
vm.runInContext(fs.readFileSync(path.join(root,'beat-pattern.js'),'utf8').replace('export class BeatPattern','class BeatPattern'),context);
vm.runInContext(fs.readFileSync(path.join(root,'simple.js'),'utf8').replace(/^import .*;\r?\n/gm,''),context);
const run = code => vm.runInContext(code,context);
const checks=[];
async function check(name,fn){await fn();checks.push(name)}
(async()=>{
 await check('Full studio preserves the original markup apart from title and return links',()=>{
  const original=execFileSync('git',['show','d6e6c29:music-lab/index.html'],{cwd:root,encoding:'utf8'});
  const expected=original.replaceAll('../index.html#home','index.html').replaceAll('← Back to portfolio','← Back to simple Music Lab').replaceAll("Back to Andrew's portfolio",'Back to simple Music Lab').replaceAll('← Portfolio','← Music Lab').replace('<title>Andrew\'s Music Lab</title>',"<title>Full Studio | Andrew's Music Lab</title>").replaceAll('https://www.awolverton.com/music-lab/index.html','https://www.awolverton.com/music-lab/full-studio.html');
  assert.equal(fs.readFileSync(path.join(root,'full-studio.html'),'utf8').replace(/\r\n/g,'\n').trim(),expected.trim());
 });
 await check('Every preserved recording and stem in the manifest exists',()=>{
  const repo=path.resolve(root,'..'), manifest=JSON.parse(fs.readFileSync(path.join(repo,'audio/manifest.json'),'utf8'));
  for(const pack of manifest.packs){assert(fs.existsSync(path.join(repo,pack.previewMix)));for(const tracks of Object.values(pack.tracks))for(const track of tracks)assert(fs.existsSync(path.join(repo,track.path)),track.path);}
 });
 await check('All three songs have two-bar phrases with varied rhythm and sorted full-track cue times',()=>{
  for(const lesson of Object.values(run('lessons'))){assert(lesson.notes.length>=8);assert.equal(lesson.notes.length,lesson.names.length);assert.equal(lesson.notes.length,lesson.durations.length);assert.equal(lesson.lengthBeats,8); assert(lesson.notes.every(n=>n>=lesson.keyboardBase&&n<lesson.keyboardBase+12)); assert(lesson.entries.every((t,i,a)=>t>=0&&(!i||t>a[i-1])));}
 });
 await check('Each activity opens directly and tutorial skip leaves instrument usable',()=>{
  for(const mode of ['piano','beats','lick']){run(`selectActivity('${mode}')`); assert.equal(el('workspace').hidden,false); assert.equal(el('tutorial').hidden,false);run('closeTutorial()'); assert.equal(el('tutorial').hidden,true);}
 });
 await check('Tutorial has three steps, can finish and replay',()=>{
  run("selectActivity('piano'); promptTutorial()"); for(let i=0;i<3;i++)el('tutorialNext').onclick(); assert.match(el('tutorialTitle').textContent,/3 of 3/);el('tutorialNext').onclick();assert(el('tutorial').hidden);el('help').onclick();assert(!el('tutorial').hidden);
 });
 await check('Simultaneous notes release independently',async()=>{
  await run("pressNote(60,'p1:60')"); await run("pressNote(64,'p2:64')");assert.equal(run('held.size'),2);run("releaseNote(60,'p1:60')");assert.equal(run('held.size'),1);run("releaseNote(64,'p2:64')");assert.equal(run('held.size'),0);
 });
 await check('Quick release during audio unlock cannot leave a stuck note',async()=>{
  const pending=run("pressNote(60,'p3:60')");run("releaseNote(60,'p3:60')");await pending;assert.equal(run('held.size'),0);
 });
 await check('Stop cancels a pending audio action',async()=>{
  const pending=run("startLesson('hear')");run('stopAll()');await pending;assert.equal(run('lesson'),null);
 });
 await check('Recording remains armed through successive loops and preserves earlier layers',async()=>{
  run("selectActivity('beats'); sound.ctx.currentTime=0");await run('startBeat(true)');assert.equal(run('isOverdub'),true);assert(Math.abs(run('beat.start')-2.48)<.001);
  run('sound.ctx.currentTime=1');await run("hitPad('Kick')");assert.equal(run('pattern.events.length'),0);
  run('sound.ctx.currentTime=beat.start+.05');await run("hitPad('Kick')");assert.equal(run('pattern.events.length'),1);
  run('sound.ctx.currentTime=beat.start+9*beat.spb;tickBeat(sound.ctx.currentTime)');await run("hitPad('Snare')");assert.equal(run('pattern.events.length'),2);assert.equal(run('isOverdub'),true);
  run('sound.ctx.currentTime=beat.start+18*beat.spb;tickBeat(sound.ctx.currentTime)');await run("hitPad('Hi-hat')");assert.equal(run('pattern.events.length'),3);assert(run("pattern.events.some(e=>e.kind==='Kick')"));
 });
 await check('Duplicate taps do not stack and undo removes only the latest pass',async()=>{
  const count=run('pattern.events.length');await run("hitPad('Hi-hat')");assert.equal(run('pattern.events.length'),count);
  el('undoPass').onclick();assert.equal(run('pattern.events.length'),2);assert(run("pattern.events.some(e=>e.kind==='Kick')"));assert(run("pattern.events.some(e=>e.kind==='Snare')"));
 });
 await check('Done recording retains playback, and Record layers never clears existing notes',async()=>{
  el('record').onclick();assert.equal(run('isOverdub'),false);assert.notEqual(run('beat'),null);
  const count=run('pattern.events.length');await run("hitPad('Clap')");assert.equal(run('pattern.events.length'),count);
  el('record').onclick();assert.equal(run('isOverdub'),true);assert.equal(run('pattern.events.length'),count);
  run('stopAll()');await run('startBeat(true)');assert.equal(run('pattern.events.length'),count);
 });
 await check('Re-arming during the same lap starts a separate undoable recording pass',async()=>{
  run('pattern.reset();sound.ctx.currentTime=beat.start+.3');await run("hitPad('Kick')");el('record').onclick();el('record').onclick();await run("hitPad('Clap')");assert.equal(run('pattern.events.length'),2);el('undoPass').onclick();assert.equal(run('pattern.events.length'),1);assert.equal(run('pattern.events[0].kind'),'Kick');
 });
 await check('Empty recording continues across passes so the user is never rushed',async()=>{
  run('pattern.reset()');await run('startBeat(true)');run('sound.ctx.currentTime=beat.start+24*beat.spb;tickBeat(sound.ctx.currentTime)');assert.notEqual(run('beat'),null);assert.equal(run('isOverdub'),true);
 });
 await check('Step editor toggles hits, supports both bars, and preserves other sounds',()=>{
  run("pattern.reset();pattern.add('Kick',0,'first');renderPattern()");
  el('stepSound').value='Snare';el('stepSound').onchange();el('stepGrid').children[4].onclick();assert(run("pattern.events.some(e=>e.kind==='Snare'&&e.slot===4)"));el('barTwo').onclick();el('stepGrid').children[12].onclick();assert(run("pattern.events.some(e=>e.kind==='Snare'&&e.slot===28)"));
  el('stepGrid').children[12].onclick();assert(!run("pattern.events.some(e=>e.kind==='Snare'&&e.slot===28)"));el('clearSound').onclick();assert.equal(run('pattern.events.length'),1);assert.equal(run('pattern.events[0].kind'),'Kick');
 });
 await check('Muted layers are retained but not sent to the audio scheduler',async()=>{
  run("pattern.reset([{kind:'Kick',slot:0},{kind:'Snare',slot:0}]);pattern.muted.add('Snare')");
  await run('startBeat(false)');run('sound.calls=[];sound.ctx.currentTime=beat.start;tickBeat(sound.ctx.currentTime)');
  assert(run("sound.calls.some(c=>c[0]==='drum'&&c[1]==='Kick')"));assert(!run("sound.calls.some(c=>c[0]==='drum'&&c[1]==='Snare')"));assert.equal(run('pattern.events.length'),2);
 });
 await check('Practice repeats after missed notes and keeps four-beat count-ins',async()=>{
  run("selectActivity('lick');sound.ctx.currentTime=0");await run("startLesson('practice')");const first=run('lesson.first');const spb=run('lesson.spb');run('sound.ctx.currentTime=lesson.first+(currentSong().lengthBeats+2)*lesson.spb+.01;tickLesson(sound.ctx.currentTime)');assert.equal(run('lesson.cycle'),1);assert(Math.abs(run('lesson.first')-(first+14*spb))<.001);assert.equal(run('lesson.events.length'),11);
 });
 await check('Full-song cues use recording seconds and original tempo',async()=>{
  const starting=run("startLesson('song')");assert.equal(run('song.paused'),false,'play() must run before leaving the initial user gesture');await starting;assert.equal(run('song.playbackRate'),1);assert.equal(run('lesson.events[0].time'),13.4913);assert(Math.abs(run('lesson.events[1].time-lesson.events[0].time')-30/99)<.0001);
 });
 await check('Stop cancels loops, lessons, held keys and recording',()=>{
  run('stopAll()');assert.equal(run('beat'),null);assert.equal(run('lesson'),null);assert.equal(run('held.size'),0);assert.equal(run('song.paused'),true);
 });
 await check('Changing song labels uses sharps for E, flats for B-flat',()=>{
  el('song').value='14-115-E';el('song').onchange();assert.equal(run('keyButtons.get(68).textContent'),'G♯');el('song').value='05-099-Bb';el('song').onchange();assert.equal(run('keyButtons.get(70).textContent'),'B♭');
 });
 await check('Reduced motion keeps static key highlights without moving notes',async()=>{
  run('reduced.matches=true;motionPreference();sound.ctx.currentTime=0');await run("startLesson('practice')");run('sound.ctx.currentTime=lesson.first;tickLesson(sound.ctx.currentTime)');assert(el('body').classList.contains('reduced'));assert.equal(el('notes').children.length,0);assert(run('keyButtons.get(62).classList.contains("target")'));run('stopAll()');
 });
 await check('Volume controls update independent channels and retain their values across activities',()=>{
  el('volume').oninput({target:{value:'.8'}});el('musicVolume').oninput({target:{value:'0'}});
  assert.equal(run('sound.volume'),.8);assert.equal(run('sound.musicVolume'),0);
  run("selectActivity('beats')");assert.equal(el('instrumentVolumeLabel').textContent,'Drum volume');assert(el('musicChannel').hidden);
  run("selectActivity('piano')");assert.equal(run('sound.volume'),.8);assert.equal(run('sound.musicVolume'),0);assert(!el('musicChannel').hidden);
 });
 await check('Every key and pad exposes the matching computer shortcut',()=>{
  assert.equal(run('keyButtons.size'),12);
  for(const [midi,key] of run('keyButtons')) assert.equal(key.getAttribute('aria-keyshortcuts'),run(`shortcuts[${midi}-base].toUpperCase()`));
  for(const [kind,pad] of run('drumButtons')) assert.equal(run(`drumShortcuts[${JSON.stringify(pad.dataset.shortcut.toLowerCase())}]`),kind);
 });
 await check('Computer shortcuts play notes and drums without intercepting form editing or repeats',async()=>{
  const event=(key,tagName='BUTTON',repeat=false)=>({key,code:'Key'+key.toUpperCase(),target:{tagName},repeat,preventDefault(){}});
  run("selectActivity('piano');sound.calls=[]");listeners.keydown(event('a'));await new Promise(setImmediate);
  assert(run("sound.calls.some(c=>c[0]==='piano'&&c[1]===60)"));listeners.keyup(event('a'));assert.equal(run('held.size'),0);
  run("selectActivity('beats');sound.calls=[]");listeners.keydown(event('z'));await new Promise(setImmediate);
  assert(run("sound.calls.some(c=>c[0]==='drum'&&c[1]==='Kick')"));
  const count=run('sound.calls.length');listeners.keydown(event('x','INPUT'));listeners.keydown(event('x','BUTTON',true));await Promise.resolve();assert.equal(run('sound.calls.length'),count);
  listeners.keydown(event('Escape'));assert.equal(run('beat'),null);
 });
 console.log(`${checks.length} controller checks passed:\n${checks.map(x=>'  '+x).join('\n')}`);
})().catch(error=>{console.error(error);process.exitCode=1});
