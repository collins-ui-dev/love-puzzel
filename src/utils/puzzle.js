// order[position] = id of the piece currently sitting at that board position.
// The puzzle is solved when every position holds the piece with the same id.

export function countCorrect(order) {
  let n = 0;
  for (let i = 0; i < order.length; i++) if (order[i] === i) n++;
  return n;
}

export function isSolved(order) {
  return order.length > 0 && countCorrect(order) === order.length;
}

export function createShuffledOrder(total) {
  const order = Array.from({ length: total }, (_, i) => i);
  do {
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // Re-shuffle if too many pieces start in the right place.
  } while (countCorrect(order) > 2);
  return order;
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
