import { useMemo } from 'react';
import { Heart } from 'lucide-react';

export default function FloatingHearts({ count = 16 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        duration: 14 + Math.random() * 14,
        delay: -Math.random() * 24,
        drift: (Math.random() - 0.5) * 80,
        opacity: 0.18 + Math.random() * 0.3,
      })),
    [count]
  );

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--drift': `${h.drift}px`,
            '--heart-opacity': h.opacity,
          }}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </span>
      ))}
    </div>
  );
}
