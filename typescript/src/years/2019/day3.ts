// https://adventofcode.com/2019/day/3
// https://adventofcode.com/2019/day/3/input

import { readFileSync } from 'fs';
import once from 'lodash/once';
// import { iter as iterate } from 'iteragain-es';
// const Map2D = require('../../lib/Map2D');
import { deepStrictEqual as equal } from 'assert';
import last from 'lodash/last';
import { Point, Line, lineIntersectsLine } from 'geometric';
import { pipe, add, mult, deepCopy, main, sub } from '../../lib/utils';
import iter from 'iteragain-es/iter';
import { enumerate } from 'iteragain-es';
import ExtendedIterator from 'iteragain-es/internal/ExtendedIterator';

// type ConnectedLine = Point[];

type Direction = 'U' | 'D' | 'L' | 'R';

const DIRECTION_MAP: Record<Direction, Point> = {
  'U': [0, 1] as Point,
  'D': [0, -1] as Point,
  'L': [-1, 0] as Point,
  'R': [1, 0] as Point,
};

function parseInputLine(line: string): ExtendedIterator<Line> {
  let p = [0, 0] as Point;
  return iter(line.split(','))
    .map(direction => {
      const dir = direction[0] as Direction;
      const count = parseInt(direction.slice(1));
      p = pipe(p, add(pipe(DIRECTION_MAP[dir], mult([count, count] as Point))));
      return deepCopy(p);
    })
    .prepend([0, 0] as Point)
    .pairwise();
}

function numsEqual<T extends number[]>(a: T, b: T) {
  if (a.length !== b.length) return false;
  return a.every((n, i) => n === b[i]);
}

function pointsInLine(line: Line) {
  let p = deepCopy(line[0]);
  const direction = sub(line[0], line[1]);
  return iter(() => {
    if (numsEqual(p, line[1])) return null;
    p = add(p, direction);
    return deepCopy(p);
  }, null).prepend(line[0]);
}

function lineIntersections(a: Line, b: Line): ExtendedIterator<Point> {
  if (!lineIntersectsLine(a, b)) return iter([]);
  const aMap = pointsInLine(a).reduce(
    (map, point) => ((map[`${point[0]},${point[1]}`] = point), map),
    {} as Record<string, Point>,
  );
  return pointsInLine(b).filter(p => `${p[0]},${p[1]}` in aMap);
}

const input = () =>
  readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
    .split(/[\n\r]+/)
    .map(parseInputLine);
const testInput1 = () => 'R8,U5,L5,D3\nU7,R6,D4,L4'.split(/[\n\r]+/).map(parseInputLine);
const testInput2 = () =>
  'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'.split(/[\n\r]+/).map(parseInputLine);
const testInput3 = () =>
  'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
    .split(/[\n\r]+/)
    .map(parseInputLine);

function closestIntersectionToOrigin(lines: ExtendedIterator<Line>[]) {
  // const pairedLines = lines.map(line => iter(line).pairwise().toArray());
  // let minX =
  for (const [i, lineA] of enumerate(lines)) {
    for (const [j, lineB] of enumerate(lines)) {
      if (i === j) continue;
      for (const segmentA of lineA) {
        for (const segmentB of lineB) {
          for (const intersection of lineIntersections(segmentA, segmentB)) {
            //
          }
        }
      }
    }
  }
}

// First Star:
export async function firstStar() {
  return closestIntersectionToOrigin(input());
}

// Second Star:
export async function secondStar() {
  //
}

main(module, async () => {
  // Tests:
  equal(closestIntersectionToOrigin(testInput1()), 6);
  console.log('First Star:', await firstStar());
  console.log('Second Star:', await secondStar());
});
