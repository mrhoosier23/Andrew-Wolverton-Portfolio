# Batch 1 source diff summary

## Architecture

- Replaced the active `styles.css` plus `polish.css` cascade with four explicit layers: `core.css`, `pages.css`, `components.css`, and `responsive.css`.
- Preserved the prior styles under `archive/legacy-css/` for reference only.
- Removed 404 unique shared or obsolete selector groups from the active page-specific layer.

## Shared components

- One header structure across Home, Projects, Services, and About.
- Social profiles moved to the shared footer.
- One button, tab, accordion, subnavigation, footer, and Doon system.
- Text-bearing shared surfaces no longer use blur or filter effects.

## Removed systems

- Homepage workspace section and its transition.
- Laptop and Focusrite hero hotspots.
- Workspace-only script references.

## JavaScript

- Simplified navigation behavior and removed automatic header hiding.
- Doon now acts as Back to Top on every main page.
- Made `qs()` and `qsa()` null-safe so pages without a video player do not stop initialization.
- Removed `.audio-main-control` from the text-normalization selector so the play icon is not replaced.

## Reserved for later batches

- Hero and iPod redesign
- Portrait framing and DSG asset selection
- Services opener and Toolkit curation
- Projects opener, LimeWire-inspired audio, video platform redesign, and social showcase
- Gallery motion and Studio Keys mixer
