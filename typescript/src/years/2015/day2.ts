// https://adventofcode.com/2015/day/2

import once from 'lodash/once';
import { Solution, newLine } from '@lib';

class Present {
  constructor(public length: number, public width: number, public height: number) {}

  get area() {
    const area = 2 * this.length * this.width + 2 * this.width * this.height + 2 * this.height * this.length;
    return area + this.smallestSideArea;
  }

  get ribbonLength() {
    return this.volume + this.smallestPerimeter;
  }

  get volume() {
    return this.length * this.width * this.height;
  }

  get smallestPerimeter() {
    const [a, b] = [this.length, this.width, this.height].sort((a, b) => a - b);
    return a + a + b + b;
  }

  get smallestSideArea() {
    return Math.min(...[this.length * this.width, this.width * this.height, this.height * this.length]);
  }
}

const presents = once((input: string) =>
  input
    .split(newLine)
    .map(line => new Present(...(line.split('x').map(Number) as [number, number, number]))),
);

export const solution = new Solution(
  2015,
  2,
  async (input) => {
    return presents(input).reduce((p, box) => p + box.area, 0);
  },

  async (input) => {
    return presents(input).reduce((p, box) => p + box.ribbonLength, 0);
  }
);

solution.main(import.meta.path);
