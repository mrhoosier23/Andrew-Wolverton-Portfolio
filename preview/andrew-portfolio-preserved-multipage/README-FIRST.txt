ANDREW WOLVERTON PORTFOLIO
PRESERVED MULTI-PAGE REORGANIZATION

This package starts from the six current files uploaded in the chat. It does not replace the portfolio with a new template.

WHAT STAYS VISUALLY INTACT
- The desktop desk hero and scene
- The glass title card
- The laptop workspace
- The code-built iPod and music player
- The website case-study interface
- The campaign and Instagram work
- The Edit Suite
- The AI workflow demonstrations
- The existing service cards and prices
- The existing process, FAQ, contact form, Doon, colors, fonts, shadows, and animation language
- The full desktop Studio Keys workstation

WHAT CHANGES
- The original single page is divided into Home, Projects, Services, and About pages.
- The homepage uses brief previews instead of carrying every full section.
- Discovery Sound Garden receives a substantial founder and nonprofit case study.
- Social buttons and a saved light/dark theme control are added to the existing header style.
- The About page adds Andrew's personal journey, experience, values, community connections, and a gallery framework.
- Studio Keys adds a first-visit choice and a guided mobile success path. Its desktop workstation remains intact.

INSTALLATION
1. Make a Git commit before replacing anything.
2. Copy these files into the repository root:
   index.html
   projects.html
   services.html
   about.html
   styles.css
   script.js
3. Replace these files inside studio-keys:
   studio-keys.html
   studio.css
   studio.js
4. Merge the included folder into the existing assets folder:
   assets/about me gallery/
5. Do not delete or replace the rest of the current assets or audio folders.
6. In script.js, find SOCIAL_PROFILES and add the full Instagram profile URL.
7. Add About gallery entries to the ABOUT_GALLERY list in script.js after placing images in assets/about me gallery/.
8. Open all four pages locally before committing.
9. Commit and push through GitHub Desktop.

SUGGESTED COMMIT MESSAGE
Split portfolio into focused pages while preserving current design

INSTAGRAM
The Instagram handle was not present in the uploaded source and could not be verified. Add it once here in script.js:

const SOCIAL_PROFILES = {
  instagram: "https://www.instagram.com/YOUR-HANDLE/"
};

ABOUT GALLERY
The folder is ready. Add entries in script.js using this format:

{ file: "singing-hoosiers.jpg", alt: "Andrew performing with the Singing Hoosiers", caption: "Performing with the Singing Hoosiers at Indiana University." },

STUDIO KEYS FIRST VISIT
On an iPhone in landscape, a first-time visitor sees:
- Show me how
- I know what to do
- Do not ask again on this device

The guided path enables sound, switches to Free Play, highlights C4, highlights the Kick pad, and confirms a successful first interaction. It uses localStorage, not a server-side cookie.
