import { useEffect, useRef, useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import Confetti from './Confetti';

const INTRO = 'Unnakaee veruthudo innu konjo nalliku indha azhgaa pondati...';

const LINES = [
  'Last year, you said these words...',
  'But today, I want you to know something.',
  "Even after all this time, my love for you hasn't lost even 1% of its interest.",
  'Not even a single percent.',
  'Every memory, every smile, every little fight and every moment with you still means everything to me.',
  'I still love you the same, maybe even more.',
  'I still choose you, my beautiful Pondatti.',
  'Happy Anniversary, my chellam! ❤️',
];

const TAGLINE = '5 Memories. 1 Beautiful Story. Infinite Love. ❤️';

// intro + paragraphs + tagline
const ITEMS = [INTRO, ...LINES, TAGLINE];
const CONFETTI_AT = 1 + LINES.length; // when "Happy Anniversary" appears

function delayAfter(shown) {
  if (shown === 0) return 700; // first line
  if (shown === 1) return 3600; // let the opening line breathe
  if (shown === ITEMS.length - 1) return 3200; // before the tagline
  return 2800;
}

export default function FinalSurprise({ onReplay }) {
  const [phase, setPhase] = useState('transition');
  const [shown, setShown] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('reveal'), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'reveal' || shown >= ITEMS.length) return undefined;
    const t = setTimeout(() => setShown((s) => s + 1), delayAfter(shown));
    return () => clearTimeout(t);
  }, [phase, shown]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [shown]);

  const finished = shown >= ITEMS.length;

  return (
    <section className="final">
      <div className="final-aurora" aria-hidden="true" />

      {phase === 'transition' && (
        <div className="final-transition" aria-hidden="true">
          <div className="pulse-heart">
            <Heart size={72} fill="currentColor" strokeWidth={0} />
          </div>
        </div>
      )}

      {shown >= CONFETTI_AT && <Confetti />}

      {phase === 'reveal' && (
        <div className="final-scroll">
          <div className="final-content">
            {ITEMS.slice(0, shown).map((text, i) => {
              const isIntro = i === 0;
              const isTagline = i === ITEMS.length - 1;
              const isCurrent = i === shown - 1 && !finished;
              const cls = [
                'final-line',
                isIntro ? 'final-intro' : '',
                isTagline ? 'final-tagline' : '',
                isCurrent ? 'current' : '',
                i === CONFETTI_AT ? 'final-wish' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <p key={i} className={cls}>
                  {text}
                </p>
              );
            })}

            {finished && (
              <button className="btn btn-glow final-replay" onClick={onReplay}>
                <RotateCcw size={18} /> Replay Journey
              </button>
            )}
            <div ref={endRef} className="final-end" />
          </div>
        </div>
      )}
    </section>
  );
}
