// https://adventofcode.com/2021/day/1

const { readFileSync } = require('fs');
const { join } = require('path');
const nums = readFileSync(join(__dirname, 'day1-input'), { encoding: 'utf-8' }).split('\n').map(parseFloat);

// Silver star:
let numOfIncreases = 0;
nums.forEach((num, i, nums) => {
  if (num > nums[i - 1]) numOfIncreases++;
});
console.log('Silver star:', numOfIncreases);

// Gold star:
function safeNum(num) {
  return typeof num === 'number' && !isNaN(num) ? num : 0;
}
function find(i) {
  return safeNum(nums[i]) + safeNum(nums[i + 1]) + safeNum(nums[i + 2]);
}
numOfIncreases = 0;
for (let i = 0; i < nums.length; i++) {
  if (find(i + 1) > find(i)) numOfIncreases++;
}
console.log('Gold star:', numOfIncreases);
