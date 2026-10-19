const fs = require('fs');

function readLines(path) {
  return fs.readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node src/main.js <input-file>');
    process.exit(1);
  }
  readLines(path).forEach((line) => console.log(line));
}

main();
