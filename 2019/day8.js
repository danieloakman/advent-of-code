'use strict';
// @ts-check

const { readFileSync } = require('fs');
const once = require('lodash/once');
// const { iterate } = require('iterare');
const { ok: assert, deepStrictEqual: equals } = require('assert');
// const {  } = require('../lib/utils');

/** @see https://adventofcode.com/2019/day/8/input */
const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8').split('').map(Number));

// https://adventofcode.com/2019/day/8 First Star:
class Image {
  /**
   * @param {number[]} ints
   * @param {number} width
   * @param {number} height
   */
  constructor (ints, width, height) {
    this.layers = [];
    for (let i = 0; i < ints.length; i += width * height)
      this.layers.push(ints.slice(i, i + width * height));
  }

  firstStar () {
    const layer = this.layers.reduce((a, b) => a.filter(x => x === 0).length < b.filter(x => x === 0).length ? a : b);
    return layer.filter(x => x === 1).length * layer.filter(x => x === 2).length;
  }
}

const testImage = new Image([1,2,3,4,5,6,7,8,9,0,1,2], 3, 2);
equals(testImage.layers[0], [1,2,3,4,5,6]);
const image = new Image(input(), 25, 6);
console.log({ firstStar: image.firstStar() });

// https://adventofcode.com/2019/day/8#part2 Second Star:

