'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const map = readFileSync(join(__dirname, 'day3-input'), { encoding: 'utf-8' })
  .split('\n')
  .filter(v => v)
  .map(v => v.replace('\r', '').split(''));

// Gold Star:
let trees = 0;
let x = 0,
    y = 0;
while (y < map.length) {
  if (map[y][x % map[y].length] === '#')
    trees++;
  x += 3;
  y += 1;
}
console.log({ trees });

// Silver Star:
const slopes = [
  { x: 0, y: 0, xInc: 1, yInc: 1, trees: 0 },
  { x: 0, y: 0, xInc: 3, yInc: 1, trees: 0 },
  { x: 0, y: 0, xInc: 5, yInc: 1, trees: 0 },
  { x: 0, y: 0, xInc: 7, yInc: 1, trees: 0 },
  { x: 0, y: 0, xInc: 1, yInc: 2, trees: 0 }
];
while (slopes.some(({ y }) => y < map.length)) {
  for (const slope of slopes) {
    if (slope.y >= map.length)
      continue;
    if (map[slope.y][slope.x % map[slope.y].length] === '#')
      slope.trees++;
    slope.x += slope.xInc;
    slope.y += slope.yInc;
  }
}
console.log(slopes.reduce((p, c) => p * c.trees, 1));
