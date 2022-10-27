// https://adventofcode.com/2021/day/11

import { readFileSync } from 'fs';
const Map2D = require('../../lib/Map2D');
import { deepStrictEqual as equal } from 'assert';

class OctopusMap extends Map2D {
  static create(input) {
    const map = new OctopusMap();
    input.split(/[\n\r]+/).forEach((str, y) => {
      const row = str.split('').map(Number);
      for (let x = 0; x < row.length; x++) map.set(x, y, row[x]);
    });
    return map;
  }

  inc(x, y) {
    if (this.has(x, y)) this.map[`${x},${y}`]++;
    else this.map[`${x},${y}`] = 1;
  }
}
const inputMap = () => OctopusMap.create(readFileSync(__filename.replace('.ts', '-input'), 'utf-8'));
const testMap1 = () =>
  OctopusMap.create(
    `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`,
  );
const testMap2 = () =>
  OctopusMap.create(
    `11111
19991
19191
19991
11111`,
  );

// First star:
/**
 * @param {number} steps
 * @param {OctopusMap} map
 * @returns {number} Number of flashes.
 */
function simulate(steps, map, returnFirstAllFlashStep = false) {
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    // console.log(`\nStep: ${step}\n` + map.toString());
    const hasFlashed = new Map2D();
    function flash(x, y) {
      if (map.get(x, y) > 9 && !hasFlashed.get(x, y)) {
        hasFlashed.set(x, y, true);
        flashes++;
        for (const p of map.getNeighbours(x, y, false)) {
          map.inc(p.x, p.y);
          flash(p.x, p.y);
        }
      }
    }
    for (const { x, y } of map.getValues()) map.inc(x, y);
    for (const { x, y } of map.getValues()) flash(x, y);
    for (const { x, y } of map.getValues()) if (map.get(x, y) > 9) map.set(x, y, 0);

    if (returnFirstAllFlashStep && [...hasFlashed.getValues()].length === [...map.getValues()].length) return step + 1;
  }
  // console.log(`\nStep: ${steps}\n` + map.toString());
  return flashes;
}
equal(simulate(2, testMap2()), 9);
equal(simulate(10, testMap1()), 204);
equal(simulate(100, testMap1()), 1656);
console.log({ flashes: simulate(100, inputMap()) });

// Second star:
equal(simulate(Infinity, testMap1(), true), 195);
console.log({ firstAllFlashStep: simulate(Infinity, inputMap(), true) });
