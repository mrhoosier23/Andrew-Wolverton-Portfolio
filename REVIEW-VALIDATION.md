# Responsive and functional validation

Local review URL: `http://127.0.0.1:4174/`  
Validated: 2026-08-05

## Responsive route matrix

| Route | 1440 × 900 | 820 × 900 | 390 × 844 |
| --- | --- | --- | --- |
| Home | Pass | Pass | Pass |
| About | Pass | Pass | Pass |
| Services | Pass | Pass | Pass |
| Projects | Pass | Pass | Pass |
| Discovery Sound Garden | Pass | Pass | Pass |
| The Edit Suite | Pass | Pass | Pass |
| Porch Stomp | Pass | Pass | Pass |
| Rooftop Ramblers | Pass | Pass | Pass |
| Yolélé Ingredients | Pass | Pass | Pass |
| Studio Keys | Pass | Pass | Pass |

All 30 viewport checks reported document width at or below the available layout width. The standalone case-study headers remained fixed, and no page retained a theme attribute or theme toggle.

## Functional checks

- Desktop and mobile navigation: menu opens, closes, and reports its expanded state correctly.
- Homepage iPod: opens the player, exposes all three recordings, and loads the first audio source.
- Studio Keys: portrait preview renders without overflow; landscape mode exposes 18 piano keys and 7 pads; a piano key accepts input.
- Homepage capabilities and Services Toolkit: one-open-at-a-time behavior confirmed on desktop and mobile.
- Projects: website case-study tabs and media monitor tabs switch their active/visible panels correctly.
- About gallery: all 12 cards and images initialize and load.
- Forms: the three required controls and FormSubmit destination remain intact; no test submission was sent.
- Social links: LinkedIn, Instagram, YouTube, and GitHub resolve to their intended destinations.
- Internal resources: every local `href` and `src` across the 10 current HTML pages resolves to an existing file.
- Console review: no site JavaScript exception remained; Chrome-extension message-channel warnings were excluded as browser tooling noise.

The final desktop, tablet, and mobile contact sheets were visually reviewed after the last source change.
