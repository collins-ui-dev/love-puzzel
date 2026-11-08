import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GRID_SIZE, TOTAL_PIECES } from '../data/puzzleData';

// Each tile shows one 1/16th slice of the (square) photo.
function tileStyle(pieceId, image) {
  const col = pieceId % GRID_SIZE;
  const row = Math.floor(pieceId / GRID_SIZE);
  const step = GRID_SIZE - 1;
  return {
    backgroundImage: `url("${image}")`,
    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
    backgroundPosition: `${(col / step) * 100}% ${(row / step) * 100}%`,
  };
}

export default function PuzzleBoard({ order, image, disabled, solved, showHint, onSwap }) {
  const boardRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [selected, setSelected] = useState(null);

  const indexAt = (x, y) => {
    const r = boardRef.current?.getBoundingClientRect();
    if (!r || x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
    const col = Math.min(GRID_SIZE - 1, Math.floor(((x - r.left) / r.width) * GRID_SIZE));
    const row = Math.min(GRID_SIZE - 1, Math.floor(((y - r.top) / r.height) * GRID_SIZE));
    return row * GRID_SIZE + col;
  };

  // Tap/click (or Enter/Space): pick a piece, then pick another to swap with it.
  const tapSelect = (index) => {
    if (selected === null) setSelected(index);
    else if (selected === index) setSelected(null);
    else {
      onSwap(selected, index);
      setSelected(null);
    }
  };

  const handleDown = (e, index) => {
    if (disabled) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({
      from: index,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      size: rect.width,
      moved: false,
    });
  };

  const handleMove = (e) => {
    if (!drag) return;
    const moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 8;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
    if (moved) setOver(indexAt(e.clientX, e.clientY));
  };

  const handleUp = (e) => {
    if (!drag) return;
    if (drag.moved) {
      const target = indexAt(e.clientX, e.clientY);
      if (target !== null && target !== drag.from) onSwap(drag.from, target);
      setSelected(null);
    } else {
      tapSelect(drag.from);
    }
    setDrag(null);
    setOver(null);
  };

  const handleCancel = () => {
    setDrag(null);
    setOver(null);
  };

  const handleKey = (e, index) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tapSelect(index);
    }
  };

  const dragging = drag && drag.moved;

  return (
    <div className={`board ${solved ? 'solved' : ''}`} ref={boardRef} role="group" aria-label="Photo puzzle board">
      {Array.from({ length: TOTAL_PIECES }, (_, index) => {
        const pieceId = order[index];
        const classes = [
          'tile',
          pieceId === index ? 'placed' : '',
          dragging && drag.from === index ? 'dragging' : '',
          dragging && over === index && over !== drag.from ? 'over' : '',
          selected === index ? 'selected' : '',
          disabled ? 'locked' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={index}
            className={classes}
            style={tileStyle(pieceId, image)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`Puzzle piece at position ${index + 1}`}
            onPointerDown={(e) => handleDown(e, index)}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleCancel}
            onKeyDown={(e) => handleKey(e, index)}
          />
        );
      })}

      <div
        className={`hint-layer ${showHint ? 'show' : ''}`}
        style={{ backgroundImage: `url("${image}")` }}
        aria-hidden="true"
      />

      {dragging &&
        createPortal(
          <div
            className="drag-ghost"
            style={{
              ...tileStyle(order[drag.from], image),
              width: drag.size,
              height: drag.size,
              left: drag.x - drag.dx,
              top: drag.y - drag.dy,
            }}
          />,
          document.body
        )}
    </div>
  );
}
