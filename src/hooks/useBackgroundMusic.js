import { useCallback, useEffect, useRef, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

const PREF_KEY = 'anniversary-puzzle-music';

/**
 * One <audio> element for the whole app, so the music keeps playing between
 * stages and never restarts. Browsers only allow audio after a click, so
 * start() is called from the Start Journey button.
 */
export default function useBackgroundMusic(src) {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(() => readStorage(PREF_KEY) !== 'off');
  const enabledRef = useRef(enabled);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';

    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.src = src;
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, [src]);

  const safePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* missing or blocked audio must never crash the site */
    }
  };

  const start = useCallback(() => {
    if (enabledRef.current) safePlay();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setEnabled(false);
      writeStorage(PREF_KEY, 'off');
    } else {
      setEnabled(true);
      writeStorage(PREF_KEY, 'on');
      safePlay();
    }
  }, []);

  return { start, toggle, playing, available };
}
