const { isValidCircle } = require('./scoring');

function error(line, reason) {
  return { type: 'ERROR', reason, line };
}

function splitList(text) {
  return text.split(',').map((item) => item.trim());
}

function hasEmpty(items) {
  return items.some((item) => item === '');
}

function parseTeams() {
  return { type: 'TEAMS' };
}

function parseTeam(line) {
  const match = line.match(/^([^:]+):([^;]+);\s*reserve\s+(.+)$/);
  if (!match) {
    return error(line, 'team line must look like "Team: Archer, Archer; reserve Archer"');
  }
  const name = match[1].trim();
  const archers = splitList(match[2]);
  const reserve = match[3].trim();
  if (name === '' || hasEmpty(archers)) {
    return error(line, 'team line has an empty name');
  }
  return { type: 'TEAM', name, archers, reserve };
}

function parseOrder(line) {
  const archers = splitList(line.replace(/^ORDER\s*/, ''));
  if (hasEmpty(archers)) {
    return error(line, 'ORDER needs a comma-separated list of archers');
  }
  return { type: 'ORDER', archers };
}

function parseRound(line) {
  const circles = splitList(line);
  if (hasEmpty(circles)) {
    return error(line, 'round line has an empty entry');
  }
  const invalid = circles.find((circle) => !isValidCircle(circle));
  if (invalid !== undefined) {
    return error(line, `${invalid} is not a circle`);
  }
  return { type: 'ROUND', circles };
}

function parseCorrection(line) {
  const match = line.match(/^CORRECTION\s+([^:]+):\s*(.*)$/);
  if (!match) {
    return error(line, 'CORRECTION must look like "CORRECTION Archer: Circle"');
  }
  const archer = match[1].trim();
  const circle = match[2].trim();
  if (!isValidCircle(circle)) {
    return error(line, `${circle === '' ? 'missing circle' : circle + ' is not a circle'}`);
  }
  return { type: 'CORRECTION', archer, circle };
}

function parseSubstitute(line) {
  const match = line.match(/^SUBSTITUTE\s+(.+?)\s*->\s*(.+)$/);
  if (!match) {
    return error(line, 'SUBSTITUTE must look like "SUBSTITUTE Injured -> Reserve"');
  }
  return { type: 'SUBSTITUTE', injured: match[1].trim(), reserve: match[2].trim() };
}

function parseExplain(line) {
  const team = line.replace(/^EXPLAIN\s*/, '');
  if (team === '') {
    return error(line, 'EXPLAIN needs a team name');
  }
  return { type: 'EXPLAIN', team };
}

function parseLine(rawLine) {
  const line = rawLine.trim();
  if (line === '') return { type: 'BLANK' };
  if (line === 'TEAMS') return parseTeams();

  // Order matters: team lines are detected by ":", and CORRECTION lines
  // also contain ":", so the keyword commands must be checked before it.
  if (/^ORDER\b/.test(line)) return parseOrder(line);
  if (/^CORRECTION\b/.test(line)) return parseCorrection(line);
  if (/^SUBSTITUTE\b/.test(line)) return parseSubstitute(line);
  if (/^EXPLAIN\b/.test(line)) return parseExplain(line);
  if (line.includes(':')) return parseTeam(line);
  return parseRound(line);
}

module.exports = { parseLine };
