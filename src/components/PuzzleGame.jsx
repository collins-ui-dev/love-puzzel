import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Clock, Lightbulb, Move, RotateCcw, Sparkles } from 'lucide-react';
import PuzzleBoard from './PuzzleBoard';
import useSquareImage from '../hooks/useSquareImage';
import { TOTAL_PIECES, TOTAL_STAGES } from '../data/puzzleData';
import { countCorrect, createShuffledOrder, formatTime, isSolved } from '../utils/puzzle';

const HINT_MS = 3000;

export default function PuzzleGame({ stage, index, onComplete, onNext, onFinish }) {
  const isLast = index === TOTAL_STAGES - 1;
  const { url: image } = useSquareImage(stage.image, stage.id);

  const [phase, setPhase] = useState('intro'); // intro -> play -> done
  const [order, setOrder] = useState(() => createShuffledOrder(TOTAL_PIECES));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hint, setHint] = useState(false);
  const hintTimer = useRef(null);

  // Timer only runs while the puzzle is being played.
  useEffect(() => {
    if (phase !== 'play') return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => () => clearTimeout(hintTimer.current), []);

  // Completion detection: the stage only counts once every piece is in place.
  useEffect(() => {
    if (phase === 'play' && isSolved(order)) {
      setPhase('done');
      setHint(false);
      onComplete(index, { moves, seconds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, phase]);

  const swap = (a, b) => {
    if (phase !== 'play' || a === b) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setMoves((m) => m + 1);
  };

  const restart = () => {
    clearTimeout(hintTimer.current);
    setHint(false);
    setOrder(createShuffledOrder(TOTAL_PIECES));
    setMoves(0);
    setSeconds(0);
    setPhase('play');
  };

  const showHint = () => {
    if (phase !== 'play') return;
    setHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(false), HINT_MS);
  };

  const correct = countCorrect(order);
  const percent = phase === 'done' ? 100 : Math.round((correct / TOTAL_PIECES) * 100);

  if (phase === 'intro') {
    return (
      <div className="glass-card intro-card stage-enter">
        <p className="intro-count">Stage {stage.id} of {TOTAL_STAGES}</p>
        <h2 className="intro-title">
          Stage {stage.id} – {stage.title} {stage.emoji}
        </h2>
        <p className="intro-text">Drag the pieces, or tap two of them, to swap places and rebuild the photo.</p>
        <button className="btn btn-glow" onClick={() => setPhase('play')} disabled={!image}>
          {image ? 'Start Puzzle' : 'Loading photo...'}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card game-card stage-enter">
      <h2 className="game-title">
        Stage {stage.id} – {stage.title} {stage.emoji}
      </h2>

      <div className="stats" aria-live="polite">
        <span className="stat"><Move size={16} /> {moves} {moves === 1 ? 'move' : 'moves'}</span>
        <span className="stat"><Clock size={16} /> {formatTime(seconds)}</span>
        <span className="stat"><Sparkles size={16} /> {percent}%</span>
      </div>

      <div className="board-wrap">
        <PuzzleBoard
          order={order}
          image={image}
          disabled={phase !== 'play'}
          solved={phase === 'done'}
          showHint={hint}
          onSwap={swap}
        />
        {phase === 'done' && (
          <div className="burst" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} style={{ '--a': `${i * 30}deg`, '--d': `${i * 40}ms` }}>❤</span>
            ))}
          </div>
        )}
      </div>

      <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Puzzle completion">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-text">{phase === 'done' ? `All ${TOTAL_PIECES} pieces placed` : `${correct} of ${TOTAL_PIECES} pieces in place`}</p>

      {phase === 'play' ? (
        <div className="controls">
          <button className="btn btn-soft" onClick={showHint} disabled={hint}>
            <Lightbulb size={17} /> Hint
          </button>
          <button className="btn btn-soft" onClick={restart}>
            <RotateCcw size={17} /> Restart
          </button>
        </div>
      ) : (
        <div className="success-panel">
          <div className="success-icon"><Check size={26} strokeWidth={3} /></div>
          <h3>Puzzle complete! 🎉</h3>
          <p>{stage.message}</p>
          <p className="success-stats">{moves} moves in {formatTime(seconds)}</p>
          {isLast ? (
            <button className="btn btn-glow" onClick={onFinish}>
              Reveal Our Surprise <Sparkles size={18} />
            </button>
          ) : (
            <button className="btn btn-glow" onClick={onNext}>
              Next Stage <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
