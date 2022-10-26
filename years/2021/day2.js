'use strict';

const { readFileSync } = require('fs');
const commands = readFileSync(__filename.replace('.js', '-input'), { encoding: 'utf-8' })
  .split(/[\n\r]+/)
  .map(str => str.split(' ').map((v, i) => i === 1 ? parseInt(v) : v));

// Silver star:
let horizontalPos = 0, depth = 0;
commands.forEach(([command, x]) => {
  switch (command) {
    case 'forward':
      horizontalPos += x;
      break;
    case 'down':
      depth += x;
      break;
    case 'up':
      depth -= x;
      break;
  }
});
console.log(horizontalPos * depth);

// Gold star:
horizontalPos = 0, depth = 0;
let aim = 0;
commands.forEach(([command, x]) => {
  switch (command) {
    case 'forward':
      horizontalPos += x;
      depth += aim * x;
      break;
    case 'down':
      aim += x;
      break;
    case 'up':
      aim -= x;
      break;
  }
});
console.log(horizontalPos * depth);
