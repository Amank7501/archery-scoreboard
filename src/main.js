const fs = require('fs');
const { parseLine } = require('./parser');
const { createTournament, addTeam, setOrder, playRound, correctArrow } = require('./tournament');
const { roundResults, findWinners } = require('./results');
const { scoreboardText, correctionHeading, rejectedText, gameOverText } = require('./printer');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

// SUBSTITUTE and EXPLAIN are ignored until later phases.
function apply(state, command) {
  if (command.type === 'ERROR') return { ok: false, reason: command.reason };
  if (command.type === 'TEAM') return addTeam(state, command);
  if (command.type === 'ORDER') return setOrder(state, command.archers);
  if (command.type === 'ROUND') return playRound(state, command.circles);
  if (command.type === 'CORRECTION') return correctArrow(state, command.archer, command.circle);
  return { ok: true };
}

function isScoringLine(command) {
  return command.type === 'ROUND' || command.type === 'CORRECTION';
}

function headingFor(command, result) {
  return command.type === 'CORRECTION' ? correctionHeading(result) : undefined;
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
  if (!isScoringLine(command)) return false;

  console.log(scoreboardText(roundResults(state), headingFor(command, result)));
  // Assumption: a correction can also end the game (e.g. 58 corrected up to 61).
  // A correction sent after the winning round is never read, although the
  // judges might want to correct that round.
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
