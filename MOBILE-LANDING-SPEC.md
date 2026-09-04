# Andrew's Pocket Studio

## Purpose

The mobile entry is a fast, visual route into Andrew Wolverton's full portfolio. It helps a phone visitor answer one question first: what do I need Andrew to help me do?

The existing homepage remains unchanged as the full studio experience. The mobile entry is a doorway, not a replacement for the portfolio.

## Routing contract

- A visitor opening the root URL at 760px wide or narrower is sent to `mobile.html`.
- A desktop visitor remains on the existing `index.html` homepage.
- `/?mobile=1` opens the mobile entry for review at any viewport width.
- `index.html?full=1` opens the existing homepage and remembers that choice for the browser tab's current session.
- Project, service, school, music, PDF, and social links continue to open their existing destinations directly.
- `mobile.html` is marked `noindex,follow` and declares the root homepage as canonical so search engines retain one homepage.

## Page sequence

1. **Positioning:** Bring me the thing that's stuck.
2. **Situation chooser:** Fix something, build something, or find something out.
3. **Proof:** Porch Stomp, Discovery Sound Garden, and Yolele show different useful outcomes.
4. **Specialty:** Teacher Time Back Lab gives the school offer one focused doorway.
5. **Personality:** Music Lab and the iPod keep Andrew's music central to the experience.
6. **Credibility:** Short biography, CV, actor resume, and four social profiles.
7. **Conversion:** A plain-language invitation to start with an imperfect brief.

## Interaction system

- Large cards are the navigation. There is no horizontal menu or carousel.
- Key taps create a short, colorful music-note burst.
- Existing Andrew motion clips play silently and loop without controls.
- Content enters gently as it reaches the viewport.
- The contact action appears only after the visitor leaves the hero, so it never blocks the first-screen choice.
- Reduced-motion settings disable decorative motion and replace videos with static color treatments.

## Responsive and accessibility baseline

- Minimum supported viewport: 320 CSS pixels wide.
- Main reading size: 18px.
- Small uppercase labels: 16px to 17px.
- Primary targets: 54px to 62px tall.
- Header actions remain visible without a horizontal navigation strip.
- Every meaningful image has alternative text; decorative images and videos are hidden from assistive technology.
- Keyboard focus receives a high-contrast gold outline.
- The page includes a skip link and a single descriptive `h1`.

## Release checks completed

- Phone route to `mobile.html` verified in a fresh session.
- Desktop root route verified to remain on `index.html`.
- Full-site override and session persistence verified.
- Mobile render reviewed at 390 by 844 and at short-screen phone height.
- Direct mobile preview reviewed at desktop width.
- All 44 local file and link references checked; none are missing.
- Service, project, school, and music destinations returned HTTP 200 locally.
- JavaScript syntax and Git whitespace checks passed.

See `MOBILE-ASSET-MANIFEST.md` for the asset sources and treatments.
