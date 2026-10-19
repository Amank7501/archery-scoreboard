const fs = require('fs');
const { run } = require('./run');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

function readInput(path) {
  try {
    return readLines(path);
  } catch (error) {
    const problem = error.code === 'ENOENT' ? 'file not found' : error.message;
    console.error(`Cannot read "${path}": ${problem}`);
    process.exit(1);
  }
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node src/main.js <input-file>');
    process.exit(1);
  }
  process.stdout.write(run(readInput(path)));
}

main();
