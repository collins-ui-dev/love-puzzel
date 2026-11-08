import { Heart, Play } from 'lucide-react';

export default function WelcomeScreen({ hasProgress, onStart }) {
  return (
    <section className="screen welcome">
      <div className="welcome-glow" aria-hidden="true" />
      <div className="glass-card welcome-card">
        <div className="welcome-heart" aria-hidden="true">
          <Heart size={34} fill="currentColor" strokeWidth={0} />
        </div>
        <h1 className="welcome-title">Hey, My Beautiful Pondatti ❤️</h1>
        <p className="welcome-subtitle">
          I have something special for you. Are you ready to unlock our memories?
        </p>
        <button className="btn btn-glow" onClick={onStart}>
          <Play size={18} fill="currentColor" />
          {hasProgress ? 'Continue Journey' : 'Start Journey'}
        </button>
        <p className="welcome-note">Five photos. Five puzzles. Turn the sound on. 🎵</p>
      </div>
    </section>
  );
}
