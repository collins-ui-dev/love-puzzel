import { useCallback, useMemo, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import PuzzleGame from './components/PuzzleGame';
import StageProgress from './components/StageProgress';
import FinalSurprise from './components/FinalSurprise';
import FloatingHearts from './components/FloatingHearts';
import useBackgroundMusic from './hooks/useBackgroundMusic';
import { MUSIC_SRC, TOTAL_STAGES, stages } from './data/puzzleData';
import { readStorage, removeStorage, writeStorage } from './utils/storage';

const STORAGE_KEY = 'anniversary-puzzle-progress-v1';

// Completed stages must be a straight run from Stage 1: nothing can be skipped,
// even if the saved data was edited by hand.
function normalise(list) {
  const out = Array(TOTAL_STAGES).fill(false);
  for (let i = 0; i < TOTAL_STAGES; i++) {
    if (list && list[i] === true) out[i] = true;
    else break;
  }
  return out;
}

function loadProgress() {
  try {
    return normalise(JSON.parse(readStorage(STORAGE_KEY)));
  } catch {
    return normalise(null);
  }
}

const firstIncomplete = (completed) => {
  const i = completed.findIndex((c) => !c);
  return i === -1 ? TOTAL_STAGES - 1 : i;
};

export default function App() {
  const [completed, setCompleted] = useState(loadProgress);
  const [screen, setScreen] = useState('welcome'); // welcome | game | final
  const [stage, setStage] = useState(0);
  const music = useBackgroundMusic(MUSIC_SRC);

  const allDone = useMemo(() => completed.every(Boolean), [completed]);
  const hasProgress = completed.some(Boolean);

  const handleStart = () => {
    music.start();
    if (allDone) {
      setScreen('final');
    } else {
      setStage(firstIncomplete(completed));
      setScreen('game');
    }
  };

  const handleComplete = useCallback((i) => {
    setCompleted((prev) => {
      const unlocked = i === 0 || prev[i - 1];
      if (!unlocked || prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      writeStorage(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const selectStage = (i) => {
    const unlocked = i === 0 || completed[i - 1];
    if (unlocked) setStage(i);
  };

  const handleNext = () => {
    if (completed[stage]) setStage((s) => Math.min(s + 1, TOTAL_STAGES - 1));
  };

  const handleFinish = () => {
    if (allDone) setScreen('final');
  };

  const handleReplay = () => {
    removeStorage(STORAGE_KEY);
    setCompleted(normalise(null));
    setStage(0);
    setScreen('welcome');
  };

  // The final screen can never be reached unless all five puzzles are solved.
  const showFinal = screen === 'final' && allDone;

  return (
    <div className={`app ${showFinal ? 'app-final' : ''}`}>
      <FloatingHearts count={showFinal ? 22 : 16} />

      <button
        className="music-btn"
        onClick={music.toggle}
        disabled={!music.available}
        aria-label={music.playing ? 'Turn music off' : 'Turn music on'}
        title={music.available ? (music.playing ? 'Music on' : 'Music off') : 'Add public/music/background.mp3 to enable music'}
      >
        {music.playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {screen === 'welcome' && <WelcomeScreen hasProgress={hasProgress} onStart={handleStart} />}

      {screen === 'game' && (
        <main className="screen game-screen">
          <StageProgress completed={completed} current={stage} onSelect={selectStage} />
          <PuzzleGame
            key={stages[stage].id}
            stage={stages[stage]}
            index={stage}
            onComplete={handleComplete}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        </main>
      )}

      {showFinal && <FinalSurprise onReplay={handleReplay} />}
    </div>
  );
}
