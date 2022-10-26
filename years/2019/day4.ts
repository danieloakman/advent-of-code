// @ts-check
// https://adventofcode.com/2019/day/4
// https://adventofcode.com/2019/day/4/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
const { range, subStrings } = require('../lib/utils');
const { ok: assert } = require('assert');
// import { iter as iterate } from 'iteragain';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split('-').map(Number));

// First Star:
/**
 * @param {number} min
 * @param {number} max
 */
function validPasswords(min, max) {
  return range(min, max + 1)
    .map(num => num.toString())
    .filter(str => {
      const digits = str.split('');
      // Has an adjacent double:
      return (
        digits.some((_, i) => digits[i] === digits[i + 1]) &&
        // Has a non-decreasing sequence:
        digits.every((digit, i) => i === 0 || digit >= digits[i - 1])
      );
    })
    .toArray();
}
console.log({ numOfValidPasswords: validPasswords(...input()).length });

// Second Star:
function isValid2(password) {
  const pairs = subStrings(password, 2, true).toArray();
  if (!pairs.every(pair => pair[0] <= pair[1])) return false;
  for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++)
    if (pairs[pairIdx][0] === pairs[pairIdx][1]) {
      if (
        (pairIdx === 0 || pairs[pairIdx - 1][0] !== pairs[pairIdx - 1][1]) &&
        (pairIdx === pairs.length - 1 || pairs[pairIdx + 1][0] !== pairs[pairIdx + 1][1])
      )
        return true;
      pairIdx++;
    }

  return false;
}
function validPasswords2(min, max) {
  return range(min, max + 1)
    .map(num => num.toString())
    .filter(isValid2)
    .toArray();
}
assert(isValid2('112233'));
assert(!isValid2('123444'));
assert(isValid2('111122')); // Fix for this
console.log({ numOfValidPasswords2: validPasswords2(...input()).length });
