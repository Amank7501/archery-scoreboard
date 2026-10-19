const RING_CIRCLES = 'ABCDE';
const MISS = 'F';
const VALID_CIRCLES = RING_CIRCLES + MISS;
const ARCHERS_PER_TEAM = 2;
// Both archers of a team hit the same circle in a round: the team gets 2 points.
const BONUS_POINTS = 2;

function isValidCircle(letter) {
  return typeof letter === 'string' && letter.length === 1 && VALID_CIRCLES.includes(letter);
}

// In round 1, A is worth 5 and E is worth 1. Every circle is worth 1 more
// than in the round before. F (a miss) is always worth 0.
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

module.exports = { pointsFor, isValidCircle, bonusFor, ARCHERS_PER_TEAM };
