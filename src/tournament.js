function createTournament() {
  return {
    teams: [],
    order: [],
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

// The reserve counts as a member, so after a substitution they map to the right team.
function findTeamOf(state, archer) {
  return state.teams.find((team) => team.archers.includes(archer) || team.reserve === archer);
}

function firstDuplicate(names) {
  return names.find((name, index) => names.indexOf(name) !== index);
}

function addTeam(state, { name, archers, reserve }) {
  if (archers.length !== 2) {
    return reject(`${name} must have exactly two archers`);
  }
  state.teams.push({ name, archers: [...archers], reserve });
  return ok();
}

function setOrder(state, archers) {
  const unknown = archers.find((archer) => !findTeamOf(state, archer));
  if (unknown !== undefined) {
    return reject(`${unknown} is not an archer of any team`);
  }
  const duplicate = firstDuplicate(archers);
  if (duplicate !== undefined) {
    return reject(`${duplicate} appears twice in ORDER`);
  }
  state.order = [...archers];
  return ok();
}

function playRound(state, circles) {
  if (state.order.length === 0) {
    return reject('no ORDER yet');
  }
  if (circles.length !== state.order.length) {
    return reject(`expected ${state.order.length} circles but got ${circles.length}`);
  }
  state.round += 1;
  state.order.forEach((archer, index) => {
    const team = findTeamOf(state, archer).name;
    state.arrows.push({ round: state.round, team, archer, circle: circles[index] });
  });
  return ok();
}

module.exports = { createTournament, addTeam, setOrder, playRound };
