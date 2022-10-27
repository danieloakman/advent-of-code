// https://adventofcode.com/2019/day/3
// https://adventofcode.com/2019/day/3/input

import { readFileSync } from 'fs';
import once from 'lodash/once';
// import { iter as iterate } from 'iteragain';
// const Map2D = require('../../lib/Map2D');
import { deepStrictEqual as equal } from 'assert';
import last from 'lodash/last';
import { Point, Polygon, Line } from 'geometric';
import { pipe, add, mult, deepCopy, main } from '../../lib/utils';
import iter from 'iteragain/iter';
import { enumerate } from 'iteragain';

type ConnectedLine = Point[];

type Direction = 'U' | 'D' | 'L' | 'R';

const DIRECTION_MAP: Record<Direction, Point> = {
  'U': [0, 1] as Point,
  'D': [0, -1] as Point,
  'L': [-1, 0] as Point,
  'R': [1, 0] as Point,
};

function parseInputLine(line: string): ConnectedLine {
  let vector = [0, 0] as Point;
  const lines: ConnectedLine = [
    [0, 0],
    ...line.split(',').map(direction => {
      const dir = direction[0] as Direction;
      const count = parseInt(direction.slice(1));
      vector = pipe(vector, add(pipe(DIRECTION_MAP[dir], mult([count, count] as Point))));
      return deepCopy(vector);
    }),
  ];
  return lines;
}

const input = once(() =>
  readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
    .split(/[\n\r]+/)
    .map(parseInputLine),
);
const testInput1 = () => 'R8,U5,L5,D3\nU7,R6,D4,L4'.split(/[\n\r]+/).map(parseInputLine);
const testInput2 = () =>
  'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'.split(/[\n\r]+/).map(parseInputLine);
const testInput3 = () =>
  'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
    .split(/[\n\r]+/)
    .map(parseInputLine);

function closestIntersectionToOrigin(lines: ConnectedLine[]) {
  const pairedLines = lines.map(line => iter(line).pairwise().toArray());
  for (const [aIdx, lineA] of enumerate(lines)) {
    for (const [bIdx, lineB] of enumerate(lines)) {
      if (aIdx === bIdx) continue;
      // for (const [a, b] of lineA.value) {
      //   for (const [c, d] of lineB.value) {
      //     const intersection = Line.fromPoints(a, b).intersect(Line.fromPoints(c, d));
      //     if (intersection) return intersection;
      //   }
      // }
    }
  }
}

// class Line extends Map2D {
//   /** @param {string} lineStr */
//   constructor (lineStr) {
//     super();
//     const directions = lineStr
//       .split(',')
//       .map(direction => {
//         const dir = direction[0];
//         const count = direction.slice(1);
//         return range(count).map(() => Line.directionMap[dir]);
//       });
//     let v = Vector2.zero;
//     this.set(0, 0, true);
//     for (const direction of directions) {
//       for (const d of direction) {
//         v.add(d);
//         this.set(v.x, v.y, true);
//       }
//     }
//   }

//   static directionMap = {
//     'U': Vector2.up,
//     'D': Vector2.down,
//     'L': Vector2.left,
//     'R': Vector2.right
//   }

//   /**
//    * @param {Line} lineA
//    * @param {Line} lineB
//    */
//   static closestIntersectionToOrigin (lineA, lineB) {
//     let closest = new Vector2(9e9, 9e9);
//     let distance = Vector2.zero.manhattanDistanceTo(closest);
//     for (const a of lineA.getValues()) {
//       for (const b of lineB.getValues()) {
//         if (a.x === b.x && a.y === b.y && a.x !== 0 && a.y !== 0) {
//           const newDistance = Vector2.zero.manhattanDistanceTo(a);
//           if (newDistance < distance) {
//             closest = new Vector2(a.x, a.y);
//             distance = newDistance;
//           }
//         }
//       }
//     }
//     return distance;
//   }
// }

// First Star:
export async function firstStar() {
  return closestIntersectionToOrigin(input());
}
// equal(Line.closestIntersectionToOrigin(...testInput1()), 6);
// equal(Line.closestIntersectionToOrigin(...testInput2()), 159);
// equal(Line.closestIntersectionToOrigin(...testInput3()), 135);
// console.log({ distance: Line.closestIntersectionToOrigin(...input()) });

// Second Star:
export async function secondStar() {
  //
}

main(module, async () => {
  console.log('First Star:', await firstStar());
  console.log('Second Star:', await secondStar());
});
