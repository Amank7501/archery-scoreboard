const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { run } = require('../src/run');

function readSample(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'samples', name), 'utf8').replace(/\r\n/g, '\n');
}

test('the sample input produces exactly the expected output', () => {
  const lines = readSample('input.txt').replace(/\n$/, '').split('\n');
  assert.equal(run(lines), readSample('expected-output.txt'));
});
