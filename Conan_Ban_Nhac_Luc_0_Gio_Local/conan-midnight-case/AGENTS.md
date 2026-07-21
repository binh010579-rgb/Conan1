# Project Instructions

## Goal

Maintain a dependency-free original 2D browser detective game that can run by opening `index.html` directly.

## Architecture

- `index.html`: semantic shell; keep element IDs synchronized with `game.js`.
- `assets/`: original compressed scene and portrait artwork.
- `styles.css`: responsive visual-novel layout and animation.
- `game.js`: state, story, clues, mini-games, audio and save logic.
- Save key: `zero-hour-case-save-v2` in `localStorage`.

## Editing rules

- Preserve direct `file://` compatibility.
- Do not introduce modules, external APIs, hotlinked assets or a required build step.
- Keep the game playable at 360px phone width and 1280px desktop width.
- New cases must use original characters, locations and mysteries.
- When changing clue IDs, update evidence lists, links, timeline events, notebook content and save behavior together.

## Verification

1. Run `npm install` once when setting up the repository.
2. Run `npm test` for the full UI playthrough, strict S+ rank, mistake hints and save/continue.
3. Confirm every JavaScript `#id` reference exists once in `index.html`.
4. Test the final public build visually on desktop and mobile before release.
