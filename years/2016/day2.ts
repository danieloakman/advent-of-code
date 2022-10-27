// https://adventofcode.com/2016/day/2

import { readFileSync } from 'fs';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/);

type Direction = 'U' | 'D' | 'L' | 'R';

class KeyPad {
  keypos: Record<number, [number, number]> = {};
  constructor(public keypad: (number | string)[][]) {
    keypad.forEach((row, y) => {
      row.forEach((key, x) => {
        this.keypos[key] = [x, y];
      });
    });
  }

  get(x: number, y: number, map: (number | string)[][]) {
    return map[y] && map[y][x] ? map[y][x] : null;
  }

  moveKey(key: number | string, direction: Direction) {
    let [x, y] = this.keypos[key];
    if (direction === 'U') y--;
    else if (direction === 'D') y++;
    else if (direction === 'L') x--;
    else if (direction === 'R') x++;
    return this.get(x, y, this.keypad) || key;
  }
}

// First Star:
const keypad1 = new KeyPad([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);
let key: number | string = 5;
let keyCode = '';
for (const keyDirections of input) {
  for (const direction of keyDirections) {
    key = keypad1.moveKey(key, direction as Direction);
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
  [null, null, 'D', null, null],
]);
key = 5;
keyCode = '';
for (const keyDirections of input) {
  for (const direction of keyDirections) {
    key = keypad2.moveKey(key, direction as Direction);
  }
  keyCode += key.toString();
}
console.log({ keyCode });
