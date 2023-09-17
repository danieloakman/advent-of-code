// https://adventofcode.com/2015/day/7

import { Solution, newLine } from '@lib';
import once from 'lodash/once';
import memoize from 'lodash/memoize';
import { equal } from 'js-utils';

function parseInput(signal: string, map: any) {
  signal = signal.trim();
  return once(/\d+/.test(signal) ? () => Number(signal) : () => map[signal]());
}

// interface Circuit {
//   [key: string]: () => number;
// }

function createCircuit(input: string) {
  return input.split(newLine).reduce((map, str) => {
    const [input, output] = str.split('->').map(str => str.trim());
    if (/AND/.test(input)) {
      const [a, b] = input.split(' AND ').map(signal => parseInput(signal, map));
      map[output] = () => a() & b();
    } else if (/OR/.test(input)) {
      const [a, b] = input.split(' OR ').map(signal => parseInput(signal, map));
      map[output] = () => a() | b();
    } else if (/LSHIFT/.test(input)) {
      const [a, b] = input.split(' LSHIFT ').map(signal => parseInput(signal, map));
      map[output] = () => a() << b();
    } else if (/RSHIFT/.test(input)) {
      const [a, b] = input.split(' RSHIFT ').map(signal => parseInput(signal, map));
      map[output] = () => a() >> b();
    } else if (/NOT/.test(input)) {
      const a = parseInput(input.replace('NOT ', ''), map);
      map[output] = () => ~a();
    } else {
      map[output] = parseInput(input, map);
    }
    return map;
  }, {} as any);
}

const sigA = memoize((input: string) => createCircuit(input).a());

// // First Star:
// const signalA = createCircuit().a();
// console.log({ signalA });

// // Second Star:
// const circuit = createCircuit();
// circuit.b = () => signalA;
// console.log({ signalA: circuit.a() });

export const solution = new Solution(
  2015,
  7,
  async input => sigA(input),
  async input => {
    const circuit = createCircuit(input);
    circuit.b = () => sigA(input);
    return circuit.a();
  },
);

solution
  .test.todo('examples', () => {
    const circuit = createCircuit(
      `
  123 -> x
  456 -> y
  x AND y -> d
  x OR y -> e
  x LSHIFT 2 -> f
  y RSHIFT 2 -> g
  NOT x -> h
  NOT y -> i
  `.trim(),
    );
    equal(circuit.d(), 72);
    equal(circuit.e(), 507);
    equal(circuit.f(), 492);
    equal(circuit.g(), 114);
    equal(circuit.h(), 65412);
    equal(circuit.i(), 65079);
    equal(circuit.x(), 123);
    equal(circuit.y(), 456);
  })
  .main(import.meta.path);
