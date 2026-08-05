ANDREW PORTFOLIO MOBILE REBUILD

This is a code-only replacement package. It does not contain your existing images, audio, character assets, or toolkit logos.

INSTALL
1. Back up the current repository folder.
2. Extract this ZIP.
3. Copy these files into the root of Andrew-Wolverton-Portfolio and allow Windows to replace the existing versions:
   index.html
   styles.css
   script.js
   studio-keys/studio-keys.html
   studio-keys/studio.css
   studio-keys/studio.js
   studio-keys/tools/validate_studio_keys.py
4. Keep your existing assets/ and audio/ folders exactly where they are.
5. Open GitHub Desktop.
6. Review the seven changed files.
7. Commit with: Rebuild mobile portfolio and Studio Keys
8. Push origin.
9. Wait for GitHub Pages to finish deploying.
10. On iPhone Safari, close the old tab, open the site again, and refresh.

STUDIO KEYS ON IPHONE
- Portrait shows a deliberate rotate screen.
- Landscape shows PLAY, BUILD, MIX, and SESSION views.
- Tap Enable sound once. Safari requires a direct user gesture before Web Audio can run.
- PLAY contains the active mode controls, pads, note highway, and C4-F5 piano.
- BUILD contains pack and arrangement controls.
- MIX contains faders and sound shaping.
- SESSION contains arrangement memory, shortcut help, Andrew, and Doon.

VALIDATE
From the portfolio folder, run:

& C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.14.6-windows-x86_64-none\python.exe studio-keys\tools\validate_studio_keys.py

For a code-only check:

& C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.14.6-windows-x86_64-none\python.exe studio-keys\tools\validate_studio_keys.py --skip-audio

IMPORTANT
The package passed structural validation in the build environment. Final iPhone Safari audio and layout verification must be performed on your device after GitHub Pages deploys because Web Audio permission and Safari browser bars are device-specific.
