const fs = require('fs');
const { run } = require('./run');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node src/main.js <input-file>');
    process.exit(1);
  }
  process.stdout.write(run(readLines(path)));
}

main();
