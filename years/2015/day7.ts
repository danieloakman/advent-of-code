// https://adventofcode.com/2015/day/7

import { readFileSync } from 'fs';
import once from 'lodash/once';

function parseInput(signal: string, map: any) {
  signal = signal.trim();
  return once(/\d+/.test(signal) ? () => Number(signal) : () => map[signal]());
}

function createCircuit() {
  return readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
    .split(/[\n\r]+/)
    .reduce((map, str) => {
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

// First Star:
const signalA = createCircuit().a();
console.log({ signalA });

// Second Star:
const circuit = createCircuit();
circuit.b = () => signalA;
console.log({ signalA: circuit.a() });
