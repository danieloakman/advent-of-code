'use strict';
// https://adventofcode.com/2021/day/13

const { readFileSync } = require('fs');
const { Map2D, sum } = require('../lib/utils');
const { deepStrictEqual: equal, ok: assert } = require('assert');

const EMPTY = ' ';
const DOT = '#';

const testInput = () => FoldingMap.createMap(`
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0
fold along y=7
fold along x=5`);

const input = () => FoldingMap.createMap(readFileSync(__filename.replace('.js', '-input'), 'utf-8'));

class FoldingMap extends Map2D {
  static createMap (input) {
    const map = new FoldingMap();
    const instructions = [];
    input.trim().split(/[\n\r]+/).forEach(str => {
      if (/^\d+,\d+$/.test(str)) {
        const [x, y] = str.split(',').map(parseFloat);
        map.set(x, y, DOT);
      } else {
        const [axis, value] = str.match(/[xy]=\d+/)[0].split('=');
        instructions.push({ axis, value: parseInt(value) });
      }
    });
    // for (const { x, y } of map.getAll(v => v !== DOT))
    //   map.set(x, y, EMPTY);
    return { map, instructions };
  }

  static newAxis (v, fold) {
    return fold - (v - fold);
  }

  fold (axis, axisValue) {
    if (typeof axisValue !== 'number')
      axisValue = parseFloat(axisValue);
    // axis === 'x' is fold left, 'y' is fold up.
    for (const p of [...this.getValues(v => v === DOT)]) {
      if (p[axis] >= axisValue) {
        this.clear(p.x, p.y);
        // this.set(p.x, p.y, EMPTY);
        if (p[axis] > axisValue) {
          p[axis] = FoldingMap.newAxis(p[axis], axisValue);
          this.set(p.x, p.y, DOT);
        }
      }
    }
    this.resetBounds();
  }

  dotsVisible () {
    return [...this.getValues(v => v === DOT)].length;
  }

  toArray () {
    const arr = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      const line = [];
      for (let x = this.xMin; x <= this.xMax; x++)
        line.push(this.get(x, y) || EMPTY);
      arr.push(line);
    }
    return arr;
  }

  toString () {
    return this.toArray()
      .map(line => line.join(''))
      .join('\n');
  }
}

// First Star:
equal(FoldingMap.newAxis(8, 7), 6);
equal(FoldingMap.newAxis(9, 7), 5);
equal(FoldingMap.newAxis(10, 7), 4);
equal(FoldingMap.newAxis(11, 7), 3);
equal(FoldingMap.newAxis(12, 7), 2);
equal(FoldingMap.newAxis(13, 7), 1);
equal(FoldingMap.newAxis(14, 7), 0);
{
  const { map, instructions } = testInput();
  let instruction = instructions.shift();
  map.fold(instruction.axis, instruction.value);
  equal(map.dotsVisible(), 17);
  instruction = instructions.shift();
  map.fold(instruction.axis, instruction.value);
  equal(map.dotsVisible(), 16);
}
{
  const { map, instructions } = input();
  // First Star:
  let instruction = instructions.shift();
  map.fold(instruction.axis, instruction.value);
  console.log({ dotsVisible: map.dotsVisible() });
  // Second Star:
  for (const { axis, value } of instructions)
    map.fold(axis, value);
  console.log(map.toString());
}
