const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const path = require('path');

const MAIN = path.join(__dirname, '..', 'src', 'main.js');

test('a missing input file prints a short error and no stack trace', () => {
  const result = spawnSync('node', [MAIN, 'no-such-file.txt'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, 'Cannot read "no-such-file.txt": file not found\n');
});

test('no file argument prints the usage line', () => {
  const result = spawnSync('node', [MAIN], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, 'Usage: node src/main.js <input-file>\n');
});
