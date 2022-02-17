'use strict';
// https://adventofcode.com/2015/day/10

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

// First Star:
function lookAndSay (str, steps) {
  for (let i = 0; i < steps; i++) {
    const result = [];
    let count = 1;
    let prev = str[0];
    for (let j = 1; j < str.length; j++) {
      if (str[j] === prev)
        count++;
      else {
        result.push(count, prev);
        count = 1;
        prev = str[j];
      }
    }
    result.push(count, prev);
    str = result.join('');
  }
  return str;
}
console.log(lookAndSay(input, 40).length);

// Second Star:
console.log(lookAndSay(input, 50).length);
