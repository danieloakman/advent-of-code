'use strict';

const { ok: assert } = require('assert');
const { readFileSync } = require('fs');
const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/);
const testBinaryNums =
`00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`.split('\n');

// Silver star:
function powerConsumption (binaryNums) {
  let sorted = Array.from(new Array(binaryNums[0].length), _ => [0, 0]);
  binaryNums.forEach(binary => {
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '0')
        sorted[i][0]++;
      else
        sorted[i][1]++;
    }
  });
  let gammaRate = ''; let epsilonRate = '';
  sorted.forEach(([zero, one]) => {
    if (zero > one) {
      gammaRate += '0';
      epsilonRate += '1';
    } else {
      gammaRate += '1';
      epsilonRate += '0';
    }
  });
  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
}
assert(powerConsumption(testBinaryNums) === 198);
console.log({ powerConsumption: powerConsumption(input) });

// Gold star:
function filterToOne (arr, predicate) {
  for (let i = arr.length - 1; i > -1 && arr.length > 1; i--) {
    if (!predicate(arr[i]))
      arr.splice(i, 1);
  }
  return arr;
}
function lifeSupportRating (binaryNums) {
  let oxy = binaryNums.slice();
  let co2 = binaryNums.slice();
  let sorted = Array.from(new Array(binaryNums[0].length), _ => [0, 0]);
  for (let i = 0; i < binaryNums[0].length; i++) {
    if (oxy.length > 1) {
      const oxyChar = sorted[i][0] > sorted[i][1] ? '0' : '1';
      // oxy = oxy.filter(binary => binary[i] === oxyChar);
      filterToOne(oxy, binary => binary[i] === oxyChar);
    }
    if (co2.length > 1) {
      const co2Char = sorted[i][0] > sorted[i][1] ? '1' : '0';
      // co2 = co2.filter(binary => binary[i] === co2Char);
      filterToOne(co2, binary => binary[i] === co2Char);
    }
  }
  return parseInt(oxy[0], 2) * parseInt(co2[0], 2);
}
// NOT CORRECT:
assert(lifeSupportRating(testBinaryNums) === 230);
console.log({ lifeSupportRating: lifeSupportRating(input) });
