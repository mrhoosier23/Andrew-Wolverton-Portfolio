# Dance performance mixes

The six published MP3 files in this folder are:

- `the-throwback-jump-off.mp3`
- `the-function.mp3`
- `global-motion.mp3`
- `run-the-floor.mp3`
- `pop-off-precision.mp3`
- `old-school-groove-line.mp3`

Public titles, ordering, descriptions, and groups are configured in `work/media/audio-library.json`. The media page also includes the complete playlist in its HTML so a failed JSON request cannot hide the uploaded mixes or leave visitors with only older samples. Keep that HTML playlist, the recording count, and the initial player selection synchronized when changing the manifest.

Confirm that each referenced MP3 exists in the repository before publishing. The browser does not gate playlist entries on HEAD requests or MIME-type checks. Bump the `audio-library.js` version in `work/media/index.html` when updating the playlist; the controller passes that version to its JSON request.

Upload MP3 files, not an enclosing ZIP. Keep original working filenames and private client notes out of this folder. Do not delete existing assets unless their removal has been approved.
