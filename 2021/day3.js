'use strict';

const { readFileSync } = require('fs');
const binaryInput = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/);
  // .map(parseFloat);

// Silver star:

let sorted = Array.from(new Array(binaryInput[0].length), _ => [0, 0]);
binaryInput.forEach(binary => {
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
console.log({ powerConsumption: parseInt(gammaRate, 2) * parseInt(epsilonRate, 2) });

// Gold star:
function filterToOne (arr, predicate) {
  for (let i = arr.length - 1; i > -1 && arr.length > 1; i--) {
    if (!predicate(arr[i]))
      arr.splice(i, 1);
  }
  return arr;
}
let oxy = binaryInput.slice();
let co2 = binaryInput.slice();
for (let i = 0; i < binaryInput[0].length; i++) {
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
// NOT CORRECT:
console.log({ lifeSupportRating: parseInt(oxy[0], 2) * parseInt(co2[0], 2) });
