# Mobile Entry Asset Manifest

The mobile entry page is assembled from Andrew's existing portfolio assets so it feels like the same person and body of work, not a generic template. The responsive crops, overlays, type, and motion are controlled in `mobile-landing.css`, which keeps the visual system editable without rebuilding flat images.

## Identity and motion

| Use | Source asset | Treatment |
| --- | --- | --- |
| Header identity | `assets/Home Logo.png` | Existing AW mark, unchanged |
| Hero | `assets/andrew-projects-work2.webp` | Responsive portrait crop with floating discipline labels |
| Creative Rescue | `assets/andrew-avatar-lightbulb-loop.webm` | Muted looping motion behind the service card |
| Build With Andrew | `assets/andrew-projects-work2.webp` | Full-card visual crop |
| NYC Field Unit | `assets/skyline-final.jpg` | Full-card NYC crop with legibility overlay |
| Music | `assets/andrew-avatar-performance-loop.webm` | Muted looping performance motion with static poster fallback |
| About | `assets/Headshot Option 2.jpg` | Authentic headshot crop |
| Closing | `assets/doon-wave.gif` | Existing companion animation |

## Work proof

| Story | Source asset | Destination |
| --- | --- | --- |
| Porch Stomp | `assets/Porch Stomp Screenshot.png` | `projects.html` |
| Discovery Sound Garden | `assets/DSG Social Share.jpg` | `projects.html#dsgDeepDive` |
| Yolele | `assets/Yolele Ingredients.png` | `projects.html` |
| Teacher Time Back Lab | `teacher-time-back/flagship-demo/assets/05-before-after.webp` | `ai-schools.html` |

## Behavior and ownership

- The page contains no third-party stock images and no newly generated likenesses.
- Video is silent, short, and optional. Reduced-motion visitors receive static color treatments.
- Images below the first screen use lazy loading.
- Music-note bursts are generated in the browser and do not require another asset download.
- The current full homepage remains the source for Andrew's complete about, contact, and iPod experiences.
