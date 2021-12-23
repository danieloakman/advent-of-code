'use strict';

const { readFileSync } = require('fs');

// let fish = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
//   .split(',')
//   .filter(v => v)
//   .map(parseFloat);
//   // .join('');

// function stringSplice (str, index, count = 1, add = '') {
//   return str.slice(0, index) + add + str.slice(index + count);
// }

function breedFish (numOfDays) {
  const fishFile = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
    .split(',')
    .filter(v => v)
    .map(parseFloat);
  let numOfFish = fishFile.length;
  while (fishFile.length) {
    const fish = [fishFile.shift()];
    for (let day = 0; day < numOfDays; day++) {
      const thisDaysAmountOfFish = fish.length;
      for (let i = 0; i < thisDaysAmountOfFish; i++) {
        if (fish[i] === 0) {
          fish[i] = 6;
          fish.push(8);
          numOfFish++;
        } else
          fish[i]--;
      }
    }
  }
  return numOfFish;
}

// Silver star:
console.log('After 80 days:', breedFish(80));

// for (let day = 0; day < 80; day++) {
//   let thisDaysAmountOfFish = fish.length;
//   for (let i = 0; i < thisDaysAmountOfFish; i++) {
//     if (fish[i] === '0') {
//       fish += '8';
//       fish = stringSplice(fish, i, 1, '6');
//     }
//     fish = stringSplice(fish, i, 1, (parseFloat(fish[i]) - 1).toString());
//     fish[i] = parseFloat(fish[i]--).toString();
//     if (fish[i] === '-1') {
//       fish.push(8);
//       fish[i] = 6;
//     }
//   }
//   console.log(`Day ${day}: ${fish.length}`);
// }

// Gold star:
// for (let day = 0; day < 256; day++) {
//   let thisDaysAmountOfFish = fish.length;
//   for (let i = 0; i < thisDaysAmountOfFish; i++) {
//     if (--fish[i] === -1) {
//       fish.push(8);
//       fish[i] = 6;
//     }
//   }
//   console.log({ day, amountOfFish: fish.length, percChange: thisDaysAmountOfFish / fish.length });
// }
// console.log({ amountOfFish: fish.length });
console.log('After 256 days:', breedFish(256));