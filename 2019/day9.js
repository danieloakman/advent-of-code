'use strict';
// @ts-check

const { readFileSync } = require('fs');
const once = require('lodash/once');
// import { iter as iterate } from 'iteragain';
const { /* ok: assert, */ deepStrictEqual: equals } = require('assert');
const { deepCopy } = require('../lib/utils');

/** @see https://adventofcode.com/2019/day/9/input */
const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(',').map(Number));

// https://adventofcode.com/2019/day/9 First Star:
class BigArray {
  constructor(arr) {
    this.arr = arr;
  }

  get length() {
    return this.arr.length;
  }

  get(i) {
    if (typeof this.arr[i] === 'undefined') this.arr[i] = 0;
    return this.arr[i];
  }

  set(i, v) {
    this.arr[i] = v;
  }

  get slice() {
    return this.arr.slice.bind(this.arr);
  }
}
/**
 * @param {number[]} integers
 * @param {number[]} inputs
 */
function intCodeProcess(integers, inputs = [1]) {
  const bigArr = new BigArray(deepCopy(integers));
  let relativeBase = 0;
  const outputs = [];

  const value = (i, mode) => {
    let v;
    switch (mode) {
      case 1:
        v = i;
        break;
      case 2:
        v = bigArr.get(i + relativeBase);
        break;
      case 0: // fallthrough
      default:
        v = bigArr.get(i);
        break;
    }
    if (isNaN(v) || typeof v !== 'number') throw new Error(`Invalid value: ${v}, mode: ${mode}, i: ${i}`);
    return v;
  };

  const parseInstruction = num => {
    const op = parseInt(num.toString().slice(-2));
    const modes = num.toString().slice(0, -2).split('').reverse().map(Number);
    // console.log(num, { op, modes: modes.join() });
    return { op, modes };
  };

  loop: for (let i = 0; i < bigArr.length; ) {
    const { op, modes } = parseInstruction(bigArr.get(i));
    const [a, b, c] = bigArr.slice(i + 1, i + 4);
    switch (op) {
      case 1: {
        bigArr.set(c, value(a, modes.shift()) + value(b, modes.shift()));
        i += 4;
        break;
      }
      case 2: {
        bigArr.set(c, value(a, modes.shift()) * value(b, modes.shift()));
        i += 4;
        break;
      }
      case 3: {
        if (!inputs.length) throw new Error('No more input');
        bigArr.set(a, inputs.shift());
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
        bigArr.set(c, value(a, modes.shift()) < value(b, modes.shift()) ? 1 : 0);
        i += 4;
        break;
      }
      case 8: {
        bigArr.set(c, value(a, modes.shift()) === value(b, modes.shift()) ? 1 : 0);
        i += 4;
        break;
      }
      case 9: {
        relativeBase += value(a, modes.shift());
        i += 2;
        break;
      }
      case 99:
        break loop;
    }
  }
  return { integers: bigArr.arr, outputs };
}

equals(
  intCodeProcess([109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99], []).outputs,
  [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],
);
equals(intCodeProcess([1102, 34915192, 34915192, 7, 4, 7, 99, 0], []).outputs, [1219070632396864]);
equals(intCodeProcess([104, 1125899906842624, 99], []).outputs, [1125899906842624]);
console.log({ BOOSTKeyCode: intCodeProcess(input(), [1]).outputs[0] }); // TODO: is incorrect

// https://adventofcode.com/2019/day/9#part2 Second Star:
