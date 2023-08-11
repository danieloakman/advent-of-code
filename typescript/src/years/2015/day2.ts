// https://adventofcode.com/2015/day/2

import once from 'lodash/once';
import { Solution, downloadInputSync, main } from '../../lib';

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

const presents = once(() =>
  downloadInputSync('2015', '2')
    .split(/[\n\r]+/)
    .map(line => new Present(...(line.split('x').map(Number) as [number, number, number]))),
);

export const solution: Solution = {
  firstStar: async () => {
    return presents().reduce((p, box) => p + box.area, 0);
  },

  secondStar: async () => {
    return presents().reduce((p, box) => p + box.ribbonLength, 0);
  }
};

main(module, async () => {
  // First Star:
  console.log('First star:', await solution.firstStar());

  // Second Star:
  console.log('Second star:', await solution.secondStar());
});
