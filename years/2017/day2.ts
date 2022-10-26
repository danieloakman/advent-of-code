// https://adventofcode.com/2017/day/2

const { readFileSync } = require('fs');
const { sum } = require('../lib/utils');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.trim().split('\t').map(Number));

// First Star:
const checksum = input
  .map(nums => {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return max - min;
  })
  .reduce(sum, 0);

console.log({ checksum });

// Second Star:
function* everyPair(nums) {
  for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) if (i !== j) yield [nums[i], nums[j]];
}
const checksum2 = input.reduce((sum, nums) => {
  for (const [a, b] of everyPair(nums)) if (a % b === 0) return sum + a / b;
  return sum;
}, 0);
console.log({ checksum2 });
