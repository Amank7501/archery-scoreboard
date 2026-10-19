const RING_CIRCLES = 'ABCDE';
const MISS = 'F';
const BONUS_POINTS = 2;

function isValidCircle(letter) {
  return typeof letter === 'string' && letter.length === 1 && 'ABCDEF'.includes(letter);
}

function pointsFor(circle, round) {
  if (circle === MISS) return 0;
  return RING_CIRCLES.length - RING_CIRCLES.indexOf(circle) + (round - 1);
}

function bonusFor(circleA, circleB) {
  // Two misses (F, F) give no bonus: F is not a circle, so nothing was "hit".
  // See Bathar in round 5 of the sample: F,F and the bonus stays at 4.
  if (circleA === MISS || circleB === MISS) return 0;
  return circleA === circleB ? BONUS_POINTS : 0;
}

module.exports = { pointsFor, isValidCircle, bonusFor };
