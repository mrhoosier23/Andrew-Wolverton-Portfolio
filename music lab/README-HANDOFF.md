# Andrew's Studio Keys: Final Code Handoff

This folder contains the final code needed to run and integrate the keyboard experience.

It intentionally does **not** include the large audio packs or character artwork. Those assets are already in the portfolio project.

## Included files

```text
studio-keys.html
studio.css
studio.js
tools/build_audio_manifest.py
audio/manifest.example.json
INTEGRATION-SNIPPET.html
EXPECTED-ASSETS.txt
```

## Recommended project location

Place this code folder at:

```text
public/portfolio/studio-keys/
```

Keep the existing audio and character folders at:

```text
public/portfolio/audio/
public/portfolio/assets/characters/
```

The supplied HTML is already configured for that layout:

```html
<body
  data-manifest-url="../audio/manifest.json"
  data-asset-base-url="../"
  data-character-root="../assets/characters/"
  data-return-href="../index.html"
>
```

If the integration GPT places `studio-keys.html` directly in the portfolio root instead, change those values to:

```html
<body
  data-manifest-url="audio/manifest.json"
  data-asset-base-url="./"
  data-character-root="assets/characters/"
  data-return-href="index.html"
>
```

## Final functionality included

### Build a Band

- Real stem packs loaded from `audio/manifest.json`
- Section pads launch and queue musical sections
- Sections stop when complete unless another section is queued
- Loop Current is explicit and off by default
- Seven grouped instrument faders plus master
- Mute and solo
- Capture Arrangement records section and mixer decisions
- Replay Arrangement is disabled until a section is captured
- Clear Arrangement
- Play and pause
- Stop All

### Free Play

- No stem or song-section playback
- Playable 25-key piano
- Percussion pads
- Optional metronome
- Sustain
- Keyboard range shifting
- Sound octave shifting
- Adjustable Keys Level

### Play the Lick

- Four-beat count-in
- Falling notes
- Perfect, Good, Early, Late, Miss
- Score and combo
- Slower and Faster
- Hear Guide
- Practice Mode
- Stop All

## Final computer keyboard mapping

The hotkey window moves naturally from left hand to right hand.

```text
White piano keys: A S D F G H J K L ; '
Black piano keys:   W E   T Y U   O P
```

Default hotkey window:

```text
C3 through F4
```

Shifted-right window:

```text
G3 through C5
```

Global controls:

```text
Z / X          Shift hotkey range left or right
[ / ]          Sound octave down or up
1 through 8    Trigger pads
Space          Sustain while held
Escape         Stop All
Shift + R      Capture Arrangement
Shift + P      Replay Arrangement
Shift + C      Clear Arrangement
Shift + L      Toggle Loop Current
```

## Character assets expected

```text
assets/characters/flannel-idle.webp
assets/characters/flannel-listening.webp
assets/characters/flannel-count.webp
assets/characters/flannel-celebrate.webp
assets/characters/doon-idle.gif
assets/characters/doon-bounce.gif
assets/characters/doon-jump.gif
```

## Audio expected

```text
audio/manifest.json
audio/packs/02-110-A/
audio/packs/05-099-Bb/
audio/packs/14-115-E/
```

The manifest should contain paths relative to the portfolio root, such as:

```json
{
  "family": "guitar",
  "instrument": "Acoustic Guitar",
  "path": "audio/packs/02-110-A/02 Acoustic Guitar Intro.wav"
}
```

## Regenerating the manifest

The Python script finds the portfolio root automatically whether it lives in:

```text
portfolio/tools/
```

or:

```text
portfolio/studio-keys/tools/
```

Open `tools/build_audio_manifest.py` in VS Code and use **Run Python File**. No folder argument is required.

## Local testing

Run a local server from the portfolio root. Use the Python interpreter that VS Code or Codex already provides:

```powershell
& "C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.14.6-windows-x86_64-none\python.exe" -m http.server 8080
```

Then open:

```text
http://localhost:8080/studio-keys/studio-keys.html
```

Do not test by double-clicking the HTML file. Browser audio and fetch requests need a local server.

## Integration rules

- Do not load Studio Keys JavaScript or audio on the main homepage.
- Link the desk keyboard hotspot to `studio-keys/studio-keys.html`.
- Keep the Return to Desk link.
- Do not autoplay audio.
- Preserve browser Back behavior.
- Keep the current visual design.
- Stop All must remain available in every mode.
- Test with case-sensitive paths before deployment.

## Acceptance test

1. Select each of the three packs and launch Intro.
2. Queue a Verse and confirm it changes at the section boundary.
3. Confirm playback stops when nothing is queued.
4. Turn on Loop Current and confirm only then does a section repeat.
5. Confirm Free Play starts no backing stem.
6. Play every visible piano key with pointer input.
7. Test both hotkey ranges and both hands.
8. Confirm Keys Level balances the piano against the band.
9. Confirm Escape stops stems, demo notes, metronome, challenge, guide, sustained notes, queued sections, and replay timers.
10. Confirm Andrew and Doon change state without missing-file errors.
11. Confirm no console 404 errors.
