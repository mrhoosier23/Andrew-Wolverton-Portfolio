# Portfolio refinement audit

Baseline: `origin/main` at `3f84a66` (captured locally and compared with the deployed GitHub Pages site on 2026-08-05).

## Group 1 — broken shared structure and theme remnants

- All five standalone case-study pages render without an intentional layout because their markup uses `.global-header`, `.global-brand`, `.mobile-menu`, and `.case-study-*` classes that have no matching rules in `styles.css`.
- The same failure is present on the deployed site. The Porch Stomp header computes to `position: static` and the page renders as mostly unstyled HTML.
- `script.js` throws on every case-study page in `setupVideoProjects()` because it calls `qs("source", video)` before confirming that `video` exists. This stops the remaining initialization sequence.
- The theme feature is hidden rather than removed. Five case-study pages still include `data-theme="system"` and a theme-toggle button; the four top-level pages still include `data-theme="light"`; `styles.css` still contains dark-theme rules and theme-toggle styling.

## Group 2 — homepage hero, navigation, holograms, and iPod

- The hero headline wraps according to a character-width constraint rather than an explicit two-line composition.
- The desktop hero/iPod/hologram system has accumulated competing geometry. `.desk-ipod` is defined 26 times and `.hero-copy.hero-copy-wall-card` 46 times.
- The current iPod adds a blurred pseudo-element behind the object; on mobile it sits close to the hero card and keyboard, making the visual hierarchy fragile.
- Navigation and hologram labels are readable only at ideal scale. Several functional labels remain below the surrounding reading scale.
- Text-bearing glass surfaces still inherit blur/filter/transform-era rules even though the last override disables some of them.

## Group 3 — compact interactive previews and accordions

- The Studio Keys homepage preview is visually tall and repeats the full tool more than it previews it.
- Studio Keys itself overflows at 390px (`392px` document width inside a `390px` viewport) and portrait mode is a dead-end instruction rather than a compact representative preview.
- The Toolkit contains 39 tools and opens every group on desktop, producing a long page and an overly dense logo wall. The stylesheet defines `.toolkit-expanded` eight times and `.tool-logo-grid` thirteen times.
- “What needs to work better?” uses large stacked details rows, repeated pill-like labels, and generic plus/minus controls. It needs a clearer compact grid/accordion hierarchy while retaining the current content and links.

## Group 4 — portrait framing and content corrections

- The homepage headshot section creates a large empty mobile interval before the portrait and uses competing min-height/aspect-ratio rules.
- Andrew + Doon is a vertical composition but is forced through repeated `object-fit: cover` rules in horizontal/ratio-constrained containers; `.contact-headshot-card` is defined 19 times.
- Discovery Sound Garden still contains “Founder”/“Founding it” language in the about page and the standalone case-study eyebrow; these need “founding partner” language.

## Group 5 — responsive and regression validation

- `styles.css` contains 58 media-query blocks. The same breakpoint is repeated 10 times for `max-width: 760px`, seven times for `max-width: 900px`, and four times for `max-width: 1100px`; spacing variants of the same breakpoints add more duplicates.
- Baseline document heights are excessive on the long-form top-level pages: desktop is 9,719–11,945px and mobile is 13,479–15,656px.
- Baseline screenshots exist for all 10 routes at 1440×900 and 390×844 in `review-artifacts/before/`, plus priority-section captures for the hero, Studio Keys preview, accordions, Toolkit, headshots, and Andrew + Doon sections.
- Final validation must cover desktop, tablet, and mobile widths, console/runtime errors, internal links, navigation, forms, audio, Studio Keys, gallery, case-study tabs, and social links.
