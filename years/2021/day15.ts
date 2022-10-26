// https://adventofcode.com/2021/day/15
// https://adventofcode.com/2021/day/15/input

const { readFileSync } = require('fs');
const Map2D = require('../lib/Map2D');
const Vector2 = require('../lib/Vector2');
const { deepStrictEqual: equal } = require('assert');

/**
 * @param {Map2D} map
 * @param {string} line
 * @returns {Map2D}
 */
function parseLine(map, line, y) {
  for (let x = 0; x < line.length; x++) map.set(x, y, line[x]);
  return map;
}
const map = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .reduce(parseLine, new Map2D());
const testMap = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`
  .split('\n')
  .reduce(parseLine, new Map2D());

// First Star:
/**
 * @param {Map2D} map
 * @param {Vector2} start
 * @param {Vector2} end
 */
function lowestRisk(map, start, end) {
  start = start.copy;
  end = end.copy;
  const risk = 0;
  const visited = { [start.toString()]: true };
  const queue = [start];
  while (queue) {
    for (const neighbour of map.getNeighbours(...start)) {
    }
  }
  return 0;
}
equal(lowestRisk(testMap, new Vector2(0, 0), new Vector2(testMap.xMax, testMap.yMax)), 40);
console.log({ lowestRisk: lowestRisk(map, new Vector2(), 0) });

// Second Star:
