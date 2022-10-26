// @ts-check
// https://adventofcode.com/2019/day/6
// https://adventofcode.com/2019/day/6/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
// import { iter as iterate } from 'iteragain';
const { deepStrictEqual: equals, equal } = require('assert');
const last = require('lodash/last');

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/));
const testInput1 = once(() => ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L']);
const testInput2 = once(() => [
  'COM)B',
  'B)C',
  'C)D',
  'D)E',
  'E)F',
  'B)G',
  'G)H',
  'D)I',
  'E)J',
  'J)K',
  'K)L',
  'K)YOU',
  'I)SAN',
]);

// First Star:
/**
 * @param {string[]} input
 * @returns {{ [key: string]: { orbits: () => number}, parent: string }}
 */
function parseOrbits(input) {
  return input.reduce((map, line) => {
    const [parent, child] = line.split(')');
    map[child] = {
      orbits: once(() => 1 + (map[parent] ? map[parent].orbits() : 0)),
      parent,
    };
    return map;
  }, {});
}

/**
 * @param {{ [key: string]: { orbits: () => number}, parent: string }} orbits
 * @returns {number}
 */
function countOrbits(orbits) {
  return Object.values(orbits).reduce((sum, v) => sum + v.orbits(), 0);
}

equals(countOrbits(parseOrbits(testInput1())), 42);
console.log({ totalNumOfOrbits: countOrbits(parseOrbits(input())) });

// Second Star:
function countJumps(orbits, from, to) {
  let next;
  const fromJumps = [from];
  while ((next = orbits[last(fromJumps)])) fromJumps.push(next.parent);
  const toJumps = [to];
  while ((next = orbits[last(toJumps)])) {
    if (fromJumps.includes(next.parent)) return toJumps.length + fromJumps.indexOf(next.parent) - 2; // 2 because we don't count the last jump for each.
    toJumps.push(next.parent);
  }
  return 0;
}
equal(countJumps(parseOrbits(testInput2()), 'YOU', 'SAN'), 4);
console.log({ numOfJumps: countJumps(parseOrbits(input()), 'YOU', 'SAN') });
