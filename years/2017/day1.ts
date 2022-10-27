// https://adventofcode.com/2017/day/1
// https://adventofcode.com/2017/day/1/input

import { readFileSync } from 'fs';
import { subStrings } from '../../lib/utils';
const last = require('lodash/last');

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8');

// First Star:
let num = input[0] === last(input) ? Number(input[0]) : 0;
for (const pair of subStrings(input, 2, true)) if (pair[0] === pair[1]) num += Number(pair[0]);
console.log({ num });

// Second Star:
function* pairs(input) {
  const steps = input.length / 2;
  for (let i = 0; i < input.length; i++) if (input[i] === input[(i + steps) % input.length]) yield Number(input[i]);
}
console.log({ num: [...pairs(input)].reduce((a, b) => a + b) });
