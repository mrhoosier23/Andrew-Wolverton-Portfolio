# Simple Music Lab release review

Status: implemented on `codex/music-lab-simple`, not approved for production publication.

## What changed

- `/music-lab/` opens an illustrated chooser: Play piano, Make a beat, Learn a lick.
- One instrument at a time, optional three-step walkthrough, Help, Back, and Stop.
- Piano: one chromatic octave, note names, octave changes, volume, optional whole-song playback.
- Instrument face: charcoal housing, dimensional piano keys, illuminated rubber-style pads, a compact digital display, and visible recording/playback state. This is a controller-style interface, not a claim of external MIDI-device support.
- Beats: four pads, a preset, four-beat count-in and continuous overdubbing over a two-bar loop. Record one sound per pass until choosing Done recording. Recording never clears earlier layers. Undo restores the preceding pass; stopping and re-arming creates a separate take even within the same lap.
- Click-to-place sequencer: select a sound and bar, toggle sixteenth-note steps without clicking in time, mute or clear one sound. Extra sounds and tempo remain available. Tempo can be changed while stopped.
- Lesson: distinct two-bar, 11-note phrases with syncopation, rests and varied note lengths; demonstration, slower/original practice, repeated count-ins, recording-clock cues, supportive feedback and static highlights for reduced motion.
- Three complete recordings stay at their original pitch and speed. No original audio files changed.
- The full studio is preserved at `full-studio.html`. Its markup matches the prior entry page except for its title, canonical address, and links back to the simple lab. Its controller and styles are unchanged.
- No changes to other website pages, accounts, storage permissions, or server APIs.

## Checks completed on September 13, 2026

- `node music-lab/tools/test-simple.cjs`: 20 deterministic controller/preservation checks, including successive recording passes, same-lap re-arming/undo, empty loops, step editing and track mute.
- JavaScript syntax checks and `git diff --check`.
- Source comparison against baseline commit `d6e6c29` for the full-studio markup.
- Every full recording and instrument stem referenced by the existing manifest exists.
- Browser review in Chromium: chooser, piano, beats, lesson, tutorial acceptance/skip/replay, return links, preset, real pad recording, loop controls, song selection, and all three recordings starting.
- Browser checks for chooser, beats and lesson at 320, 375, 430, 768 and 1440px, plus 844x390 landscape: no horizontal overflow. Visible activity buttons met 44px targets. Additional visual review at 390x844.
- Screenshots reviewed for mobile chooser/piano/beats/lesson and desktop chooser.
- Full studio smoke test: Build, Free Play, Play the Lick, and recording selector render and switch correctly. No browser warnings or errors observed in these checks.
- Unit-level simultaneous-pointer and quick-release tests. These are not physical multitouch tests.
- Unit-level reduced-motion test confirms static key highlighting without falling notes. Physical accessibility settings have not been checked.

## Musical evidence and limits

`tools/check_harmony.py` cross-correlates the isolated bass stems with the original full mixes. This identifies section starts and estimates bass pitches in each selected window. The proposed phrases now span two bars, include eleven notes each and stay within one octave. Chord choices are inferred from bass movement, not certified chord transcriptions.

| Song | Phrase | Full-recording cue times (seconds) |
| --- | --- | --- |
| Slow Pocket, B-flat, 99 BPM | Pocket turnaround | 13.4913, 52.2792 |
| Medium Drive, A, 110 BPM | Rolling reply | 6.9613, 41.8703 |
| Bright Run, E, 115 BPM | Bright pickup | 8.8762, 42.2674 |

This is timing/pitch analysis, not an expert listening approval. The mix continues uninterrupted after and between guided phrases. Audition every listed entrance against its harmony and musical phrasing before approving release. Do not describe the lessons as musically verified until that review is complete.

Private first-entrance audition clips were regenerated in `D:\Andrew Portfolio Assets\Music Lab Review`. Each includes the actual band recording and an audible version of the current two-bar phrase. They replace the earlier four-note review clips. They are review aids, not replacement recordings or website assets. Reproduce them with `tools/render-auditions.py <output-directory>`.

## Remaining release gates

1. Musical audition: approve the phrase notes, rhythm and every cue entrance in all three complete recordings. Refine any awkward entrance in `lessons.js` before release.
2. Physical iPhone Safari and Android Chrome: open a fresh session, skip the walkthrough, tap a piano key, hold two notes, release one finger, and confirm the other remains sounding. Check portrait and landscape.
3. On each phone: record a beat after the count-in, overdub a clap, pause/restart, and Stop. Confirm no stuck notes or unwanted page gestures.
4. On each phone: demonstrate/practice each phrase, play the complete recording, replay it, change song, and verify cue alignment through the end. Verify interrupted playback does not leave sound running.
5. With reduced motion enabled, verify the static highlighted keys remain clear and no animated character or falling-note motion remains.
6. After those gates pass, merge only this branch, wait for GitHub Pages, and verify the live simple and full-studio routes. Do not infer deployment success from a commit alone.

## Local preview

The review server is `http://127.0.0.1:8767/music-lab/` on Andrew's PC. A localhost URL does not work from a separate phone. A phone needs an approved reachable preview before those physical-device checks can be completed.
