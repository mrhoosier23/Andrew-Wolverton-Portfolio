// Cue times are seconds in the unmodified preview mix, not section-relative times.
// Two-bar candidate phrases follow the measured verse/chorus bass movement.
// Source timing: tools/check_harmony.py matches each bass stem to its full mix.
// Final musical audition is a release gate; bass-pitch analysis is not listening approval.
export const lessons = {
  '05-099-Bb': {
    title: 'Slow Pocket', key: 'B-flat', bpm: 99, keyboardBase: 60,
    file: '../audio/packs/05-099-Bb/05 099 Bb.wav',
    phraseTitle: 'Pocket turnaround', lengthBeats: 8,
    notes: [62,65,70,68,63,60,62,65,63,67,70],
    names: ['D','F','B♭','A♭','E♭','C','D','F','E♭','G','B♭'],
    beats: [0,.5,1.25,2,2.5,3.25,4,4.75,6,6.5,7],
    durations: [.4,.6,.45,.4,.6,.4,.5,.75,.4,.4,.75],
    harmony: 'B-flat / A-flat / B-flat / E-flat',
    entries: [13.4913,52.2792],
  },
  '02-110-A': {
    title: 'Medium Drive', key: 'A', bpm: 110, keyboardBase: 60,
    file: '../audio/packs/02-110-A/02 110 A.wav',
    phraseTitle: 'Rolling reply', lengthBeats: 8,
    notes: [61,64,69,66,62,69,64,66,64,61,69],
    names: ['C♯','E','A','F♯','D','A','E','F♯','E','C♯','A'],
    beats: [0,.5,1.25,2,2.75,4,4.5,5.25,6,6.5,7],
    durations: [.35,.35,.6,.5,.7,.3,.5,.4,.3,.4,.75],
    harmony: 'A / D / A',
    entries: [6.9613,41.8703],
  },
  '14-115-E': {
    title: 'Bright Run', key: 'E', bpm: 115, keyboardBase: 60,
    file: '../audio/packs/14-115-E/14 115 E.wav',
    phraseTitle: 'Bright pickup', lengthBeats: 8,
    notes: [64,66,68,71,69,68,66,64,66,68,64],
    names: ['E','F♯','G♯','B','A','G♯','F♯','E','F♯','G♯','E'],
    beats: [0,.5,1,1.75,2.5,3,3.5,4.25,5,5.5,6.5],
    durations: [.3,.3,.45,.5,.3,.3,.4,.5,.3,.5,1],
    harmony: 'E',
    entries: [8.8762,42.2674],
  },
};
