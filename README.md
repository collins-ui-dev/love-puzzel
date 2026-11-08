# Our Anniversary – 5 Stages of Memories ❤️

A romantic photo-puzzle website built with React and Vite. Five photos, five 4×4 puzzles,
and a final surprise message that only unlocks after all five are solved.

## Run it (Windows, VS Code or IntelliJ IDEA)

1. Install Node.js (version 18 or newer) from https://nodejs.org if you don't have it.
2. Extract the ZIP and open the `anniversary-puzzle` folder in VS Code or IntelliJ.
3. Open a terminal in that folder and run:

```
npm install
npm run dev
```

4. Open the address shown in the terminal (usually http://localhost:5173).
   To try it on your phone, run `npm run dev -- --host` and open the "Network" address
   on the same Wi-Fi.

## Add your photos and music

- Photos: replace `public/images/photo1.jpg` to `photo5.jpg` (keep the same names).
  Any size works. Each photo is centre-cropped to a square so it is never stretched.
- Music: replace `public/music/background.mp3` (keep the same name).
  If the file is missing, the site still works and the music button is disabled.
- Stage titles, messages and file paths: `src/data/puzzleData.js`
- Final message text: `src/components/FinalSurprise.jsx`

The included photos and music are placeholders so everything works out of the box.

## Share it with her

```
npm run build
```

This creates a `dist` folder. Upload it to any static host (Netlify Drop, Vercel,
GitHub Pages) and send her the link. Remember to add your real photos first.

## How it works

- Puzzle pieces are real slices of the photo (CSS background offsets on a 4×4 grid).
- Drag and drop works with mouse and touch. You can also tap one piece, then another, to swap them.
- A stage counts as complete only when all 16 pieces are in the right place.
- Stage unlocking and progress are saved in localStorage. Refreshing keeps completed stages.
- Music starts when she taps Start Journey (browsers require a tap) and keeps playing between stages.
- To reset progress while testing: browser DevTools → Application → Local Storage → clear
  `anniversary-puzzle-progress-v1`, or finish the story and tap Replay Journey.

## Project structure

```
public/images/photo1-5.jpg     your photos
public/music/background.mp3    your music
src/data/puzzleData.js         stages, titles, image paths
src/components/                WelcomeScreen, PuzzleGame, PuzzleBoard,
                               StageProgress, FinalSurprise, FloatingHearts, Confetti
src/hooks/                     useSquareImage, useBackgroundMusic
src/utils/                     puzzle logic, safe localStorage
```
