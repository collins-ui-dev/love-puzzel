import { useMemo } from 'react';

const COLORS = ['#ff8fb8', '#ffc2d9', '#d4bbff', '#b794f6', '#fff1c9', '#ffffff', '#ff6f9f'];

export default function Confetti({ count = 80 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        width: 6 + Math.random() * 7,
        height: 8 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 4,
        spin: 360 + Math.random() * 720,
        sway: (Math.random() - 0.5) * 160,
        round: Math.random() > 0.6,
      })),
    [count]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--spin': `${p.spin}deg`,
            '--sway': `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
}
