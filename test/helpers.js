const { run } = require('../src/run');

// Two teams: X has archers a, b (reserve r); Y has archers c, d (reserve q).
const TEAMS = ['TEAMS', 'X: a, b; reserve r', 'Y: c, d; reserve q'];
const ORDER = 'ORDER a, b, c, d';

// Runs the lines after the standard teams and returns the output text.
function runWithTeams(lines) {
  return run([...TEAMS, ...lines]);
}

// Returns the last "Rejected line ..." message printed for the lines.
function lastRejection(lines) {
  const rejected = runWithTeams(lines).split('\n').filter((l) => l.startsWith('Rejected line'));
  return rejected[rejected.length - 1];
}

module.exports = { TEAMS, ORDER, run, runWithTeams, lastRejection };
