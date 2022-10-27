// https://adventofcode.com/2015/day/15
// https://adventofcode.com/2015/day/15/input

import { readFileSync } from 'fs';
import { groupBy } from '../../lib/utils';

const ingredients = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [capacity, durability, flavour, texture, calories] = str.match(/-?\d+/g).map(Number);
    return {
      name: str.match(/^[^: ]+/)[0].replace(': ', ''),
      capacity,
      durability,
      flavour,
      texture,
      calories,
    };
  });

function* combinations(nums = 4, sumTotal = 100) {
  // const
}

// First Star:
function bestCookie(ingredients) {
  const INGREDIENT_COUNT = 100;
  const scores = [];

  for (const ingredient of ingredients) {
  }
  return scores.sort()[0];
}
console.log({ score: bestCookie(ingredients) });

// Second Star:
