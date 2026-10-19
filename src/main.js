const fs = require('fs');
const { parseLine } = require('./parser');
const { createTournament, addTeam, setOrder, playRound } = require('./tournament');
const { roundResults } = require('./results');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

// Temporary wiring (Phase 3): applies TEAM, ORDER and ROUND, stops after round 1.
function apply(state, command) {
  if (command.type === 'ERROR') return { ok: false, reason: command.reason };
  if (command.type === 'TEAM') return addTeam(state, command);
  if (command.type === 'ORDER') return setOrder(state, command.archers);
  if (command.type === 'ROUND') return playRound(state, command.circles);
  return { ok: true };
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node src/main.js <input-file>');
    process.exit(1);
  }
  const state = createTournament();
  for (const line of readLines(path)) {
    const command = parseLine(line);
    const result = apply(state, command);
    if (!result.ok) {
      console.log(`Rejected line "${line}": ${result.reason}`);
    } else if (command.type === 'ROUND') {
      console.log(JSON.stringify(roundResults(state), null, 2));
      break;
    }
  }
}

main();
