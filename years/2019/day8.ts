// @ts-check

import { readFileSync } from 'fs';
const once = require('lodash/once');
// import { iter as iterate } from 'iteragain';
import { /* ok as assert, */ deepStrictEqual as equals } from 'assert';
import { partitionArray } from '../../lib/utils';

/** @see https://adventofcode.com/2019/day/8/input */
const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split('').map(Number));

// https://adventofcode.com/2019/day/8 First Star:
class Image {
  static pixelMap = {
    0: ' ',
    1: '#',
    2: '?',
  };

  /**
   * @param {number[]} ints
   * @param {number} width
   * @param {number} height
   */
  constructor(ints, width, height) {
    this.layers = [];
    this.width = width;
    this.height = height;
    for (let i = 0; i < ints.length; i += width * height) this.layers.push(ints.slice(i, i + width * height));
  }

  /** For the first star. */
  checkSum() {
    const layer = this.layers.reduce((a, b) => (a.filter(x => x === 0).length < b.filter(x => x === 0).length ? a : b));
    return layer.filter(x => x === 1).length * layer.filter(x => x === 2).length;
  }

  /** Fore the second star. */
  print() {
    const pixels = new Array(this.layers[0].length).fill(2);
    for (let i = 0; i < this.layers.length; i++)
      for (let j = 0; j < this.layers[i].length; j++) {
        const pixel = this.layers[j][i];
        if (pixel < 2) {
          pixels[i] = pixel;
          break;
        }
      }

    console.log(
      '\n' +
        partitionArray(pixels, this.height)
          .map(row => row.map(v => Image.pixelMap[v]).join(''))
          .join('\n'),
    );
  }
}

const testImage = new Image([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], 3, 2);
equals(testImage.layers[0], [1, 2, 3, 4, 5, 6]);
const image = new Image(input(), 25, 6);
console.log({ firstStar: image.checkSum() });

// https://adventofcode.com/2019/day/8#part2 Second Star:
// new Image([0,2,2,2,1,1,2,2,2,2,1,2,0,0,0,0], 2, 2).print();
image.print(); // TODO: Pretty sure this is correct, DrVkD just doesn't pass and unsure why.
