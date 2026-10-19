const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLine } = require('../src/parser');

function assertError(line, lineType, reason) {
  assert.deepEqual(parseLine(line), { type: 'ERROR', reason, line, lineType });
}

test('round line: an unknown circle is rejected', () => {
  assertError('A,B,A,A,G,A', 'ROUND', 'G is not a circle');
});

test('round line: an empty entry is rejected', () => {
  assertError('A,,B', 'ROUND', 'round line has an empty entry');
});

test('round line: a two-letter entry is still a round line with a bad circle', () => {
  assertError('A,B,AB', 'ROUND', 'AB is not a circle');
});

test('round line: a lowercase entry is still a round line with a bad circle', () => {
  assertError('a,b', 'ROUND', 'a is not a circle');
});

test('unrecognised line: plain words are not recognised', () => {
  assertError('HELLO WORLD', 'UNKNOWN', 'not a recognised line');
});

test('unrecognised line: a misspelt keyword is not recognised', () => {
  assertError('SUBSTITUE a -> q', 'UNKNOWN', 'not a recognised line');
});

test('unrecognised line: a lowercase keyword is not recognised', () => {
  assertError('order a, c', 'UNKNOWN', 'not a recognised line');
});

test('unrecognised line: a single entry with no comma is not recognised', () => {
  assertError('A', 'UNKNOWN', 'not a recognised line');
});

test('team line: a missing reserve is rejected', () => {
  assertError(
    'X: a, b',
    'TEAM',
    'team line must look like "Team: Archer, Archer; reserve Archer"'
  );
});

test('team line: an empty archer name is rejected', () => {
  assertError('X: a, ; reserve r', 'TEAM', 'team line has an empty name');
});

test('ORDER: an empty list is rejected', () => {
  assertError('ORDER', 'ORDER', 'ORDER needs a comma-separated list of archers');
});

test('CORRECTION: a missing colon is rejected', () => {
  assertError('CORRECTION a', 'CORRECTION', 'CORRECTION must look like "CORRECTION Archer: Circle"');
});

test('CORRECTION: an unknown circle is rejected', () => {
  assertError('CORRECTION a: X', 'CORRECTION', 'X is not a circle');
});

test('CORRECTION: a missing circle is rejected', () => {
  assertError('CORRECTION a:', 'CORRECTION', 'missing circle');
});

test('SUBSTITUTE: a missing arrow is rejected', () => {
  assertError('SUBSTITUTE a', 'SUBSTITUTE', 'SUBSTITUTE must look like "SUBSTITUTE Injured -> Reserve"');
});

test('EXPLAIN: a missing team name is rejected', () => {
  assertError('EXPLAIN', 'EXPLAIN', 'EXPLAIN needs a team name');
});

test('names keep their spaces and accents', () => {
  assert.deepEqual(parseLine('Gyrhuna: János Diák, Süsü; reserve Ludas Matyi'), {
    type: 'TEAM',
    name: 'Gyrhuna',
    archers: ['János Diák', 'Süsü'],
    reserve: 'Ludas Matyi',
  });
});
