'use strict';
// @ts-check
// https://adventofcode.com/2018/day/5
// https://adventofcode.com/2018/day/5/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
// import { iter as iterate } from 'iteragain';
const { deepStrictEqual: equals } = require('assert');
const { stringSplice } = require('../lib/utils');

const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8'));

// First Star:
/**
 * @param {string} polymer
 */
function processPolymer(polymer) {
  for (let i = polymer.length; i > 1; i--) {
    const [a, b] = polymer.slice(i - 2, i);
    if (a && b && a.toLowerCase() === b.toLowerCase() && a !== b) polymer = stringSplice(polymer, i - 2, 2);
  }
  return polymer;
}
equals(processPolymer('dabAcCaCBAcCcaDA'), 'dabCBAcaDA');
console.log('First Star:', processPolymer(input()).length);

// Second Star:
function processPolymer2(polymer) {
  const chars = new Set(polymer.toLowerCase().split(''));
  let best = Infinity;
  for (const char of chars) {
    const regex = new RegExp(`[${char}${char.toUpperCase()}]`, 'g');
    best = Math.min(best, processPolymer(polymer.replace(regex, '')).length);
  }
  return best;
}
equals(processPolymer2('dabAcCaCBAcCcaDA'), 4);
console.log('Second Star:', processPolymer2(input()));
