# Project Instructions

## Goal

Maintain a dependency-free 2D browser detective game that can run by double-clicking `index.html`.

## Architecture

- `index.html`: stable semantic shell. Keep element IDs synchronized with `game.js`.
- `assets/`: compressed original scene and portrait artwork. Do not replace it with official or hotlinked copyrighted artwork.
- `styles.css`: visual-novel layout, responsive behavior, atmosphere, and interface animation.
- `game.js`: all state, content, clues, interviews, deduction questions, audio, and save logic.
- Save key: `conan-midnight-case-save-v4` in `localStorage`.

## Editing rules

- Preserve direct `file://` compatibility; do not introduce ES modules, fetch calls, or a required build step.
- Keep the game playable on a 360px-wide phone and a 1280px desktop.
- This is a private, non-commercial fan prototype. Do not add official images, music, video, or extracted franchise assets.
- New cases should use new suspects and original mysteries even when established Conan characters frame the investigation.
- When changing clue IDs, update `CORE_EVIDENCE`, `REQUIRED_LINKS`, timeline events, notebook content, and save behavior together.

## Verification

1. Run `node --check game.js`.
2. Open `index.html` directly in Chromium.
3. Complete prologue, pin all five required statements, finish all five evidence mini-games, inspect eight core objects, solve the five-slot timeline, lock the five required links, reconstruct all five final slots, and reach an ending.
4. Confirm the browser console has no errors at desktop and mobile widths.
