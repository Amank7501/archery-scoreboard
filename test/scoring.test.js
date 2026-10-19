const test = require('node:test');
const assert = require('node:assert/strict');
const { pointsFor, isValidCircle, bonusFor } = require('../src/scoring');

test('round 1: A is worth 5 and E is worth 1', () => {
  assert.equal(pointsFor('A', 1), 5);
  assert.equal(pointsFor('E', 1), 1);
});

test('each round adds 1 to every circle: round 4 A is 8, E is 4', () => {
  assert.equal(pointsFor('A', 4), 8);
  assert.equal(pointsFor('E', 4), 4);
});

test('F is always worth 0', () => {
  assert.equal(pointsFor('F', 1), 0);
  assert.equal(pointsFor('F', 9), 0);
});

test('circles A to F are valid', () => {
  for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) assert.equal(isValidCircle(letter), true);
});

test('anything else is not a circle: G, lowercase, two letters, empty', () => {
  for (const value of ['G', 'a', 'AB', '']) assert.equal(isValidCircle(value), false);
});

test('two archers on the same circle give a bonus of 2', () => {
  assert.equal(bonusFor('B', 'B'), 2);
});

test('two archers on different circles give no bonus', () => {
  assert.equal(bonusFor('A', 'C'), 0);
});

test('two misses (F and F) give no bonus', () => {
  assert.equal(bonusFor('F', 'F'), 0);
});
