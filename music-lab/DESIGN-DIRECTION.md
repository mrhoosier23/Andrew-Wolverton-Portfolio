# Music Lab: performance instrument direction

Research and recommendation, September 13, 2026. This is not a claim that the visual redesign has been implemented or approved.

## What is still weak

The active instrument is still a tall stack: a decorative display, instructions, a volume control, transport, the instrument, then more instructions. Beveled surfaces do not fix that hierarchy. The display repeats the activity name without showing much music. On desktop, the volume control occupies a mostly empty row. On phones, every additional row pushes the playable surface farther away.

## References and what to take from them

### Teenage Engineering OP–1 field

https://teenage.engineering/products/op-1

Reviewed the official product page and its hardware imagery. The useful lesson is the tightly composed physical object: controls have distinct shapes, intentional spacing and a strong relationship to the screen. Color is selective. The product can be playful without looking like a children's worksheet.

Apply: one compact control deck above the playing surface; consistent, functional color roles; custom instrument graphics. Do not reproduce its tiny hardware legends, proprietary artwork, or every physical button.

### Ableton Note

https://www.ableton.com/en/note/

Reviewed the official feature descriptions and the "Begin with a beat" interface demonstration. Note prioritizes the pad surface, with its editing controls related to the selected instrument. Its documented overdubbing and loop editing support building a rhythm in passes.

Apply: a visible two-bar pattern display that reflects the user's actual hits, a clearly armed Record state, and controls near the sounds they change. Keep the existing undo and additive recording behavior. Do not introduce Ableton's full track/scene architecture into this simple entry experience.

### ROLI Piano

https://roli.com/us/experience/piano-learn

Reviewed official descriptions of the illuminated-key learning approach. The useful principle is immediate spatial correspondence between the lesson and the key to play.

Apply: align the phrase lane exactly with the keys; use the same note color at the cue and key; show phrase progress through musical events rather than a score panel. Keep note names, shape cues and reduced-motion highlights so color and movement are never the only instruction.

## Proposed composition

Desktop: a wide instrument, not a vertical dashboard. A single upper deck contains transport on the left, a real pattern/phrase display in the center, and the separate Piano/Drums and Music levels on the right. The keys or pads dominate the area below. Help and the full-studio link sit outside the instrument. Andrew and Doon respond at the edge without taking a row of their own.

Phone: the same hierarchy becomes a short transport row, compact paired level controls, then the playable surface. In the beat activity, the two-bar display sits directly above the pads. Detailed step editing opens only when requested. No added decorative display that repeats the page title. Vertical scrolling is preferable to small targets or cramped keys.

Material direction: warm light-gray housing, dark inset performance surface, ivory keys, and a small number of saturated accents. Cyan means live instrument input; amber means backing music; coral means recording. Combine each color with a label or symbol. Avoid a fake wood texture, random neon, embossed labels everywhere, idle blinking, or an ornamental grid background.

## Assets to design, not decorate with

- An original compact transport symbol set: play, pause, stop, record, undo. Each keeps a visible text label.
- Instrument-specific chooser illustrations drawn from the real piano, pad and phrase surfaces.
- A two-bar pattern visualization driven by recorded events, not a looping stock animation.
- Phrase cue shapes and key-highlight states using the same alignment and timing as the playable keyboard.
- Small existing Andrew/Doon reactions, reused without adding large mascot panels.

All of these are interface components, not text baked into raster images. They must scale, expose accessible names and remain usable without animation.

## Acceptance before calling the redesign finished

Compare rendered piano, beat-recording and lick-practice screens at 320px, 390px and wide desktop. Verify musical keys remain distinct from boxed computer shortcuts. Confirm the current sound, recording state and next action are immediately understandable. Test all existing overdub, undo, independent-level and song behaviors. Have Andrew review the composition before treating the aesthetic as approved. Musical audition and physical-device audio gates remain in RELEASE-CHECKLIST.md.
