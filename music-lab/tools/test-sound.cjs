// Exercise the production audio graph without a speaker or browser dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Parameter {
  constructor(){this.value=0}
  setTargetAtTime(value){this.value=value}
}
class Node {
  constructor(){this.gain=new Parameter();this.connections=[];this.threshold={};this.ratio={}}
  connect(node){this.connections.push(node)}
}
class AudioContext {
  constructor(){this.state='running';this.currentTime=0;this.sampleRate=8;this.destination=new Node();this.mediaCount=0}
  createGain(){return new Node()}
  createDynamicsCompressor(){return new Node()}
  createAnalyser(){const node=new Node();node.getFloatTimeDomainData=buffer=>buffer.fill(.1);return node}
  createBuffer(){return {getChannelData:()=>new Float32Array(8)}}
  createMediaElementSource(){this.mediaCount++;return new Node()}
}
const context=vm.createContext({window:{AudioContext}});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../sound.js'),'utf8').replace('export class Sound','class Sound')+';this.Sound=Sound',context);
(async()=>{
  const sound=new context.Sound();
  sound.setVolume(.8);sound.setMusicVolume(.2);await sound.unlock();
  assert.equal(sound.master.gain.value,.8);assert.equal(sound.music.gain.value,.2);
  const media={};sound.attach(media);sound.attach(media);
  assert.equal(sound.ctx.mediaCount,1);assert.equal(sound.media.connections[0],sound.music);
  assert.notEqual(sound.master.connections[0],sound.music.connections[0],'Backing track must not drive the instrument compressor');
  assert.equal(sound.musicMeter.connections.length,0,'Music meter must not add a second speaker connection');
  assert.equal(sound.instrumentMeter.connections.length,0,'Instrument meter must not add a second speaker connection');
  assert(Math.abs(sound.level('instrument')-.3)<.0001);
  assert(Math.abs(sound.level('music')-.3)<.0001);
  sound.setMusicVolume(0);assert.equal(sound.music.gain.value,0);assert.equal(sound.master.gain.value,.8);
  sound.setMusicVolume(.3);sound.setVolume(0);assert.equal(sound.master.gain.value,0);assert.equal(sound.music.gain.value,.3);
  const defaults=new context.Sound();await defaults.unlock();assert.equal(defaults.master.gain.value,.65);assert.equal(defaults.music.gain.value,.25);
  console.log('Audio graph passed: independent gain, independent mute, quieter backing default, pre-unlock levels, one media attachment, no shared compressor.');
})().catch(error=>{console.error(error);process.exitCode=1});
