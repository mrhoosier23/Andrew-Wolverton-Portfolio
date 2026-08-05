FINAL MOBILE MICROFIX

Replace these three files in the repository root:

- index.html
- styles.css
- script.js

What changed:

1. The workspace avatar no longer uses the mobile scale-and-translate transform that cut off the top of Andrew's head. The complete avatar now fits inside the card from the top edge down.
2. Wolverton Mountain now loads from .wav and .WAV source paths instead of .mp3.
3. The mobile Doon return-to-desk control has been moved left so it no longer collides with Safari's dark floating edge/back control. The redundant visible tooltip bubble was removed, while the accessible label remains.

Suggested commit message:
Fix mobile avatar crop, music source, and return control

After pushing, close the Safari tab and reopen the site to clear cached CSS and JavaScript.
