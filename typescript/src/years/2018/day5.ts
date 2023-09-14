// @ts-check
// https://adventofcode.com/2018/day/5
// https://adventofcode.com/2018/day/5/input

import { readFileSync } from 'fs';
import once from 'lodash/once';
// import { iter as iterate } from 'iteragain-es';
import { deepStrictEqual as equals } from 'assert';
import { stringSplice } from '../../lib/utils';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8'));

// First Star:
function processPolymer(polymer: string) {
  for (let i = polymer.length; i > 1; i--) {
    const [a, b] = polymer.slice(i - 2, i);
    if (a && b && a.toLowerCase() === b.toLowerCase() && a !== b) polymer = stringSplice(polymer, i - 2, 2);
  }
  return polymer;
}
equals(processPolymer('dabAcCaCBAcCcaDA'), 'dabCBAcaDA');
console.log('First Star:', processPolymer(input()).length);

// Second Star:
function processPolymer2(polymer: string) {
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
