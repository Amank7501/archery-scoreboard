const { pointsFor, bonusFor } = require('./scoring');

function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

function arrowPoints(arrow) {
  return pointsFor(arrow.circle, arrow.round);
}

function arrowsOfTeam(state, teamName) {
  return state.arrows.filter((arrow) => arrow.team === teamName);
}

function arrowItem(arrow) {
  const item = {
    round: arrow.round,
    kind: 'ARROW',
    archer: arrow.archer,
    circle: arrow.circle,
    points: arrowPoints(arrow),
  };
  if (arrow.originalCircle !== arrow.circle) item.correctedFrom = arrow.originalCircle;
  return item;
}

function bonusItem(round, shots) {
  const points = bonusFor(shots[0].circle, shots[1].circle);
  return points > 0 ? [{ round, kind: 'BONUS', circle: shots[0].circle, points }] : [];
}

// Every point a team has earned: one item per arrow and one per bonus, round
// by round (arrows in roster order, then the bonus). Scores are sums of these.
function pointItems(state, teamName) {
  const team = state.teams.find((t) => t.name === teamName);
  const arrows = arrowsOfTeam(state, teamName);
  const items = [];
  for (let round = 1; round <= state.round; round++) {
    const shots = arrows
      .filter((arrow) => arrow.round === round)
      .sort((a, b) => team.members.indexOf(a.archer) - team.members.indexOf(b.archer));
    items.push(...shots.map(arrowItem));
    if (shots.length === 2) items.push(...bonusItem(round, shots));
  }
  return items;
}

function teamBonus(state, teamName) {
  const bonuses = pointItems(state, teamName).filter((item) => item.kind === 'BONUS');
  return sum(bonuses.map((item) => item.points));
}

function teamScore(state, teamName) {
  return sum(pointItems(state, teamName).map((item) => item.points));
}

function archerScore(state, archer) {
  const own = state.arrows.filter((arrow) => arrow.archer === archer);
  return sum(own.map(arrowPoints));
}

function roundResults(state) {
  return {
    round: state.round,
    teamScores: state.teams.map((team) => ({ name: team.name, score: teamScore(state, team.name) })),
    // Team members in roster order; a reserve sits after the archer they replaced.
    archerScores: state.teams.flatMap((team) =>
      team.members.map((name) => ({ name, score: archerScore(state, name) }))
    ),
    bonuses: state.teams.map((team) => ({ name: team.name, bonus: teamBonus(state, team.name) })),
  };
}

const WINNING_SCORE = 60;

// Teams that have reached 60, narrowed to the highest score. The spec doesn't
// say what happens on an exact tie; assumption: every tied team is a winner.
function findWinners(state) {
  const scores = state.teams.map((team) => ({ name: team.name, score: teamScore(state, team.name) }));
  const reached = scores.filter((entry) => entry.score >= WINNING_SCORE);
  const top = Math.max(...reached.map((entry) => entry.score));
  return reached.filter((entry) => entry.score === top).map((entry) => entry.name);
}

module.exports = { roundResults, findWinners, pointItems, teamScore };
