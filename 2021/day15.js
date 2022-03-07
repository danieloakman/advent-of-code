'use strict';
// https://adventofcode.com/2021/day/15
// https://adventofcode.com/2021/day/15/input

const { readFileSync } = require('fs');
const Map2D = require('../lib/Map2D');

/**
 * @param {Map2D} map 
 * @param {string} line 
 * @returns {Map2D}
 */
function parseLine (map, line) {
  for (let x = 0; x < line.length; x++)
    map.set(x, y, line[x]);
  return map;
}
const map = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .reduce(parseLine, new Map2D());
const testMap =
`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`.split('\n').reduce(parseLine, new Map2D());

// First Star:
function lowestRisk (map, start, end) {

}

// Second Star:


