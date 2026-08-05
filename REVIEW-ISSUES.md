# Portfolio refinement audit

Baseline: `origin/main` at `3f84a66` (captured locally and compared with the deployed GitHub Pages site on 2026-08-05).

## Group 6 — release-readiness and visitor journey re-audit

- The homepage currently asks a phone visitor to move through nine major sections before reaching the inquiry form. Discovery Sound Garden, the long process, and FAQ content repeat material that is already available in the Projects and Services journeys.
- The first-screen actions are “See selected work” and “View services.” Neither gives an already-interested visitor an immediate path to contact Andrew.
- The primary navigation exposes four page destinations plus Contact and social controls on desktop. The requested release architecture is three destinations: Home, Services, and Projects. About should become a short homepage section instead of a competing page.
- The mobile homepage has the strongest visual identity in the site, but its copy card, desk controls, holograms, and iPod still compete within one viewport. The first screen needs one dominant statement, one contact action, one browse action, and an intentional supporting interaction.
- Mobile case-study pages still present a compact menu button rather than the same three visible destinations. This makes the primary route less obvious on the pages most likely to be opened from a shared link.
- The Projects category tabs read as a small floating overlay beneath an oversized hero. They obscure rather than clarify the project journey and are not a strong touch target.
- Studio Keys uses very small desktop mode labels and instructional controls, while the mixer occupies less visual weight than the surrounding hardware. Its tutorial describes controls but does not yet prove a successful action to the visitor.
- Toolkit still exposes too many equal-weight tools. Its current length and logo density dilute the services story; missing or unreadable logos also reduce trust.
- The About page repeats biography and leadership material across several sections. The homepage already contains a suitable portrait moment and should carry a shorter, more useful version next to a contact path.
- Desktop footers mix site navigation, utility links, social destinations, and the desk-return concept without a clear hierarchy. The footer should close the three-page journey with contact first.

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
