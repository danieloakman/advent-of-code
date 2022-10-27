// https://adventofcode.com/2017/day/3
// https://adventofcode.com/2017/day/3/input

import { readFileSync } from 'fs';
import { ok as assert } from 'assert';
import take from 'iteragain/take';
import { middle } from '../../lib/utils';
import Map2D from '../../lib/Map2D';

const input = Number(readFileSync(__filename.replace('.ts', '-input'), 'utf-8'));

// First Star:
function spiralDistance(num) {
  if (num < 2) return 0;
  for (let sideL = 1, ring = 0; ; sideL += 2, ring++) {
    const volume = sideL * sideL;
    if (volume > num) {
      // const perimeter = (sideL * 4) - 4;
      // const start = (sideL - 2) * (sideL - 2) + 1;
      const corners = [volume, volume - (sideL - 1), volume - (sideL - 1) * 2, volume - (sideL - 1) * 3];
      const middles = [
        middle(corners[0], corners[1]),
        middle(corners[1], corners[2]),
        middle(corners[2], corners[3]),
        middle(corners[3], corners[3] - (sideL - 1)),
      ];
      const distanceFromMiddle = Math.min(...middles.map(m => Math.abs(m - num)));
      const radius = Math.floor(sideL / 2);
      return radius + distanceFromMiddle;
    }
  }
}
assert(spiralDistance(1) === 0);
assert(spiralDistance(12) === 3);
assert(spiralDistance(23) === 2);
assert(spiralDistance(1024) === 31);
console.log({ distance: spiralDistance(input) });

// Second Star:
const spiral = new Map2D<number>();
const directions = (function* () {
  // [1, 1, 2, 2, 3, 3, 4, 4]
  const directions = [
    (x, y) => ({ x: x + 1, y }), // right
    (x, y) => ({ x, y: y - 1 }), // up
    (x, y) => ({ x: x - 1, y }), // left
    (x, y) => ({ x, y: y + 1 }), // down
  ];
  let length = 1;
  for (let direction = 0; ; direction++) {
    for (let i = 0; i < length; i++) yield directions[direction % 4];
    if (direction % 2) length++;
  }
})();
spiral.set(0, 0, 1);
let pos = { x: 0, y: 0 };
while (true) {
  pos = take(directions)[0](pos.x, pos.y);
  const sum = [...spiral.getNeighbours(pos.x, pos.y, false)].reduce((sum, { value }) => sum + value, 0);
  if (sum > input) {
    console.log({ sum });
    break;
  }
  spiral.set(pos.x, pos.y, sum);
}
