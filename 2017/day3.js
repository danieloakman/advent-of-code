'use strict';
// https://adventofcode.com/2017/day/3
// https://adventofcode.com/2017/day/3/input

const { readFileSync } = require('fs');
const { ok: assert } = require('assert');
const { take } = require('../lib/utils');

const input = Number(readFileSync(__filename.replace('.js', '-input'), 'utf-8'));

// First Star:
// function* powers () {
//   for (let i = 1; i; i++)
//     yield i * i;
// }
// console.log(take(powers(), 10));
function spiralDistance (num) {
  if (num < 2)
    return 0;
  for (let sideL = 1, ring = 0;; sideL += 2, ring++) {
    if (sideL * sideL > num) { 
      let a;
    }
  }
}
assert(spiralDistance(1) === 0);
assert(spiralDistance(12) === 3);
assert(spiralDistance(23) === 2);
assert(spiralDistance(1024) === 31);
console.log({ distance: spiralDistance(input) });

// Second Star:


