"""Read-only timing and bass-pitch inspection of the preserved recordings."""
import json, wave
from pathlib import Path
import numpy as np

root = Path(__file__).resolve().parents[2]
packs = json.loads((root / 'audio/manifest.json').read_text())['packs']
for pack in packs:
    with wave.open(str(root / pack['previewMix']), 'rb') as f:
        rate, channels, width, frames = f.getframerate(), f.getnchannels(), f.getsampwidth(), f.getnframes()
        raw = f.readframes(frames)
    if width == 3:
        b = np.frombuffer(raw, np.uint8).reshape(-1, 3).astype(np.int32)
        x = b[:, 0] | (b[:, 1] << 8) | (b[:, 2] << 16)
        x = ((x ^ 8388608) - 8388608) / 8388608.
    else:
        x = np.frombuffer(raw, '<i2' if width == 2 else '<i4').astype(float) / (2 ** (width * 8 - 1))
    x = x.reshape(-1, channels).mean(axis=1)
    stride = max(1, rate // 11025)
    x = x[::stride]; sr = rate / stride
    hop = int(sr * .01)
    rms = np.array([np.sqrt(np.mean(x[i:i+hop] ** 2)) for i in range(0, len(x), hop)])
    onset = np.flatnonzero(rms > rms.max() * .035)[0] * .01
    print('\n', pack['id'], 'seconds', round(frames/rate, 3), 'first sound', onset, 'bar seconds', round(240/pack['bpm'], 5))
    # Dominant low-frequency peaks at successive bars are evidence, not a chord-label oracle.
    for bar in range(12):
        start = onset + bar * 240 / pack['bpm']
        seg = x[int((start+.08)*sr):int((start+.65)*sr)]
        n = 32768
        spectrum = abs(np.fft.rfft(seg * np.hanning(len(seg)), n))
        freqs = np.fft.rfftfreq(n, 1/sr)
        candidates=[]
        for midi in range(28, 60):
            hz=440*2**((midi-69)/12)
            mask=abs(freqs-hz) < hz*.022
            candidates.append((float(spectrum[mask].max()), midi))
        notes=sorted(candidates, reverse=True)[:3]
        print('bar',bar,'at',round(start,3),'bass candidates',[(m,round(v,1)) for v,m in notes])
