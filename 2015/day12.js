'use strict';
// https://adventofcode.com/2015/day/12

const { readFileSync } = require('fs');
const { matches } = require('../lib/utils');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

// First Star:
let nums = 0;
for (const match of matches(/-?\d+/g, input)) {
  const num = parseInt(match[0]);
  if (!isNaN(num) && input[match.index - 1] !== '"' && input[match.index + match[0].length] !== '"')
    nums += parseInt(num);
}
console.log({ nums });

// Second Star:
function numProps (object) {
  let count = 0;
  if (!Array.isArray(object) && Object.values(object).includes('red'))
    return count;
  for (const key in object) {
    if (typeof object[key] === 'object' && object[key] !== null)
      count += numProps(object[key]);
    if (typeof object[key] === 'number')
      count += object[key];
  }
  return count;
}
console.log({ nums: numProps(JSON.parse(input))} );
