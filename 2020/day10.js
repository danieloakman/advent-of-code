'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const joltages = readFileSync(join(__dirname, 'day10-input'), { encoding: 'utf-8' })
  .split(/[\n\r]+/)
  .filter(v => v)
  .map(v => parseFloat(v))
  .sort((a, b) => a - b);

// Gold Star:
let diffs1 = 0;
let diffs3 = 0;
joltages.unshift(0);
joltages.push(joltages[joltages.length - 1] + 3);
for (let i = 1; i < joltages.length; i++) {
  if (joltages[i] - joltages[i - 1] === 1)
    diffs1++;
  else if (joltages[i] - joltages[i - 1] === 3)
    diffs3++;
}
console.log('1-jolt differences multiplied by 3-jolt differences:', diffs1 * diffs3);

// Silver Star:
// TODO