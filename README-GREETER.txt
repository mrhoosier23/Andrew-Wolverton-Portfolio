Responsive homepage greeter update

Tested viewport sizes:
- 997 x 646 desktop
- 734 x 758 tablet / wide mobile
- 502 x 752 mobile
- 390 x 740 compact mobile

Breakpoint ownership:
- 981px and wider: avatar outside the right edge of the hero card
- 681px to 980px: avatar and speech bubble in a reserved row inside the card
- 431px to 680px: avatar and compact bubble in the upper-right open area
- 430px and narrower: smaller upper-right layout that protects the headline

The stylesheet and script URLs in index.html have new version strings to prevent browser cache from showing an older layout.
