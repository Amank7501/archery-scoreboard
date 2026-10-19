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

function rejectedText(line, reason, retryRound) {
  const waiting = retryRound === undefined ? '' : ` Waiting for round ${retryRound} again.`;
  return [`Rejected line "${line}": ${reason}.${waiting}`, ''].join('\n');
}

function gameOverText(winners) {
  return `Game over. ${joinNames(winners)} won.`;
}

module.exports = { scoreboardText, correctionHeading, rejectedText, gameOverText };
