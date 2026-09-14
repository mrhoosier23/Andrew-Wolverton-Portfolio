// Editable two-bar pattern. Recording adds notes; it never replaces earlier passes.
export class BeatPattern {
  constructor() { this.events=[]; this.history=[]; this.muted=new Set(); this.lastPass=null; }
  remember(pass) {
    if(pass === this.lastPass) return;
    this.history.push(this.events.map(event=>({...event})));
    if(this.history.length>32)this.history.shift();
    this.lastPass=pass;
  }
  add(kind,slot,pass) {
    if(this.events.some(event=>event.kind===kind&&event.slot===slot))return false;
    this.remember(pass);this.events.push({kind,slot});return true;
  }
  toggle(kind,slot) {
    this.remember(Symbol('edit'));
    const index=this.events.findIndex(event=>event.kind===kind&&event.slot===slot);
    if(index<0)this.events.push({kind,slot});else this.events.splice(index,1);
  }
  clearSound(kind) { this.remember(Symbol('clear sound'));this.events=this.events.filter(event=>event.kind!==kind); }
  undo() { if(this.history.length)this.events=this.history.pop();this.lastPass=null; }
  reset(events=[]) { this.events=events;this.history=[];this.lastPass=null;this.muted.clear(); }
}
