// https://adventofcode.com/2015/day/6

import { Solution, downloadInputSync, main } from '../../lib';
import once from 'lodash/once';

type Point = [x: number, y: number];

const input = once(() =>downloadInputSync(2015, 6)
  .split(/[\n\r]+/)
  .map(str => {
    const cmd = str.match(/^\D+/)[0].trim();
    const [start, end] = str
      .replace(cmd, '')
      .trim()
      .split(' through ')
      .map(nums => nums.split(',').map(Number) as Point);
    return { cmd, start, end };
  }));

function* lightsWithin(start: Point, end: Point) {
  for (let x = start[0]; x <= end[0]; x++) {
    for (let y = start[1]; y <= end[1]; y++) {
      yield [x, y] as Point;
    }
  }
}

function countLights(lights: number[][]) {
  return lights.reduce((acc, row) => acc + row.reduce((acc, light) => acc + light, 0), 0);
}

export const solution = new Solution(
  async () => {
    const lights: number[][] = new Array(1000).fill(0).map(() => new Array(1000).fill(0));
    for (const { cmd, start, end } of input()) {
      for (const [x, y] of lightsWithin(start, end)) {
        if (cmd === 'turn on') lights[y][x] = 1;
        else if (cmd === 'turn off') lights[y][x] = 0;
        else if (cmd === 'toggle') lights[y][x] = lights[y][x] === 0 ? 1 : 0;
      }
    }
    return countLights(lights);
  },
  async () => {
    const lights: number[][] = new Array(1000).fill(0).map(() => new Array(1000).fill(0));
    for (const { cmd, start, end } of input()) {
      for (const [x, y] of lightsWithin(start, end)) {
        if (cmd === 'turn on') lights[y][x] += 1;
        else if (cmd === 'turn off') lights[y][x] = Math.max(lights[y][x] - 1, 0);
        else if (cmd === 'toggle') lights[y][x] += 2;
      }
    }
    return countLights(lights);
  },
);

main(module, () => solution.solve());
