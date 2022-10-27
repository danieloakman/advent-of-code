// https://adventofcode.com/2019/day/7
// https://adventofcode.com/2019/day/7/input

import { readFileSync } from 'fs';
const once = require('lodash/once');
import { iter as iterate } from 'iteragain';
import { deepCopy } from '../../lib/utils';
import { deepStrictEqual as equal } from 'assert';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(',').map(Number));

// First Star:
/**
 * @param {number[]} integers
 * @param {number[]} inputs
 */
function intCodeProcess(integers, inputs = [1]) {
  integers = deepCopy(integers);

  const value = (i, mode) => {
    const v = mode === 1 ? i : integers[i];
    if (isNaN(v) || typeof v !== 'number') throw new Error(`Invalid value: ${v}, mode: ${mode}, i: ${i}`);
    return v;
  };
  const parseInstruction = num => {
    const op = parseInt(num.toString().slice(-2));
    const modes = num.toString().slice(0, -2).split('').reverse().map(Number);
    // console.log(num, { op, modes: modes.join() });
    return { op, modes };
  };

  const outputs = [];
  loop: for (let i = 0; i < integers.length; ) {
    const { op, modes } = parseInstruction(integers[i]);
    const [a, b, c] = integers.slice(i + 1, i + 4);
    switch (op) {
      case 1: {
        integers[c] = value(a, modes.shift()) + value(b, modes.shift());
        i += 4;
        break;
      }
      case 2: {
        integers[c] = value(a, modes.shift()) * value(b, modes.shift());
        i += 4;
        break;
      }
      case 3: {
        if (!inputs.length) throw new Error('No more input');
        integers[a] = inputs.shift();
        i += 2;
        break;
      }
      case 4: {
        outputs.push(value(a, modes.shift()));
        i += 2;
        break;
      }
      case 5: {
        i = value(a, modes.shift()) !== 0 ? value(b, modes.shift()) : i + 3;
        break;
      }
      case 6: {
        i = value(a, modes.shift()) === 0 ? value(b, modes.shift()) : i + 3;
        break;
      }
      case 7: {
        integers[c] = value(a, modes.shift()) < value(b, modes.shift()) ? 1 : 0;
        i += 4;
        break;
      }
      case 8: {
        integers[c] = value(a, modes.shift()) === value(b, modes.shift()) ? 1 : 0;
        i += 4;
        break;
      }
      case 99:
        break loop;
    }
  }
  return { integers, outputs };
}

/**
 * @param {number[]} integers
 * @param {[number, number, number, number, number]} phaseInputs
 */
function processPhases(integers, phaseInputs, feedbackLoop = false) {
  let output = 0;
  while (phaseInputs.length) {
    const processed = intCodeProcess(integers, [phaseInputs.shift(), output]);
    output = processed.outputs[0];
    integers = processed.integers;
  }
  return output;
}

/**
 * @param {number} min
 * @param {number} max
 */
function phases(min, max) {
  return iterate(
    (function* () {
      for (let a = min; a <= max; a++)
        for (let b = min; b <= max; b++)
          if (b !== a)
            for (let c = min; c <= max; c++)
              if (c !== a && c !== b)
                for (let d = min; d <= max; d++)
                  if (d !== a && d !== b && d !== c)
                    for (let e = min; e <= max; e++)
                      if (e !== a && e !== b && e !== c && e !== d) yield [a, b, c, d, e];
    })(),
  );
}

function findBestSignal(integers, feedbackLoop = false) {
  return phases(...(feedbackLoop ? [5, 9] : [0, 4])).reduce(
    (best, p) => Math.max(best, processPhases(integers, p, feedbackLoop)),
    0,
  );
}
equal(processPhases([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], [4, 3, 2, 1, 0]), 43210);
console.log({ bestSignal: findBestSignal(input()) });

// Second Star: TODO
// equal(processPhases([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5], [9,8,7,6,5]), 139629729);
// equal(processPhases([3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10], [9,7,8,5,6]), 18216);
// console.log();
