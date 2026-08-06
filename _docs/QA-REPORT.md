# Batch 1 desktop QA report

## Scope

This report validates the shared foundation pass. It does not approve the hero, iPod, portrait framing, Toolkit curation, media redesign, gallery motion, DSG image selection, or Studio Keys mixer. Those remain assigned to later batches.

## Automated desktop checks

- Viewports: 1440 × 900 and 1280 × 800
- Routes: Home, Projects, Services, and About
- JavaScript syntax: passed
- Runtime page errors: none after the null-safe selector fix
- Horizontal overflow: none on all eight route-width checks
- Shared header count: exactly one per page
- Shared footer count: exactly one per page
- Doon control count: exactly one per page
- Obsolete homepage workspace: absent
- Tab and accordion click checks: passed
- Projects audio play icon remains present after initialization
- Doon appears after scrolling and returns each page to scroll position 0

## Route metrics

- **index.html at 1440px**: document height 8197px, overflow 0px, runtime errors 0
- **projects.html at 1440px**: document height 9566px, overflow 0px, runtime errors 0
- **services.html at 1440px**: document height 9649px, overflow 0px, runtime errors 0
- **about.html at 1440px**: document height 8447px, overflow 0px, runtime errors 0
- **index.html at 1280px**: document height 7787px, overflow 0px, runtime errors 0
- **projects.html at 1280px**: document height 9050px, overflow 0px, runtime errors 0
- **services.html at 1280px**: document height 9318px, overflow 0px, runtime errors 0
- **about.html at 1280px**: document height 7870px, overflow 0px, runtime errors 0

## Source package asset limitation

The supplied `Andrew-Portfolio-Complete-Fix.zip` did not contain the following assets. They are expected to remain in the full repository when this batch is merged. The QA renderer used labeled placeholders so layout could still be checked:

- `assets/Actor Resume.pdf`
- `assets/DSG Social Share.jpg`
- `assets/Porch Stomp Home Before.png`
- `assets/Porch Stomp Line Up Browser.png`
- `assets/Porch Stomp Screenshot.png`
- `assets/Porch Stomp Stages Before.png`
- `assets/Ultimate Reel.mp4`
- `assets/Wolverton CV 2026.pdf`
- `assets/Yolele Ingredients Form.png`
- `assets/Yolele Ingredients.png`

Do not delete the existing repository `assets/` folder when installing this batch. Merge folders and replace only matching files.

## Approval boundary

Batch 1 is ready for desktop foundation review. It intentionally stops before Batch 2 visual changes.