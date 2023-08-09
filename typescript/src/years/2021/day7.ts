import { readFileSync } from 'fs';

const crabs = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(',')
  .filter(v => v)
  .map(parseFloat);

/** Get a random integer from min (inclusive) to max (inclusive). */
// function randInt (min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
function oneStarFuelCost(pos) {
  return crabs.reduce((p, c) => p + Math.abs(c - pos), 0);
}
function twoStarFuelCost(pos) {
  return crabs.reduce((p, c) => {
    let totalCost = 0;
    const inc = Math.sign(pos - c);
    for (let i = 1; c !== pos; i++) {
      totalCost += i;
      c += inc;
    }
    return p + totalCost;
  }, 0);
}
// function getIntBetween (min, max, roundFunc = 'round') {
//   return Math[roundFunc](((max - min) / 2) + min);
// }

// 1st Star:
// const min = Math.min(...crabs);
const max = Math.max(...crabs);
let best = Math.min(...Array.from(new Array(max), (_, i) => oneStarFuelCost(i)));
console.log({ best });

// 2nd Star:
best = Math.min(...Array.from(new Array(max), (_, i) => twoStarFuelCost(i)));
console.log({ best });
