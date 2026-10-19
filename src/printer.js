function section(title, entries) {
  return [title, '-'.repeat(title.length), ...entries, ''];
}

function scoreLines(entries, key) {
  return entries.map((entry) => `${entry.name}: ${entry[key]}`);
}

function joinNames(names) {
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function scoreboardText(results, heading = `Round ${results.round}`) {
  return [
    heading,
    ...section('Team scores', scoreLines(results.teamScores, 'score')),
    ...section('Individual scores', scoreLines(results.archerScores, 'score')),
    ...section('Bonus points', scoreLines(results.bonuses, 'bonus')),
  ].join('\n');
}

function correctionHeading({ round, archer, from, to }) {
  return `Round ${round} (corrected: ${archer} ${from} -> ${to})`;
}

function substitutionText({ team, reserve, injured, fromRound }) {
  return [`${team}: ${reserve} replaces ${injured} from round ${fromRound}.`, ''].join('\n');
}

function explainLine(item, nameWidth) {
  const name = item.kind === 'BONUS' ? 'Bonus' : item.archer;
  const circle = item.kind === 'BONUS' ? ' ' : item.circle;
  let note = '';
  if (item.kind === 'BONUS') note = `  (both hit ${item.circle})`;
  if (item.correctedFrom) note = `  (corrected from ${item.correctedFrom})`;
  return `Round ${item.round}  ${name.padEnd(nameWidth)}  ${circle}  ${item.points}${note}`;
}

function explainText({ team, round, total, items }) {
  const nameWidth = Math.max('Bonus'.length, ...items.map((item) => (item.archer || '').length));
  return [
    `${team}: ${total} points after round ${round}`,
    ...items.map((item) => explainLine(item, nameWidth)),
    '',
  ].join('\n');
}

function rejectedText(line, reason, retryRound) {
  const waiting = retryRound === undefined ? '' : ` Waiting for round ${retryRound} again.`;
  return [`Rejected line "${line}": ${reason}.${waiting}`, ''].join('\n');
}

function gameOverText(winners) {
  return `Game over. ${joinNames(winners)} won.`;
}

module.exports = {
  scoreboardText,
  correctionHeading,
  substitutionText,
  explainText,
  rejectedText,
  gameOverText,
};
