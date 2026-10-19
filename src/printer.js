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

function substitutionText({ teamName, reserve, injured, fromRound }) {
  return [`${teamName}: ${reserve} replaces ${injured} from round ${fromRound}.`, ''].join('\n');
}

const BONUS_LABEL = 'Bonus';

function isBonus(item) {
  return item.kind === 'BONUS';
}

function explainName(item) {
  return isBonus(item) ? BONUS_LABEL : item.archer;
}

function explainNote(item) {
  if (isBonus(item)) return `  (both hit ${item.circle})`;
  if (item.correctedFrom) return `  (corrected from ${item.correctedFrom})`;
  return '';
}

function explainLine(item, nameWidth) {
  const name = explainName(item).padEnd(nameWidth);
  const circle = isBonus(item) ? ' ' : item.circle;
  return `Round ${item.round}  ${name}  ${circle}  ${item.points}${explainNote(item)}`;
}

function explainText({ teamName, round, total, items }) {
  const nameWidth = Math.max(BONUS_LABEL.length, ...items.map((item) => explainName(item).length));
  return [
    `${teamName}: ${total} points after round ${round}`,
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

function noWinnerText() {
  return 'Input ended. No team has reached 60 points.';
}

module.exports = {
  scoreboardText,
  correctionHeading,
  substitutionText,
  explainText,
  rejectedText,
  gameOverText,
  noWinnerText,
};
