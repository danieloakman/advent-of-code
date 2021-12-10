'use strict';

const { readFileSync } = require('fs');
const commands = readFileSync(__filename.replace('.js', '-input'), { encoding: 'utf-8' })
  .split(/[\n\r]+/)
  .map(str => str.split(' ').map((v, i) => i === 1 ? parseInt(v) : v));

// Silver star:
let x = 0, y = 0;
commands.forEach(([command, amount]) => {
  switch (command) {
    case 'forward':
      x += amount;
      break;
    case 'down':
      y += amount;
      break;
    case 'up':
      y -= amount;
      break;
  }
});
console.log(x * y);

// Gold star:
