'use strict';
// https://adventofcode.com/2016/day/2

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/);

// First Star:
const keypad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const keypos = [
  null,
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 }
];

function get (x, y, map) {
  return (map[y] && typeof map[y][x] === 'number')
    ? map[y][x]
    : null;
}

function moveKey (key, direction) {
  let { x, y } = keypos[key];
  if (direction === 'U')
    y--;
  else if (direction === 'D')
    y++;
  else if (direction === 'L')
    x--;
  else if (direction === 'R')
    x++;
  return get(x, y, keypad) || key;
}

let key = 5;
let keyCode = ''; 
for (const keyDirections of input) {
  for (const direction of keyDirections) {
    key = moveKey(key, direction)
  }
  keyCode += key.toString();
}
console.log({ keyCode });

// Second Star:


