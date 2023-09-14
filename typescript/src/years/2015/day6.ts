// https://adventofcode.com/2015/day/6
import { NDArray } from '@lib/NDArray';
import { Solution, newLine } from '../../lib';
import iter from 'iteragain-es/iter';

type Point = [x: number, y: number];

const mapInput = (input: string) =>
  iter(input.split(newLine)).map(str => {
    const cmd = str.match(/^\D+/)[0].trim();
    const [start, end] = str
      .replace(cmd, '')
      .trim()
      .split(' through ')
      .map(nums => nums.split(',').map(Number) as Point);
    return { cmd, start, end };
  });

function* lightsWithin(start: Point, end: Point) {
  for (let x = start[0]; x <= end[0]; x++) {
    for (let y = start[1]; y <= end[1]; y++) {
      yield [x, y] as Point;
    }
  }
}

// function countLights(lights: number[][]) {
//   return lights.reduce((acc, row) => acc + row.reduce((acc, light) => acc + light, 0), 0);
// }

export const solution = new Solution(
  2015,
  6,
  async input => {
    // const lights = new Map2D<number>();
    const lights = new NDArray(new Uint32Array(1000 * 1000), [1000, 1000]);
    // const lights = new Array2D<number>(1000);
    for (const { cmd, start, end } of mapInput(input)) {
      for (const [x, y] of lightsWithin(start, end)) {
        if (cmd === 'turn on') lights.set([x, y], 1);
        else if (cmd === 'turn off') lights.set([x, y], 0);
        else if (cmd === 'toggle') lights.update([x, y], v => (v === 0 ? 1 : 0));
      }
    }
    return lights.iter().reduce((acc, [, light]) => acc + light, 0);
  },
  async input => {
    const lights = new NDArray(new Uint32Array(1000 * 1000), [1000, 1000]);
    // const lights = new Array2D<number>(1000);
    for (const { cmd, start, end } of mapInput(input)) {
      for (const [x, y] of lightsWithin(start, end)) {
        if (cmd === 'turn on') lights.update([x, y], v => ++v);
        else if (cmd === 'turn off') lights.update([x, y], v => Math.max(v - 1, 0));
        else if (cmd === 'toggle') lights.update([x, y], v => v + 2);
      }
    }
    return lights.iter().reduce((acc, [, light]) => acc + light, 0);
  },
);

solution.main(module);
