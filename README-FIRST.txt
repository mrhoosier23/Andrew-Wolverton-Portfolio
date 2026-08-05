ANDREW PORTFOLIO: GITHUB-READY FINAL POLISH

WHAT TO REPLACE
Copy these files over the matching files in your current portfolio folder:

- index.html
- styles.css
- script.js
- studio-keys/studio-keys.html
- studio-keys/studio.css
- studio-keys/studio.js
- studio-keys/tools/validate_studio_keys.py
- audio/manifest.json

Merge the included assets/toolkit folder into your existing assets/toolkit folder.
Do not delete your existing images, songs, character files, or audio/packs folders.

WHAT CHANGED IN THIS PASS

1. The desk iPod keeps its complete body and now allows the colorful music notes to rise visibly above it.
2. The hero title card uses a readable, lightly tinted glass treatment with blur, saturation, a bright edge, and a softer shadow.
3. The AI section restores five distinct use cases:
   - Rooftop Ramblers booking
   - Discovery Sound Garden fundraising
   - Website auditing and building
   - Weekly meal planning
   - ADHD-friendly computer setup
4. Each AI example now tells the story in three plain-language views:
   - What starts messy
   - What happens behind the scenes
   - What you get
5. The Studio Keys Fast Controls panel uses larger type, larger keycaps, and more room.
6. validate_studio_keys.py is now an actual Python script. The previous file contained PowerShell syntax saved with a .py extension.

VALIDATE BEFORE GITHUB
From the portfolio folder, run:

C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.14.6-windows-x86_64-none\python.exe studio-keys\tools\validate_studio_keys.py

The script checks:
- required portfolio and Studio Keys files
- HTML parsing
- CSS brace balance
- JavaScript syntax when Node.js is installed
- the permanent keyboard map
- all three manifest packs
- every manifest audio path
- expected character assets

For a code-only test that intentionally skips the large audio folders:

C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.14.6-windows-x86_64-none\python.exe studio-keys\tools\validate_studio_keys.py --skip-audio

LOCAL REVIEW
Use your existing Start-PortfolioServer PowerShell script, open the local URL, and use Ctrl + F5 after replacing the files.

Before publishing, check:
- Desk iPod notes rise above the iPod and are not clipped.
- Hero glass card remains readable and does not hide the laptop.
- All five AI tabs switch to a different visual story and final output.
- Studio Keys Fast Controls are readable at your normal browser zoom.
- Studio Keys validation finishes without a Python syntax error.

GITHUB
Once local review passes, commit the complete portfolio folder, including your existing assets and audio packs. The ZIP intentionally contains code updates rather than duplicating the large audio library.
