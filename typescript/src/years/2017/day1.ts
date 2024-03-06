// https://adventofcode.com/2017/day/1
// https://adventofcode.com/2017/day/1/input

import { iter } from 'iteragain-es';
import { Solution, subStrings, add } from '../../lib';
const last = require('lodash/last');

export const solution = new Solution(2017, 1)
  .firstStar(async input => {
    let num = input[0] === last(input) ? Number(input[0]) : 0;
    for (const pair of subStrings(input, 2, true)) if (pair[0] === pair[1]) num += Number(pair[0]);
    return num;
  })
  .secondStar(async input => {
    return iter(pairs(input)).reduce(add);
  })
  .main(import.meta.path);

function* pairs(input: string) {
  const steps = input.length / 2;
  for (let i = 0; i < input.length; i++) if (input[i] === input[(i + steps) % input.length]) yield Number(input[i]);
}
