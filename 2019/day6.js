'use strict';
// @ts-check
// https://adventofcode.com/2019/day/6
// https://adventofcode.com/2019/day/6/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
// const { iterate } = require('iterare');
const { deepStrictEqual: equals } = require('assert');

/**
 * @param {string[]} input 
 * @returns {{ [key: string]: () => number }}
 */
function parseOrbits (input) {
  return input.reduce((map, line) => {
    const [parent, child] = line.split(')');
    map[child] = () => 1 + (map[parent] ? map[parent]() : 0);
    return map;
  }, {});
}
const input = once(() => parseOrbits(readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(/[\n\r]+/)));
const testInput = once(() => parseOrbits(['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L']));

// First Star:
/**
 * @param {{ [key: string]: () => number }} orbits
 * @returns {number}
 */
function countOrbits (orbits) {
  return Object.values(orbits).reduce((sum, v) => sum + v(), 0);
}
equals(countOrbits(testInput()), 42);
console.log({ totalNumOfOrbits: countOrbits(input()) });

// Second Star:


