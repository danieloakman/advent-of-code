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
