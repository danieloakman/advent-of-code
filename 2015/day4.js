'use strict';
// https://adventofcode.com/2015/day/4

const { readFileSync } = require('fs');
const { createHash } = require('crypto');
function md5 (input) {
  return createHash('md5').update(input).digest('hex');
}

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

// First Star:
for (let i = 0; ; i++) {
  const hash = md5(input + i);
  if (hash.startsWith('00000')) {
    console.log(i);
    break;
  }
}

// Second Star:
for (let i = 0; ; i++) {
  const hash = md5(input + i);
  if (hash.startsWith('000000')) {
    console.log(i);
    break;
  }
}
