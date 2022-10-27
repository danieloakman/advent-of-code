// https://adventofcode.com/2019/day/2
// https://adventofcode.com/2019/day/2/input

import { readFileSync } from 'fs';
import { deepCopy } from '../../lib/utils';
import { deepEqual } from 'assert';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/,/).map(Number);

// First Star:
function process(input, noun = input[1], verb = input[2]) {
  input = deepCopy(input);
  input[1] = noun;
  input[2] = verb;
  loop: for (let i = 0; i < input.length; i += 4) {
    const [op, a, b, c] = input.slice(i, i + 4);
    switch (op) {
      case 1:
        input[c] = input[a] + input[b];
        break;
      case 2:
        input[c] = input[a] * input[b];
        break;
      case 99:
        break loop;
    }
  }
  return input;
}
deepEqual(process([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99]);
deepEqual(process([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99]);
deepEqual(process([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801]);
deepEqual(process([1, 1, 1, 4, 99, 5, 6, 0, 99]), [30, 1, 1, 4, 2, 5, 6, 0, 99]);
console.log({ result: process(input)[0] });

// Second Star:
loop: for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++) {
    if (process(input, noun, verb)[0] === 19690720) {
      console.log({ noun, verb, result: 100 * noun + verb });
      break loop;
    }
  }
}
