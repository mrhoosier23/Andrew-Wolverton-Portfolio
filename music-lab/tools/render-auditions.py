"""Produce private review clips. Never changes the original recordings.
Run from the repository: python music-lab/tools/render-auditions.py <output-directory>
Each clip contains the first guided two-bar entrance with an audible piano guide.
"""
import json, sys, wave
from pathlib import Path
import numpy as np

root = Path(__file__).resolve().parents[2]
output = Path(sys.argv[1]).resolve()
output.mkdir(parents=True, exist_ok=True)
examples = [
    ('05-099-Bb',13.4913,[62,65,70,68,63,60,62,65,63,67,70],[0,.5,1.25,2,2.5,3.25,4,4.75,6,6.5,7],[.4,.6,.45,.4,.6,.4,.5,.75,.4,.4,.75]),
    ('02-110-A',6.9613,[61,64,69,66,62,69,64,66,64,61,69],[0,.5,1.25,2,2.75,4,4.5,5.25,6,6.5,7],[.35,.35,.6,.5,.7,.3,.5,.4,.3,.4,.75]),
    ('14-115-E',8.8762,[64,66,68,71,69,68,66,64,66,68,64],[0,.5,1,1.75,2.5,3,3.5,4.25,5,5.5,6.5],[.3,.3,.45,.5,.3,.3,.4,.5,.3,.5,1]),
]
packs = {p['id']:p for p in json.loads((root/'audio/manifest.json').read_text())['packs']}
for song_id, entry, notes, beats, durations in examples:
    pack = packs[song_id]
    with wave.open(str(root/pack['previewMix']), 'rb') as f:
        rate, channels, width = f.getframerate(), f.getnchannels(), f.getsampwidth()
        start = max(0, entry-3)
        f.setpos(round(start*rate)); raw = f.readframes(round(11*rate))
    if width == 3:
        z = np.frombuffer(raw,np.uint8).reshape(-1,3).astype(np.int32)
        data = (((z[:,0]|z[:,1]<<8|z[:,2]<<16)^8388608)-8388608)/8388608.
    else:
        data = np.frombuffer(raw,'<i2' if width==2 else '<i4').astype(float)/2**(width*8-1)
    data = data.reshape(-1,channels)*.65
    spb = 60/pack['bpm']
    for i,note in enumerate(notes):
        duration = durations[i]*spb
        t = np.arange(round((duration+.15)*rate))/rate
        envelope = np.minimum(t/.008,1)*np.exp(-t*3)*np.exp(-np.maximum(0,t-duration)*35)
        frequency = 440*2**((note-69)/12)
        guide = .25*(np.sin(2*np.pi*frequency*t)+.12*np.sin(6*np.pi*frequency*t))*envelope
        at = round((entry-start+beats[i]*spb)*rate)
        data[at:at+len(guide)] += guide[:,None]
    pcm = (np.clip(data,-1,1)*32767).astype('<i2')
    destination=output/(song_id+'-phrase-review.wav')
    with wave.open(str(destination),'wb') as f:
        f.setnchannels(channels);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm.tobytes())
    print(destination)
