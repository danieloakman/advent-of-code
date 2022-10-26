'use strict';
// https://adventofcode.com/2015/day/4

const { readFileSync } = require('fs');
const { hash } = require('../lib/utils');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

// First Star:
for (let i = 0; ; i++) {
  const h = hash(input + i, 'md5');
  if (h.startsWith('00000')) {
    console.log(i);
    break;
  }
}

// Second Star:
for (let i = 0; ; i++) {
  const h = hash(input + i, 'md5');
  if (h.startsWith('000000')) {
    console.log(i);
    break;
  }
}
