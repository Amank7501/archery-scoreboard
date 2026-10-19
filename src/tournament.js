const { pointItems, teamScore } = require('./results');

function createTournament() {
  return {
    teams: [],
    order: [],
    needsNewOrder: false,
    round: 0,
    arrows: [],
    substituted: new Set(),
  };
}

function ok() {
  return { ok: true };
}

function reject(reason) {
  return { ok: false, reason };
}

// Anyone who is or was on a roster, plus the reserve, so a reserve maps to the right team.
function findTeamOf(state, archer) {
  return state.teams.find((team) => team.members.includes(archer) || team.reserve === archer);
}

function firstDuplicate(names) {
  return names.find((name, index) => names.indexOf(name) !== index);
}

function addTeam(state, { name, archers, reserve }) {
  if (archers.length !== 2) {
    return reject(`${name} must have exactly two archers`);
  }
  state.teams.push({ name, archers: [...archers], members: [...archers], reserve });
  return ok();
}

function isUnusedReserve(state, team, archer) {
  return team.reserve === archer && !state.substituted.has(team.name);
}

function currentArchers(state) {
  return state.teams.flatMap((team) => team.archers);
}

// Checks run in this order, so the first problem found is the one reported.
function orderProblem(state, archers) {
  const teamOf = (archer) => findTeamOf(state, archer);

  const unknown = archers.find((archer) => !teamOf(archer));
  if (unknown !== undefined) return `${unknown} is not an archer of any team`;

  const reserve = archers.find((archer) => isUnusedReserve(state, teamOf(archer), archer));
  if (reserve !== undefined) return `${reserve} is a reserve and has not been substituted in`;

  const replaced = archers.find((archer) => !teamOf(archer).archers.includes(archer));
  if (replaced !== undefined) return `${replaced} has been replaced`;

  const duplicate = firstDuplicate(archers);
  if (duplicate !== undefined) return `${duplicate} appears twice in ORDER`;

  const missing = currentArchers(state).find((archer) => !archers.includes(archer));
  if (missing !== undefined) return `ORDER is missing ${missing}`;

  return null;
}

function setOrder(state, archers) {
  const problem = orderProblem(state, archers);
  if (problem !== null) {
    return reject(problem);
  }
  state.order = [...archers];
  state.needsNewOrder = false;
  return ok();
}

function playRound(state, circles) {
  if (state.order.length === 0) {
    return reject(state.needsNewOrder ? 'send ORDER again after a substitution' : 'no ORDER yet');
  }
  if (circles.length !== state.order.length) {
    return reject(`expected ${state.order.length} circles but got ${circles.length}`);
  }
  state.round += 1;
  state.order.forEach((archer, index) => {
    const team = findTeamOf(state, archer).name;
    const circle = circles[index];
    state.arrows.push({ round: state.round, team, archer, circle, originalCircle: circle });
  });
  return ok();
}

// Anyone on a roster, or who has shot (so a substituted-out archer still counts).
function isKnownArcher(state, archer) {
  return Boolean(findTeamOf(state, archer)) || state.arrows.some((arrow) => arrow.archer === archer);
}

function correctArrow(state, archer, circle) {
  if (state.round === 0) {
    return reject('no round yet');
  }
  if (!isKnownArcher(state, archer)) {
    return reject(`${archer} is not an archer`);
  }
  const arrow = state.arrows.find((a) => a.round === state.round && a.archer === archer);
  if (!arrow) {
    return reject(`${archer} did not shoot in round ${state.round}`);
  }
  if (arrow.circle === circle) {
    return reject(`${archer} already has ${circle} in round ${state.round}`);
  }
  const from = arrow.circle;
  arrow.circle = circle;
  return { ok: true, round: state.round, archer, from, to: circle };
}

function substitutionProblem(state, injured, reserve) {
  // Follows "between rounds" literally: nothing can be substituted before round 1.
  if (state.round === 0) return 'no round yet';

  const team = findTeamOf(state, injured);
  if (!team) return `${injured} is not an archer`;
  if (!team.archers.includes(injured)) return `${injured} is not playing`;
  if (team.reserve !== reserve) return `${reserve} is not ${team.name}'s reserve`;
  if (state.substituted.has(team.name)) return `${team.name} has already used its substitution`;
  return null;
}

function substitute(state, injured, reserve) {
  const problem = substitutionProblem(state, injured, reserve);
  if (problem !== null) {
    return reject(problem);
  }
  const team = findTeamOf(state, injured);
  team.archers[team.archers.indexOf(injured)] = reserve;
  team.members.splice(team.members.indexOf(injured) + 1, 0, reserve);
  state.substituted.add(team.name);
  state.order = [];
  state.needsNewOrder = true;
  return { ok: true, team: team.name, injured, reserve, fromRound: state.round + 1 };
}

function explainTeam(state, teamName) {
  if (!state.teams.some((team) => team.name === teamName)) {
    return reject(`${teamName} is not a team`);
  }
  if (state.round === 0) {
    return reject('no round yet');
  }
  return {
    ok: true,
    team: teamName,
    round: state.round,
    total: teamScore(state, teamName),
    items: pointItems(state, teamName),
  };
}

module.exports = {
  createTournament,
  addTeam,
  setOrder,
  playRound,
  correctArrow,
  substitute,
  explainTeam,
};
