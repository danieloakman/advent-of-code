// https://adventofcode.com/2019/day/1
// https://adventofcode.com/2019/day/1/input

import { readFileSync } from 'fs';
import { ok as assert } from 'assert';
import { sum } from '../../lib/utils';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(Number);

// First Star:
/**
 * @param {number} module
 */
function mass(module) {
  return Math.floor(module / 3) - 2;
}
assert(mass('12') === 2);
assert(mass('14') === 2);
assert(mass('1969') === 654);
assert(mass('100756') === 33583);
console.log({ sumOfMass: input.map(mass).reduce(sum) });

// Second Star:
/**
 * @param {number} module
 */
function mass2(module) {
  let total = 0;
  do {
    module = Math.max(mass(module), 0);
    total += module;
  } while (module > 0);
  return total;
}
assert(mass2(14) === 2);
assert(mass2(1969) === 966);
assert(mass2(100756) === 50346);
console.log({ sumOfMass2: input.map(mass2).reduce(sum) });
