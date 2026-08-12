ABOUT / MEET ANDREW COMPOSITION FIX V2

Replace:
- styles.css
- index.html

What changed:
- The live-performance card stays layered over the headshot rather than dropping below it.
- Its image crop is shortened to 4:3 so the entire card fits within the vertical height of the portrait IMAGE area.
- The white Andrew Wolverton caption panel is never covered.
- The portrait remains in normal document flow, eliminating the large empty visual column introduced by the prior fix.
- Desktop, tablet, mobile, and very narrow mobile each get controlled size/position rules.
- The media/social pricing build is preserved.
- index.html uses a new stylesheet cache key.

This replaces the earlier z-index/stacking solution.
