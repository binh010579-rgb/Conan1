# Project Instructions

## Goal

Maintain a dependency-free 2D browser detective game that can run by double-clicking `index.html`.

## Architecture

- `index.html`: stable semantic shell. Keep element IDs synchronized with `game.js`.
- `styles.css`: all procedural scene and portrait art. Do not add remote fonts, CDNs, or hotlinked copyrighted artwork.
- `game.js`: all state, content, clues, interviews, deduction questions, audio, and save logic.
- Save key: `conan-midnight-case-save-v1` in `localStorage`.

## Editing rules

- Preserve direct `file://` compatibility; do not introduce ES modules, fetch calls, or a required build step.
- Keep the game playable on a 360px-wide phone and a 1280px desktop.
- This is a private, non-commercial fan prototype. Do not add official images, music, video, or extracted franchise assets.
- New cases should use new suspects and original mysteries even when established Conan characters frame the investigation.
- When changing clue IDs, update `REQUIRED_CLUES`, deductions, notebook content, and save migration behavior together.

## Verification

1. Run `node --check game.js`.
2. Open `index.html` directly in Chromium.
3. Complete prologue, collect six core clues, interview all suspects, finish all five deductions, and reach an ending.
4. Confirm the browser console has no errors at desktop and mobile widths.
