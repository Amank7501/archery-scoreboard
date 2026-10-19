const test = require('node:test');
const assert = require('node:assert/strict');
const { ORDER, runWithTeams } = require('./helpers');

test('a tie at 60 or more: every tied team wins', () => {
  // Both teams hit A with both archers every round. A round n is worth 4+n,
  // so a team earns 2*(4+n) + 2 bonus = 12, 14, 16, 18 in rounds 1-4.
  // Totals: 12, 26, 42, 60. Both reach 60 in round 4, so they tie.
  const output = runWithTeams([ORDER, ...Array(5).fill('A,A,A,A')]);
  assert.match(output, /Round 4\nTeam scores\n-+\nX: 60\nY: 60\n/);
  assert.ok(output.endsWith('Game over. X and Y won.\n'));
  assert.ok(!output.includes('Round 5'), 'reading stops after the winning round');
});

test('a correction that pushes a team to 60 ends the game', () => {
  // X hits A,A in rounds 1-3: 12 + 14 + 16 = 42 (see the tie test).
  // Round 4: A is 8 and B is 7, no bonus, so 15 -> 57 (no winner yet).
  // Correcting b from B to A: 8 + 8 + 2 bonus = 18 -> 42 + 18 = 60.
  // Y misses every arrow (F is 0), so it stays at 0.
  const output = runWithTeams([
    ORDER,
    'A,A,F,F',
    'A,A,F,F',
    'A,A,F,F',
    'A,B,F,F',
    'CORRECTION b: A',
  ]);
  const [beforeCorrection, afterCorrection] = output.split('Round 4 (corrected: b B -> A)');
  assert.match(beforeCorrection, /Round 4\nTeam scores\n-+\nX: 57\n/);
  assert.ok(!beforeCorrection.includes('Game over'));
  assert.match(afterCorrection, /^\nTeam scores\n-+\nX: 60\n/);
  assert.ok(afterCorrection.endsWith('Game over. X won.\n'));
});

test('EXPLAIN after a substitution lists both the replaced archer and the reserve', () => {
  // Round 1: a hits A (5), b hits B (4), no bonus -> 9.
  // b is replaced by r. Round 2: a hits A (6), r hits A (6), bonus 2 -> 14.
  // Total 9 + 14 = 23. Arrows are listed in roster order: a, b, r.
  const output = runWithTeams([
    ORDER,
    'A,B,F,F',
    'SUBSTITUTE b -> r',
    'ORDER r, a, c, d',
    'A,A,F,F',
    'EXPLAIN X',
  ]);
  const expected = [
    'X: 23 points after round 2',
    'Round 1  a      A  5',
    'Round 1  b      B  4',
    'Round 2  a      A  6',
    'Round 2  r      A  6',
    'Round 2  Bonus     2  (both hit A)',
    '',
    '',
  ].join('\n');
  assert.ok(output.endsWith(expected), output);
});
