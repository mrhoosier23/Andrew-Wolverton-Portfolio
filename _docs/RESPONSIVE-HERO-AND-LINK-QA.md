# Responsive Hero and Portfolio-Link QA

Date: August 11, 2026

## Corrections

- Preserved the existing desk scene, headline, actions, iPod, Music Lab entry, and landscape/desktop composition.
- Limited the portrait-tablet hero card to 660px and reduced the reserved welcome area from 168px to 112px.
- Anchored Andrew outside the card's right edge at 681–980px so he remains meaningful without turning into a small top-left sticker.
- Reduced the Music Lab launch width and weight on portrait tablets and phones while preserving a 54–58px touch target.
- Increased phone navigation label weight without changing the centered navigation structure.
- Restored the routing hook used by the existing `?focus=` employer links so the correct project/media/AI selector activates.
- Made tailored-route offsets reapply after late layout changes so direct links settle below the fixed navigation.
- Added `_docs/PORTFOLIO-LINK-GUIDE.md` with employer, freelance, cold-outreach, proof, and standalone case-study URLs.

## Browser matrix

The homepage hero was rendered at 390×844, 430×932, 768×1024, 820×1180, 906×839, 1024×1366, 1280×800, and 1440×900.

- No horizontal page overflow was found.
- Headline, actions, Music Lab launch, character, and iPod remained present.
- Portrait-tablet headline/character overlap measured zero.
- Desktop and landscape rules were not changed.
- Browser console review returned zero errors or warnings.

## Direct-link checks

- All six `?focus=` values were exercised: `web`, `content`, `audio`, `video`, `ai`, and `live`.
- Each route set the matching document title and selector state.
- `?focus=video#media` settled the media section 108px below navigation at 390px and 118px below navigation at 820px.
- Yolélé `?project=yolele#projects` activated `yolelePanel`.
- `?media=audio#media` activated `audioStudio`.
- `services.html#serviceAudio` settled below the fixed header.

## Files changed in this revision

- `index.html`
- `projects.html`
- `script.js`
- `styles.css`
- `_docs/PORTFOLIO-LINK-GUIDE.md`
- `_docs/RESPONSIVE-HERO-AND-LINK-QA.md`
