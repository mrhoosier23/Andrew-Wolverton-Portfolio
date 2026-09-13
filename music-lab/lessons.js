// Cue times are seconds in the unmodified preview mix, not section-relative times.
// Candidate major-triad phrases use selected tonic-bass windows, not the whole song.
// Source timing: tools/check_harmony.py matches each bass stem to its full mix.
// Final musical audition is a release gate; bass-pitch analysis is not listening approval.
export const lessons = {
  '05-099-Bb': {
    title: 'Slow Pocket', key: 'B-flat', bpm: 99, keyboardBase: 60,
    file: '../audio/packs/05-099-Bb/05 099 Bb.wav',
    notes: [70, 65, 62, 70], names: ['B♭', 'F', 'D', 'B♭'],
    beats: [0, .5, 1, 1.5], durationBeats: .4,
    entries: [13.4913, 18.3398, 20.7640],
  },
  '02-110-A': {
    title: 'Medium Drive', key: 'A', bpm: 110, keyboardBase: 60,
    file: '../audio/packs/02-110-A/02 110 A.wav',
    notes: [69, 64, 61, 69], names: ['A', 'E', 'C♯', 'A'],
    beats: [0, .5, 1, 1.5], durationBeats: .4,
    entries: [9.1431, 11.3249, 26.5976],
  },
  '14-115-E': {
    title: 'Bright Run', key: 'E', bpm: 115, keyboardBase: 60,
    file: '../audio/packs/14-115-E/14 115 E.wav',
    notes: [64, 71, 68, 64], names: ['E', 'B', 'G♯', 'E'],
    beats: [0, .5, 1, 1.5], durationBeats: .4,
    entries: [8.8762, 10.9632, 42.2674, 44.3544],
  },
};
