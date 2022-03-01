'use strict';
// https://adventofcode.com/2017/day/5
// https://adventofcode.com/2017/day/5/input

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(Number);
// const input = [0, 3, 0, 1, -3];

// First Star:
let steps = 0;
for (let i = 0; i < input.length; steps++) {
  const j = i;
  i += input[i];
  input[j]++;
}
console.log({ steps });

// Second Star:


