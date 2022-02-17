'use strict';
// https://adventofcode.com/2015/day/2

const { readFileSync } = require('fs');

class Present {
  constructor (length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;
  }

  get area () {
    const area = (2 * this.length * this.width) +
      (2 * this.width * this.height) +
      (2 * this.height * this.length);
    return area + this.smallestSideArea;
  }

  get ribbonLength () {
    return this.volume + this.smallestPerimeter;
  }

  get volume () {
    return this.length * this.width * this.height;
  }

  get smallestPerimeter () {
    const [a, b] = [this.length, this.width, this.height].sort((a, b) => a - b);
    return a + a + b + b;
  }

  get smallestSideArea () {
    return Math.min(...[
      this.length * this.width,
      this.width * this.height,
      this.height * this.length,
    ]);
  }
}

const presents = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(line => new Present(...line.split('x').map(Number)));

// First Star:
console.log({ squareFeetOfWrappingPaper: presents.reduce((p, box) => p + box.area, 0) });

// Second Star:
console.log({ ribbonLength: presents.reduce((p, box) => p + box.ribbonLength, 0) });