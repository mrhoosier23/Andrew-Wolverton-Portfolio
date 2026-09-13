"""Produce private review clips. Never changes the original recordings.
Run from the repository: python music-lab/tools/render-auditions.py <output-directory>
Each clip contains the first guided entrance with a clearly audible piano guide.
"""
import json, sys, wave
from pathlib import Path
import numpy as np

root = Path(__file__).resolve().parents[2]
output = Path(sys.argv[1]).resolve()
output.mkdir(parents=True, exist_ok=True)
examples = [
    ('05-099-Bb', 13.4913, [70,65,62,70]),
    ('02-110-A', 9.1431, [69,64,61,69]),
    ('14-115-E', 8.8762, [64,71,68,64]),
]
packs = {p['id']:p for p in json.loads((root/'audio/manifest.json').read_text())['packs']}
for song_id, entry, notes in examples:
    pack = packs[song_id]
    with wave.open(str(root/pack['previewMix']), 'rb') as f:
        rate, channels, width = f.getframerate(), f.getnchannels(), f.getsampwidth()
        start = max(0, entry-3)
        f.setpos(round(start*rate)); raw = f.readframes(round(7*rate))
    if width == 3:
        z = np.frombuffer(raw,np.uint8).reshape(-1,3).astype(np.int32)
        data = (((z[:,0]|z[:,1]<<8|z[:,2]<<16)^8388608)-8388608)/8388608.
    else:
        data = np.frombuffer(raw,'<i2' if width==2 else '<i4').astype(float)/2**(width*8-1)
    data = data.reshape(-1,channels)*.65
    spb = 60/pack['bpm']
    for i,note in enumerate(notes):
        duration = .4*spb
        t = np.arange(round((duration+.15)*rate))/rate
        envelope = np.minimum(t/.008,1)*np.exp(-t*3)*np.exp(-np.maximum(0,t-duration)*35)
        frequency = 440*2**((note-69)/12)
        guide = .25*(np.sin(2*np.pi*frequency*t)+.12*np.sin(6*np.pi*frequency*t))*envelope
        at = round((entry-start+i*.5*spb)*rate)
        data[at:at+len(guide)] += guide[:,None]
    pcm = (np.clip(data,-1,1)*32767).astype('<i2')
    destination=output/(song_id+'-phrase-review.wav')
    with wave.open(str(destination),'wb') as f:
        f.setnchannels(channels);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm.tobytes())
    print(destination)
