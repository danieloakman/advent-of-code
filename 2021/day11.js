'use strict';

const { readFileSync } = require('fs');
const { Map2D } = require('../lib/utils');
const { deepStrictEqual: equal } = require('assert');

class OctopusMap extends Map2D {
  constructor() {
    super();
  }

  inc (x, y) {
    if (this.has(x, y))
      this.map[`${x},${y}`]++;
    else
      this.map[`${x},${y}`] = 1;
  }
}

function createMap (input) {
  const map = new OctopusMap();
  input.split(/[\n\r]+/).forEach((str, y) => {
    const row = str.split('').map(Number);
    for (let x = 0; x < row.length; x++)
      map.set(x, y, row[x]);
  });
  return map;
}
const inputMap = () => createMap(readFileSync(__filename.replace('.js', '-input'), 'utf-8'));
const testMap = () => createMap(
`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`
);

// First star:
/**
 * @param {number} steps
 * @param {OctopusMap} map
 * @returns {number} Number of flashes.
 */
function simulate (steps, map) {
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    const hasFlashed = new Map2D();
    function flash (x, y) {
      if (map.get(x, y) > 9 && !hasFlashed.get(x, y)) {
        hasFlashed.set(x, y, true);
        flashes++;
        for (const p of map.getNeighbours(x, y, false)) {
          map.inc(p.x, p.y);
          flash(p.x, p.y);
        }
      }
    }
    for (const { x, y } of map.getValues())
      map.inc(x, y);
    for (const { x, y } of map.getValues())
      flash(x, y);
    for (const { x, y } of map.getValues())
      if (map.get(x, y) > 9)
        map.set(x, y, 0);

    // if (hasFlashed.every(row => row.every(v => v)))
    //   console.log(`Every cell has flashed on step ${step + 1}.`);
  }
  return flashes;
}
equal(simulate(10, testMap()), 204);
equal(simulate(100, testMap()), 1656);
console.log({ flashes: simulate(1000, inputMap()) });

// Second star:
