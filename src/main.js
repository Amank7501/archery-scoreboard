const fs = require('fs');
const { parseLine } = require('./parser');
const { createTournament, addTeam, setOrder, playRound } = require('./tournament');
const { roundResults, findWinners } = require('./results');
const { scoreboardText, rejectedText, gameOverText } = require('./printer');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

// CORRECTION, SUBSTITUTE and EXPLAIN are ignored until later phases.
function apply(state, command) {
  if (command.type === 'ERROR') return { ok: false, reason: command.reason };
  if (command.type === 'TEAM') return addTeam(state, command);
  if (command.type === 'ORDER') return setOrder(state, command.archers);
  if (command.type === 'ROUND') return playRound(state, command.circles);
  return { ok: true };
}

function lineTypeOf(command) {
  return command.type === 'ERROR' ? command.lineType : command.type;
}

function handleRejection(state, line, command, result) {
  const retryRound = lineTypeOf(command) === 'ROUND' ? state.round + 1 : undefined;
  console.log(rejectedText(line, result.reason, retryRound));
}

// Returns true when the tournament is over.
function handleLine(state, line) {
  const command = parseLine(line);
  const result = apply(state, command);
  if (!result.ok) {
    handleRejection(state, line, command, result);
    return false;
  }
  if (command.type !== 'ROUND') return false;

  console.log(scoreboardText(roundResults(state)));
  const winners = findWinners(state);
  if (winners.length === 0) return false;
  console.log(gameOverText(winners));
  return true;
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node src/main.js <input-file>');
    process.exit(1);
  }
  const state = createTournament();
  for (const line of readLines(path)) {
    if (handleLine(state, line)) break;
  }
}

main();
