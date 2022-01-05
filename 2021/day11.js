'use strict';

const { readFileSync } = require('fs');

const map = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.split('').map(parseFloat));

// First star:
function get (x, y) {
  return (map[y] && typeof map[y][x] === 'number')
    ? map[y][x]
    : Infinity;
}
function inc (x, y) {
  if (map[y] && typeof map[y][x] === 'number')
    map[y][x]++;
}
function set (x, y, value) {
  if (map[y] && typeof map[y][x] === 'number')
    map[y][x] = value;
}
function getAdjacent (x, y) {
  return [
    { x, y: y - 1 }, // up
    { x, y: y + 1 }, // down
    { x: x - 1, y }, // left
    { x: x + 1, y }, // right
    { x: x - 1, y: y - 1 }, // up-left
    { x: x + 1, y: y - 1 }, // up-right
    { x: x - 1, y: y + 1 }, // down-left
    { x: x + 1, y: y + 1 } // down-right
  ].filter(p => p.y >= 0 && p.y < map.length && p.x >= 0 && p.x < map[p.y].length);
}
function* cells () {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      yield { x, y };
    }
  }
}
function simulate (steps) {
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    const hasFlashed = Array.from(new Array(map.length), _ => new Array(map[0].length).fill(false));
    function flash (x, y) {
      if (get(x, y) > 9 && !hasFlashed[y][x]) {
        hasFlashed[y][x] = true;
        flashes++;
        for (const p of getAdjacent(x, y)) {
          inc(p.x, p.y);
          flash(p.x, p.y);
        }
      }
    }
    for (const { x, y } of cells())
      inc(x, y);
    for (const { x, y } of cells())
      flash(x, y);
    for (const { x, y } of cells())
      if (get(x, y) > 9)
        set(x, y, 0);

    // Second star:
    if (hasFlashed.every(row => row.every(v => v)))
      console.log(`Every cell has flashed on step ${step + 1}.`);
  }
  return flashes;
}
console.log({ flashes: simulate(1000) });
