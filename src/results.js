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

function teamBonus(state, teamName) {
  const arrows = arrowsOfTeam(state, teamName);
  const bonuses = [];
  for (let round = 1; round <= state.round; round++) {
    const shots = arrows.filter((arrow) => arrow.round === round);
    if (shots.length === 2) {
      bonuses.push(bonusFor(shots[0].circle, shots[1].circle));
    }
  }
  return sum(bonuses);
}

function teamScore(state, teamName) {
  return sum(arrowsOfTeam(state, teamName).map(arrowPoints)) + teamBonus(state, teamName);
}

function archerScore(state, archer) {
  const own = state.arrows.filter((arrow) => arrow.archer === archer);
  return sum(own.map(arrowPoints));
}

// Archers who have shot for the team, in order of their first arrow.
function archersOfTeam(state, teamName) {
  const names = arrowsOfTeam(state, teamName).map((arrow) => arrow.archer);
  return [...new Set(names)];
}

function roundResults(state) {
  return {
    round: state.round,
    teamScores: state.teams.map((team) => ({ name: team.name, score: teamScore(state, team.name) })),
    archerScores: state.teams.flatMap((team) =>
      archersOfTeam(state, team.name).map((name) => ({ name, score: archerScore(state, name) }))
    ),
    bonuses: state.teams.map((team) => ({ name: team.name, bonus: teamBonus(state, team.name) })),
  };
}

module.exports = { roundResults };
