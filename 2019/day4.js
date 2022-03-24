'use strict';
// @ts-check
// https://adventofcode.com/2019/day/4
// https://adventofcode.com/2019/day/4/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
const { range, subStrings } = require('../lib/utils');
const { ok: assert } = require('assert');
// const { iterate } = require('iterare');

const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8').split('-').map(Number));

// First Star:
/**
 * @param {number} min 
 * @param {number} max 
 */
function validPasswords (min, max) {
  return range(min, max + 1)
    .map(num => num.toString())
    .filter(str => {
      const digits = str.split('');
      // Has an adjacent double:
      return digits.some((_, i) => digits[i] === digits[i + 1]) &&
        // Has a non-decreasing sequence:
        digits.every((digit, i) => i === 0 || digit >= digits[i - 1]);
    })
    .toArray();
}
console.log({ numOfValidPasswords: validPasswords(...input()).length });

// Second Star:
function isValid2 (password) {
  const pairs = subStrings(password, 2, true).toArray();
  if (!pairs.every(pair => pair[0] <= pair[1]))
    return false;
  let hasDouble = false;
  for (const pair of pairs) {
    if (pair[0] === pair[1])
      if (hasDouble)
        return false;
      else
        hasDouble = true;
    else if (hasDouble)
      return true;
  }
  return hasDouble;
}
function validPasswords2 (min, max) {
  return range(min, max + 1)
    .map(num => num.toString())
    .filter(isValid2)
    .toArray();
}
assert(isValid2('112233'));
assert(!isValid2('123444'));
assert(isValid2('111122')); // Fix for this
console.log({ numOfValidPasswords2: validPasswords2(...input()).length });
