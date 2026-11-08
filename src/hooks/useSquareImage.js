import { useEffect, useState } from 'react';

const MAX_SIDE = 1200;

// Draws a soft placeholder so the game still works if a photo file is missing.
function makePlaceholder(label) {
  const size = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, '#ffc2d9');
  g.addColorStop(1, '#c9b3ff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 6;
  for (let r = 120; r < 760; r += 120) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 380px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(label), size / 2, size / 2 - 20);
  ctx.font = '600 44px sans-serif';
  ctx.fillText(`Add public/images/photo${label}.jpg`, size / 2, size - 110);
  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Loads a photo and centre-crops it to a square, so the 4x4 grid always cuts
 * the picture accurately and nothing is ever stretched or squashed.
 */
export default function useSquareImage(src, label) {
  const [state, setState] = useState({ url: null, missing: false });

  useEffect(() => {
    let cancelled = false;
    setState({ url: null, missing: false });

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const out = Math.min(side, MAX_SIDE);
        const canvas = document.createElement('canvas');
        canvas.width = out;
        canvas.height = out;
        const ctx = canvas.getContext('2d');
        const sx = (img.naturalWidth - side) / 2;
        const sy = (img.naturalHeight - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
        setState({ url: canvas.toDataURL('image/jpeg', 0.92), missing: false });
      } catch {
        setState({ url: src, missing: false });
      }
    };
    img.onerror = () => {
      if (!cancelled) setState({ url: makePlaceholder(label), missing: true });
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, label]);

  return state;
}
