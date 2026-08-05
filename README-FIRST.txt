ANDREW WOLVERTON PORTFOLIO
MULTI-PAGE REBUILD

INSTALLATION

1. Back up or commit the current repository.
2. Extract this package.
3. Copy everything inside this package into the repository root.
4. Allow these root files to replace the current versions:
   - index.html
   - styles.css
   - script.js
5. Add these new pages:
   - projects.html
   - services.html
   - about.html
   - projects/
6. Replace these Studio Keys files:
   - studio-keys/studio-keys.html
   - studio-keys/studio.css
   - studio-keys/studio.js
7. Merge the included assets folder into the existing assets folder.
   Do not delete the existing assets folder.
   The package adds:
   - assets/social-share.jpg
   - assets/about me gallery/README.txt
8. Keep all existing audio files, video files, images, character assets, toolkit icons, and audio manifests.
9. Open script.js and verify the SOCIAL_PROFILES block near the top, especially the Instagram profile URL.
10. Commit and push through GitHub Desktop.

SUGGESTED COMMIT MESSAGE

Rebuild portfolio as a multi-page experience

ABOUT GALLERY

Place images in:
assets/about me gallery/

Then open script.js and edit the ABOUT_GALLERY list at the top.
A complete example is included in the folder README.

STUDIO KEYS

Desktop keeps the complete Studio Keys workstation.

Mobile now begins with an optional guided first session:
- enable sound
- play the highlighted C key
- tap the highlighted Kick pad
- receive a successful completion state

The visitor can choose "I know what to do."
The "do not show this again" preference is stored in localStorage.

SOCIAL SHARE

The new 1200 by 630 social-share image is included as:
assets/social-share.jpg

All new pages reference that file.

IMPORTANT

This package is code-focused and does not duplicate the existing large asset or audio library.
Merge it into the current repository rather than replacing the whole repository folder.
