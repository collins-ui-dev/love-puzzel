import { Check, Lock } from 'lucide-react';
import { stages } from '../data/puzzleData';

export default function StageProgress({ completed, current, onSelect }) {
  return (
    <nav className="stage-progress" aria-label="Stage progress">
      {stages.map((stage, i) => {
        const unlocked = i === 0 || completed[i - 1];
        const done = completed[i];
        const isCurrent = i === current;
        const state = done ? 'done' : isCurrent ? 'current' : unlocked ? 'open' : 'locked';

        return (
          <div className="stage-step" key={stage.id}>
            {i > 0 && (
              <span className={`stage-line ${completed[i - 1] ? 'filled' : ''}`} aria-hidden="true" />
            )}
            <button
              type="button"
              className={`stage-dot ${state} ${isCurrent ? 'is-current' : ''}`}
              disabled={!unlocked}
              onClick={() => onSelect(i)}
              aria-label={`Stage ${stage.id}: ${stage.title}${!unlocked ? ' (locked)' : done ? ' (completed)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              title={unlocked ? stage.title : 'Solve the previous puzzle to unlock'}
            >
              {done ? <Check size={16} strokeWidth={3} /> : !unlocked ? <Lock size={14} /> : stage.id}
            </button>
            <span className={`stage-name ${isCurrent ? 'is-current' : ''}`}>Stage {stage.id}</span>
          </div>
        );
      })}
    </nav>
  );
}
