import json, wave
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[2]
def read(path):
    with wave.open(str(path),'rb') as f:
        sr=f.getframerate(); ch=f.getnchannels(); w=f.getsampwidth(); raw=f.readframes(f.getnframes())
    if w==3:
        z=np.frombuffer(raw,np.uint8).reshape(-1,3).astype(np.int32)
        x=(((z[:,0]|z[:,1]<<8|z[:,2]<<16)^8388608)-8388608)/8388608.
    else: x=np.frombuffer(raw,'<i2' if w==2 else '<i4').astype(float)/(2**(w*8-1))
    return x.reshape(-1,ch).mean(axis=1),sr
for p in json.loads((root/'audio/manifest.json').read_text())['packs']:
    mix,sr=read(root/p['previewMix']); print('\n',p['id'])
    for section in ['intro','verse-1','chorus']:
        tracks=p['tracks'].get(section,p['tracks'].get('chorus-1',[]))
        bass=next((t for t in tracks if t['family']=='bass'),None)
        if not bass: continue
        x,sr=read(root/bass['path']); down=8; x=x[::down]; y=mix[::down]; fs=sr/down
        n=1<<(len(y)+len(x)-1).bit_length()
        corr=np.fft.irfft(np.fft.rfft(y,n)*np.conj(np.fft.rfft(x,n)),n)[:len(y)-len(x)+1]
        offset=np.argmax(corr)/fs
        print(section, 'matches mix at', round(offset,4), 'length',round(len(x)/fs,3))
        for beat in range(min(16,int(len(x)/fs*p['bpm']/60))):
            t=beat*60/p['bpm']; z=x[int((t+.06)*fs):int((t+.33)*fs)]
            if len(z)<20: continue
            f=np.fft.rfftfreq(16384,1/fs); spec=abs(np.fft.rfft(z*np.hanning(len(z)),16384))
            ix=np.where((f>32)&(f<250))[0]; idx=ix[np.argmax(spec[ix])]
            midi=round(69+12*np.log2(f[idx]/440))
            print(beat,round(t+offset,3),midi, end='; ')
        print()
