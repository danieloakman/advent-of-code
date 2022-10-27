// @ts-check
// https://adventofcode.com/2019/day/5
// https://adventofcode.com/2019/day/5/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
const { deepCopy } = require('../../lib/utils');
// import { iter as iterate } from 'iteragain';
const {
  // ok: assert,
  deepStrictEqual: equal,
} = require('assert');

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(',').map(Number));

// First Star:
/**
 * @param {number} num
 */
function parseInstruction(num) {
  const op = parseInt(num.toString().slice(-2));
  const modes = num.toString().slice(0, -2).split('').reverse().map(Number);
  // console.log(num, { op, modes: modes.join() });
  return { op, modes };
}
/**
 * @param {number[]} numArr
 */
function process(numArr, input = [1]) {
  numArr = deepCopy(numArr);
  const value = (i, mode) => (mode === 1 ? i : numArr[i]);
  const outputs = [];
  loop: for (let i = 0; i < numArr.length; ) {
    const { op, modes } = parseInstruction(numArr[i]);
    const [a, b, c] = numArr.slice(i + 1, i + 4);
    switch (op) {
      case 1: {
        numArr[c] = value(a, modes.shift()) + value(b, modes.shift());
        i += 4;
        break;
      }
      case 2: {
        numArr[c] = value(a, modes.shift()) * value(b, modes.shift());
        i += 4;
        break;
      }
      case 3: {
        numArr[a] = input.shift();
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
        numArr[c] = value(a, modes.shift()) < value(b, modes.shift()) ? 1 : 0;
        i += 4;
        break;
      }
      case 8: {
        numArr[c] = value(a, modes.shift()) === value(b, modes.shift()) ? 1 : 0;
        i += 4;
        break;
      }
      case 99:
        break loop;
    }
  }
  return { numArr, outputs };
}
equal(process([1002, 4, 3, 4, 33]).numArr, [1002, 4, 3, 4, 99]);
equal(process([1101, 100, -1, 4, 0]).numArr, [1101, 100, -1, 4, 99]);
console.log({ lastOutput: process(input()).outputs.pop() });

// Second Star:
equal(process([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [8]).outputs.pop(), 1);
equal(process([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [7]).outputs.pop(), 0);
equal(process([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [7]).outputs.pop(), 1);
equal(process([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [8]).outputs.pop(), 0);
equal(process([3, 3, 1108, -1, 8, 3, 4, 3, 99], [8]).outputs.pop(), 1);
equal(process([3, 3, 1108, -1, 8, 3, 4, 3, 99], [7]).outputs.pop(), 0);
equal(process([3, 3, 1107, -1, 8, 3, 4, 3, 99], [7]).outputs.pop(), 1);
equal(process([3, 3, 1107, -1, 8, 3, 4, 3, 99], [8]).outputs.pop(), 0);
equal(process([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [0]).outputs.pop(), 0);
equal(process([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [1]).outputs.pop(), 1);
equal(process([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], [0]).outputs.pop(), 0);
equal(process([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], [1]).outputs.pop(), 1);
equal(
  process(
    [
      3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4,
      20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99,
    ],
    [7],
  ).outputs.pop(),
  999,
);
equal(
  process(
    [
      3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4,
      20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99,
    ],
    [8],
  ).outputs.pop(),
  1000,
);
console.log({ lastOutput: process(input(), [5]).outputs.pop() });
