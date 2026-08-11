PORTFOLIO PROOF <-> SERVICES JOURNEY

Replace these files in the repository root:
- index.html
- projects.html
- script.js
- styles.css

The Services page itself does not need structural HTML replacement for this release. The shared script.js adds each "Related work" proof link into the existing service-card markup at runtime, using the existing service IDs and without touching data-service-choice or contact behavior. This reduces the risk of overwriting the current services page while still completing the journey.

New internal routes:
- projects.html#projects
- projects.html#socialProjects
- projects.html?media=audio#media
- projects.html?media=video#media
- projects.html#ai
- projects.html?media=performance#media

The media router deliberately ignores ?focus= and ?for= so existing tailored-entry routing remains authoritative.

Cache-busting strings were updated in index.html and projects.html. If Services appears unchanged immediately after deployment, hard refresh once or allow the existing GitHub Pages asset cache to revalidate.
