'use strict';
// https://adventofcode.com/2015/day/3

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

class Houses {
  constructor () {
    this.positions = {};
  }

  inc (x, y) {
    const key = `${x},${y}`;
    if (!this.positions[key])
      this.positions[key] = 1;
    else
      this.positions[key]++;
  }
}
// First Star:
let santa = { x: 0, y: 0 };
let houses = new Houses();
for (const move of input) {
  if (move === '^')
    santa.y--;
  else if (move === 'v')
    santa.y++;
  else if (move === '>')
    santa.x++;
  else if (move === '<')
    santa.x--;
  houses.inc(santa.x, santa.y);
}
console.log({ houses: Object.keys(houses.positions).length });

// Second Star:
santa = { x: 0, y: 0 };
let roboSanta = { x: 0, y: 0 };
houses = new Houses();
for (let i = 0; i < input.length; i++) {
  const move = input[i];
  const s = i % 2 === 0 ? santa : roboSanta;
  if (move === '^')
    s.y--;
  else if (move === 'v')
    s.y++;
  else if (move === '>')
    s.x++;
  else if (move === '<')
    s.x--;
  houses.inc(s.x, s.y);
}
console.log({ houses: Object.keys(houses.positions).length });

