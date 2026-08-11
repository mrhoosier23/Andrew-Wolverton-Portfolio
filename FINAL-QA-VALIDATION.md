# Andrew Wolverton Portfolio — Final QA Sprint

Audit date: August 11, 2026  
Delivery base: clean `main` snapshot at `398e850`  
Scope: correction, template migration, and regression testing only; no visual redesign

## Implemented

- Added reusable `projects.html?project=` routing for Porch Stomp, Discovery Sound Garden, and Yolélé Ingredients.
- Updated the homepage Yolélé link to `projects.html?project=yolele#projects` and added equivalent reusable routes to the other two featured website projects.
- Preserved `?focus=` and `?for=` priority over `?project=` and `?media=` state.
- Corrected social-profile setup so configured URLs may enhance placeholders, valid HTTP(S) URLs in HTML remain authoritative, and only explicitly marked placeholders can be intercepted.
- Migrated Porch Stomp, Discovery Sound Garden, Yolélé Ingredients, The Edit Suite, and Rooftop Ramblers to the current centered header, primary navigation, Doon guide, footer, and cache key.
- Restored the established responsive case-study layout rules that had fallen out of the current stylesheet. The `<main>` content of all five pages matches the source snapshot exactly.
- Corrected the successful contact-form reset from `aria-selected` to `aria-pressed`.
- Moved Home capability links, Services related-work links, and Projects service bridges into the HTML so the navigation remains available without JavaScript. JavaScript now enhances state and avoids duplicate bridges.
- Added a no-JavaScript fallback for video-service and live-performance links that normally live inside interactive media tabs.
- Corrected long-page deep-link offsets and replaced jump-navigation `scrollIntoView()` with horizontal-only scrolling so the active jump link cannot pull the document away from its target.

## Responsive browser matrix

| Viewport | Representative route | Result |
|---|---|---|
| 390 × 844 | Home | No horizontal overflow, no broken images, three primary-nav links visible, Doon visible |
| 430 × 900 | Yolélé standalone case study | Current shell rendered, no overflow or broken images |
| 768 × 900 | Projects video deep link | Video workspace active; target settled about 118px below navigation |
| 820 × 1000 | Services toolkit deep link | No overflow; target settled about 118px below navigation |
| 1024 × 900 | Andrew's Music Lab | No overflow or broken images; 49 visible controls |
| 1440 × 1000 | The Edit Suite standalone case study | Current shell and case-study layout rendered without overflow |

Additional route checks covered Yolélé at 430 and 1440, video at 430 and 768, audio at 820, performance at 1440, services at 430/820/1440, Home/About at 1024, and all five standalone case studies across the matrix.

## Interaction results

- Yolélé deep link activated `yolelePanel`; Porch Stomp and DSG selectors also activated the matching panels.
- `?focus=` and `?for=` kept priority and left project routing at the protected default state.
- Audio library exposed four tracks; playback reached `readyState 4`, advanced past 0 seconds, and changed the control label to Pause.
- Video selection changed the title and source to “Break My Stride”; video reached `readyState 4` with no media error.
- Performance selection changed both the YouTube embed and direct link to the selected performance.
- Switching media workspaces paused inactive audio and video.
- The iPod opened with three tracks and a valid initial audio source.
- The About gallery contained 13 intact images and advanced horizontally.
- Music Lab rendered at 390 and 1024 with no overflow; Build, Free Play, and Play the Lick states switched correctly, and all 18 piano keys remained available.
- Services exposed seven static Related Work links. Following the Video proof link opened the video workspace.
- Contact service-choice routing populated “Video and social”; contact choice buttons maintained one `aria-pressed="true"` state; an empty submit focused the required Name field and exposed native validation messages without transmitting the form.
- Doon returned the page from a deep section to `scrollY = 0`.
- Final browser console review returned zero errors or warnings.

## Static integrity

- `script.js` and `music-lab/studio.js` parsed in the browser with no console errors.
- Stylesheet brace balance: zero; parser ended in normal code state.
- Active-page local `href`, `src`, and `poster` audit: zero missing files.
- Active-page duplicate ID audit: zero duplicates.
- All five migrated case-study `<main>` blocks match the clean source snapshot.
- Final cache key: `20260811-final-qa-final`.

## Remaining unverified or intentionally not performed

- The contact form was validated but not submitted, so live FormSubmit delivery and the post-network success message remain unverified. The success-path ARIA reset is source-verified.
- Audio playback progression and video metadata readiness were verified, but subjective audible/visual quality was not human-monitored in this automated pass.
- YouTube and Instagram embeds depend on third-party availability and policy. Local selectors, URLs, fallbacks, and console behavior passed; uninterrupted third-party playback is not guaranteed.
- The browser matrix is representative rather than every page at every width.
- No deployment, push, pull request, or change to the canonical `D:` checkout was performed. This delivery is a complete deploy-ready copy plus ZIP for review.
