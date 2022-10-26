// https://adventofcode.com/2018/day/1

const { readFileSync } = require('fs');
const { sum } = require('../lib/utils');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(Number);

// First Star:
console.log({ frequency: input.reduce(sum, 0) });

// Second Star:
function* loopInfinitely(nums) {
  while (true) for (const num of nums) yield num;
}
const map = {};
let frequency = 0;
for (const num of loopInfinitely(input)) {
  frequency += num;
  if (map[frequency]) {
    console.log({ firstDuplicate: frequency });
    break;
  }
  map[frequency] = 1;
}
