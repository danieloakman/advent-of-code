import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main, manhattanDistance } from '../../lib/utils';
import { Point } from 'geometric';
import Map2D from '../../lib/Map2D';
import IncrementorMap from '../../lib/IncrementorMap';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2018/day/6/input */
export const input = once(() =>
  readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8')
    .split(/[\n\r]+/)
    .map(line => line.split(', ').map(Number) as Point),
);
const textInput = once(
  () =>
    [
      [1, 1],
      [1, 6],
      [8, 3],
      [3, 4],
      [5, 5],
      [8, 9],
    ] as Point[],
);

// function pointsEqual(a: Point, b: Point) {
//   return a[0] === b[0] && a[1] === b[1];
// }

// function nthLetter(n: number) {
//   return String.fromCharCode(65 + n);
// }

function pointId(point: Point) {
  return `${point[0]},${point[1]}`;
}

function closestPoint(start: Point, others: Point[]): Point | null {
  const distances = others
    .map(other => ({
      point: other,
      distance: manhattanDistance(start, other),
    }))
    .sort((a, b) => a.distance - b.distance);
  return distances[0].distance === distances[1].distance ? null : distances[0].point;
}

function largestArea(locations: Point[]) {
  const map = new Map2D<string>();
  const incMap = new IncrementorMap();
  locations.forEach(point => {
    const id = pointId(point);
    map.set(...point, id);
    incMap.inc(id);
  });
  for (const [x, y, value] of map.points()) {
    if (value !== undefined) continue;
    const closest = closestPoint([x, y], locations);
    if (!closest) continue;
    incMap.inc(pointId(closest));
    // map.set(x, y, map.get(...closest).toLowerCase());
  }
  // map.print(v => !v ? '.' : v);
  const maxId = incMap.minmax()[1];
  return incMap.get(maxId);
}

// TODO finish
/** @see https://adventofcode.com/2018/day/6 First Star */
export async function firstStar() {
  return largestArea(input());
}

/** @see https://adventofcode.com/2018/day/6#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(largestArea(textInput()), 17);

  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
