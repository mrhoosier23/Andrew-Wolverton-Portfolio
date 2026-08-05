# Portfolio refinement change log

Review branch: `codex/portfolio-refinement-review`  
Base: `origin/main` at `3f84a66`  
Review date: 2026-08-05

## What changed

- Restored the five standalone case studies to the existing portfolio design system, repaired their fixed/mobile navigation, and removed the obsolete theme controls and theme state.
- Locked the homepage headline to the intended two-line composition, increased navigation and hologram-label legibility, removed text blur/scale effects, and repositioned the interactive iPod without covering the hero.
- Made the Studio Keys homepage preview compact, added a representative portrait fallback to Studio Keys, removed its 390px overflow, and preserved the landscape workstation and playable keys.
- Converted the homepage “What needs to work better?” area and Services Toolkit into compact, responsive, one-open-at-a-time accordion grids.
- Corrected the homepage/about headshot to its native landscape framing and used the full vertical Andrew-and-Doon composition in contact areas and the Discovery Sound Garden case study.
- Updated Discovery Sound Garden public language from founder to founding partner.
- Repaired the intended Instagram URL and two missing Discovery Sound Garden image references.
- Hid the tablet desk-scene scrollbar while retaining horizontal touch/pointer panning.

## Review artifacts

- `REVIEW-ISSUES.md` contains the written baseline issue list and CSS/media-query audit.
- `review-artifacts/before/` contains desktop and mobile baselines for all 10 routes plus priority-section captures.
- `review-artifacts/after/` contains final desktop and mobile screenshots for all 10 routes and reviewed contact sheets.
- `review-artifacts/tablet/` contains the 820px review set and contact sheet.
- `review-artifacts/checkpoints/` records the visual checkpoint after each issue group.

No redesign or template replacement was introduced. The desk scene, typography, colors, content structure, audio player, Studio Keys, gallery, case-study tabs, forms, and navigation concepts remain in place.
