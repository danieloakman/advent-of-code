'use strict';
// https://adventofcode.com/2016/day/2

const { readFileSync } = require('fs');
const flatten = require('lodash/flatten');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/);

class KeyPad {
  constructor (keypad) {
    this.keypad = keypad;
    this.keypos = {};
    keypad.forEach((row, y) => {
      row.forEach((key, x) => {
        this.keypos[key] = [x, y];
      });
    });
  }

  get (x, y, map) {
    return (map[y] && map[y][x])
      ? map[y][x]
      : null;
  }

  moveKey (key, direction) {
    let [x, y] = this.keypos[key];
    if (direction === 'U')
      y--;
    else if (direction === 'D')
      y++;
    else if (direction === 'L')
      x--;
    else if (direction === 'R')
      x++;
    return this.get(x, y, this.keypad) || key;
  }
}

// First Star:
const keypad1 = new KeyPad([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]);
let key = 5;
let keyCode = ''; 
for (const keyDirections of input) {
  for (const direction of keyDirections) {
    key = keypad1.moveKey(key, direction);
  }
  keyCode += key.toString();
}
console.log({ keyCode });

// Second Star:
const keypad2 = new KeyPad([
  [null, null, 1, null, null],
  [null, 2, 3, 4, null],
  [5, 6, 7, 8, 9],
  [null, 'A', 'B', 'C', null],
  [null, null, 'D', null, null]
]);
key = 5;
keyCode = '';
for (const keyDirections of input) {
  for (const direction of keyDirections) {
    key = keypad2.moveKey(key, direction);
  }
  keyCode += key.toString();
}
console.log({ keyCode });
