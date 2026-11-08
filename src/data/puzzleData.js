// ---------------------------------------------------------------------------
//  EVERYTHING you might want to change lives in this file.
//  To swap photos: just replace public/images/photo1.jpg ... photo5.jpg
//  (keep the same file names). To swap music: replace public/music/background.mp3
// ---------------------------------------------------------------------------

const BASE = import.meta.env.BASE_URL;

export const GRID_SIZE = 4; // 4 x 4 = 16 pieces
export const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

export const MUSIC_SRC = `${BASE}music/background.mp3`;

export const stages = [
  {
    id: 1,
    title: 'Our Beginning',
    emoji: '❤️',
    image: `${BASE}images/photo1.jpg`,
    message: 'The first piece is in place, and look how beautifully it fits.',
  },
  {
    id: 2,
    title: 'Beautiful Memories',
    emoji: '🌸',
    image: `${BASE}images/photo2.jpg`,
    message: 'Every little memory fits perfectly when it is with you.',
  },
  {
    id: 3,
    title: 'Through Everything',
    emoji: '🫶',
    image: `${BASE}images/photo3.jpg`,
    message: 'Through everything, we always found our way back to each other.',
  },
  {
    id: 4,
    title: 'Still My Favourite',
    emoji: '💗',
    image: `${BASE}images/photo4.jpg`,
    message: 'Still my favourite person, still my favourite view.',
  },
  {
    id: 5,
    title: 'Forever and Always',
    emoji: '♾️',
    image: `${BASE}images/photo5.jpg`,
    message: 'That was the last piece. Our whole story is ready for you now.',
  },
];

export const TOTAL_STAGES = stages.length;
