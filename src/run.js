const { parseLine } = require('./parser');
const {
  createTournament,
  addTeam,
  setOrder,
  playRound,
  correctArrow,
  substitute,
  explainTeam,
} = require('./tournament');
const { roundResults, findWinners } = require('./results');
const {
  scoreboardText,
  correctionHeading,
  substitutionText,
  explainText,
  rejectedText,
  gameOverText,
  noWinnerText,
} = require('./printer');

function apply(state, command) {
  if (command.type === 'ERROR') return { ok: false, reason: command.reason };
  if (command.type === 'TEAM') return addTeam(state, command);
  if (command.type === 'ORDER') return setOrder(state, command.archers);
  if (command.type === 'ROUND') return playRound(state, command.circles);
  if (command.type === 'CORRECTION') return correctArrow(state, command.archer, command.circle);
  if (command.type === 'SUBSTITUTE') return substitute(state, command.injured, command.reserve);
  if (command.type === 'EXPLAIN') return explainTeam(state, command.teamName);
  // TEAMS (the header) and blank lines need no action.
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

function rejection(state, line, command, result) {
  const retryRound = lineTypeOf(command) === 'ROUND' ? state.round + 1 : undefined;
  return rejectedText(line, result.reason, retryRound);
}

// Handles one line. Returns the blocks to print and whether the tournament is over.
function handleLine(state, line) {
  const command = parseLine(line);
  const result = apply(state, command);
  if (!result.ok) return { blocks: [rejection(state, line, command, result)], over: false };
  if (command.type === 'SUBSTITUTE') return { blocks: [substitutionText(result)], over: false };
  if (command.type === 'EXPLAIN') return { blocks: [explainText(result)], over: false };
  if (!isScoringLine(command)) return { blocks: [], over: false };

  const blocks = [scoreboardText(roundResults(state), headingFor(command, result))];
  // Assumption: a correction can also end the game (e.g. 58 corrected up to 61).
  // A correction sent after the winning round is never read, although the
  // judges might want to correct that round.
  const winners = findWinners(state);
  if (winners.length === 0) return { blocks, over: false };
  return { blocks: [...blocks, gameOverText(winners)], over: true };
}

function toText(blocks) {
  return blocks.map((block) => `${block}\n`).join('');
}

// Runs the input lines and returns everything to print. Stops after a winner;
// if the input ends first, says so.
function run(lines) {
  const state = createTournament();
  let output = '';
  for (const line of lines) {
    const { blocks, over } = handleLine(state, line);
    output += toText(blocks);
    if (over) return output;
  }
  return output + toText([noWinnerText()]);
}

module.exports = { run };
