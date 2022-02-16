'use strict';
// https://adventofcode.com/2015/day/1

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

// First Star:
let floor = 0;
let firstBasement = null;
let charNum = 0;
for (const char of input) {
  charNum++;
  if (char === '(')
    floor++;
  else
    floor--;
  if (floor === -1 && firstBasement === null)
    firstBasement = charNum;
}
console.log({ floor });

// Second Star:
console.log({ firstBasement });
