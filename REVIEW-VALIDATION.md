# Responsive and functional validation

Local review URL: `http://127.0.0.1:4174/`  
Validated: 2026-08-05

## Responsive route matrix

| Route | 1440 x 900 | 820 x 1180 | 390 x 844 |
| --- | --- | --- | --- |
| Home | Pass | Pass | Pass |
| Projects | Pass | Pass | Pass |
| Services | Pass | Pass | Pass |
| Porch Stomp | Pass | Pass | Pass |
| Discovery Sound Garden | Pass | Pass | Pass |
| The Edit Suite | Pass | Pass | Pass |
| Rooftop Ramblers | Pass | Pass | Pass |
| Yolélé Ingredients | Pass | Pass | Pass |
| Studio Keys | Pass | Pass | Pass |
| About redirect | Pass | Pass | Pass |

The 30 route-width checks found no remaining document overflow, visible broken images, visible theme controls, or missing Home / Services / Projects navigation. The Projects tablet AI switcher was corrected after the first pass and rechecked at 820px. Browser console review returned no site errors or warnings.

## Functional checks

- Homepage iPod opens the player, locks background scrolling, shows its menu, and exposes all three recordings.
- The three primary audio sources and the portfolio video source exist locally.
- Contact choices populate the hidden project type; name, email, and message remain required. No test form submission was sent.
- Services Toolkit keeps exactly one of five groups open and loads all 39 logos with nonzero image dimensions.
- Projects website tabs show exactly one case panel; media tabs switch correctly; the selected YouTube performance updates both the embed and direct link.
- Projects gallery creates 12 cards, removes the loading placeholder, and reports no broken loaded images.
- Studio Keys switches cleanly among Build, Free Play, and Play the Lick; all three modes expose the expected transport controls, 30 piano keys, and seven or eight contextual pads.
- The success-gated Studio Keys walkthrough was completed through its saved-arrangement success state.
- A static resource audit checked 281 local `href`, `src`, and `poster` references across the 10 current HTML routes; none were missing.
- The About URL redirects to `index.html#about` rather than exposing a fourth primary page.

The final desktop, tablet, and mobile contact sheets were visually reviewed after the last source change.
