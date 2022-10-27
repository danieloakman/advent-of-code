const { readFileSync } = require('fs');
const { deepStrictEqual: equal } = require('assert');
const { sum } = require('../../lib/utils');

function getInput() {
  return readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
    .split(',')
    .filter(v => v)
    .map(parseFloat);
}
const testInput = () => [3, 4, 3, 1, 2];

function breedFish(numOfDays, fishArr = getInput()) {
  let numOfFish = fishArr.length;
  while (fishArr.length) {
    const fish = [fishArr.shift()];
    for (let day = 0; day < numOfDays; day++) {
      const thisDaysAmountOfFish = fish.length;
      for (let i = 0; i < thisDaysAmountOfFish; i++) {
        if (fish[i] === 0) {
          fish[i] = 6;
          fish.push(8);
          numOfFish++;
        } else fish[i]--;
      }
    }
  }
  return numOfFish;
}

// First star:
equal(breedFish(18, testInput()), 26);
equal(breedFish(80, testInput()), 5934);
console.log('After 80 days:', breedFish(80));

// Second star:
/** Much improved algorithm. */
function breedFish2(numOfDays, fishArr = getInput()) {
  fishArr = fishArr.reduce((arr, fish) => {
    arr[fish]++;
    return arr;
  }, new Array(8).fill(0));
  for (let day = 0; day < numOfDays; day++) {
    const b = fishArr.shift();
    fishArr[6] = (fishArr[6] || 0) + b;
    fishArr[8] = (fishArr[8] || 0) + b;
    // console.log({ day: day + 1, sum: fishArr.reduce(sum) });
  }
  return fishArr.reduce(sum);
}
equal(breedFish2(18, testInput()), 26);
equal(breedFish2(80, testInput()), 5934);
equal(breedFish2(256, testInput()), 26984457539);
console.log('After 256 days:', breedFish2(256));
