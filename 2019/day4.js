'use strict';
// @ts-check
// https://adventofcode.com/2019/day/4
// https://adventofcode.com/2019/day/4/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
const { range } = require('../lib/utils');
// const { iterate } = require('iterare');

const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8').split('-').map(Number));

// First Star:
/**
 * @param {number} min 
 * @param {number} max 
 */
function validPasswords (min, max) {
  return range(min, max + 1)
    .map(password => password.toString())
    .filter(password => {
      const digits = password.split('');
      // Has an adjacent double:
      return digits.some((_, i) => digits[i] === digits[i + 1]) &&
        // Has a non-decreasing sequence:
        digits.every((digit, i) => i === 0 || digit >= digits[i - 1]);
    })
    .toArray();
}
console.log({ numOfValidPasswords: validPasswords(...input()).length });

// Second Star:
function validPasswords2 (min, max) {
  
}

