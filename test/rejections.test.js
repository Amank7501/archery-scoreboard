const test = require('node:test');
const assert = require('node:assert/strict');
const { ORDER, lastRejection } = require('./helpers');

// Round 1, then X replaces b with its reserve r.
const AFTER_SUBSTITUTION = [ORDER, 'A,A,A,A', 'SUBSTITUTE b -> r'];

test('TEAM: a team must have exactly two archers', () => {
  assert.equal(
    lastRejection(['Z: a; reserve r']),
    'Rejected line "Z: a; reserve r": Z must have exactly two archers.'
  );
});

test('ORDER: a name on no team is rejected', () => {
  assert.equal(
    lastRejection(['ORDER a, z, c, d']),
    'Rejected line "ORDER a, z, c, d": z is not an archer of any team.'
  );
});

test('ORDER: a reserve who has not come in is rejected', () => {
  assert.equal(
    lastRejection(['ORDER a, b, c, r']),
    'Rejected line "ORDER a, b, c, r": r is a reserve and has not been substituted in.'
  );
});

test('ORDER: a replaced archer is rejected', () => {
  assert.equal(
    lastRejection([...AFTER_SUBSTITUTION, 'ORDER a, b, c, d']),
    'Rejected line "ORDER a, b, c, d": b has been replaced.'
  );
});

test('ORDER: a repeated name is rejected', () => {
  assert.equal(
    lastRejection(['ORDER a, a, c, d']),
    'Rejected line "ORDER a, a, c, d": a appears twice in ORDER.'
  );
});

test('ORDER: a current archer left out is rejected', () => {
  assert.equal(
    lastRejection(['ORDER a, b, c']),
    'Rejected line "ORDER a, b, c": ORDER is missing d.'
  );
});

test('ROUND: a round before any ORDER is rejected', () => {
  assert.equal(
    lastRejection(['A,A,A,A']),
    'Rejected line "A,A,A,A": no ORDER yet. Waiting for round 1 again.'
  );
});

test('ROUND: a round right after a substitution needs a new ORDER', () => {
  assert.equal(
    lastRejection([...AFTER_SUBSTITUTION, 'A,A,A,A']),
    'Rejected line "A,A,A,A": send ORDER again after a substitution. Waiting for round 2 again.'
  );
});

test('ROUND: the number of circles must match ORDER', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A']),
    'Rejected line "A,A,A": expected 4 circles but got 3. Waiting for round 1 again.'
  );
});

test('ROUND: an unknown circle is rejected and the same round is awaited', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,G,A']),
    'Rejected line "A,A,G,A": G is not a circle. Waiting for round 1 again.'
  );
});

test('CORRECTION: nothing to correct before round 1', () => {
  assert.equal(
    lastRejection(['CORRECTION a: B']),
    'Rejected line "CORRECTION a: B": no round yet.'
  );
});

test('CORRECTION: an unknown name is not an archer', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'CORRECTION zz: B']),
    'Rejected line "CORRECTION zz: B": zz is not an archer.'
  );
});

test('CORRECTION: a real archer who did not shoot in the latest round', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'CORRECTION r: B']),
    'Rejected line "CORRECTION r: B": r did not shoot in round 1.'
  );
});

test('CORRECTION: correcting to the same circle is rejected', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'CORRECTION a: A']),
    'Rejected line "CORRECTION a: A": a already has A in round 1.'
  );
});

test('SUBSTITUTE: not allowed before round 1', () => {
  assert.equal(
    lastRejection(['SUBSTITUTE a -> r']),
    'Rejected line "SUBSTITUTE a -> r": no round yet.'
  );
});

test('SUBSTITUTE: an unknown injured name is not an archer', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'SUBSTITUTE zz -> r']),
    'Rejected line "SUBSTITUTE zz -> r": zz is not an archer.'
  );
});

test('SUBSTITUTE: a reserve cannot be the injured archer', () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'SUBSTITUTE r -> q']),
    'Rejected line "SUBSTITUTE r -> q": r is not playing.'
  );
});

test("SUBSTITUTE: the reserve must be the team's own reserve", () => {
  assert.equal(
    lastRejection([ORDER, 'A,A,A,A', 'SUBSTITUTE a -> q']),
    `Rejected line "SUBSTITUTE a -> q": q is not X's reserve.`
  );
});

test('SUBSTITUTE: a team can substitute only once', () => {
  assert.equal(
    lastRejection([...AFTER_SUBSTITUTION, 'SUBSTITUTE a -> r']),
    'Rejected line "SUBSTITUTE a -> r": X has already used its substitution.'
  );
});

test('EXPLAIN: an unknown team is rejected', () => {
  assert.equal(lastRejection(['EXPLAIN Z']), 'Rejected line "EXPLAIN Z": Z is not a team.');
});

test('EXPLAIN: nothing to explain before round 1', () => {
  assert.equal(lastRejection(['EXPLAIN X']), 'Rejected line "EXPLAIN X": no round yet.');
});
