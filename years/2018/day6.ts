import once from 'lodash/once';
import { main, manhattanDistance } from '../../lib/utils';
import { Point } from 'geometric';
import Map2D from '../../lib/Map2D';
import IncrementorMap from '../../lib/IncrementorMap';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import { downloadInputSync } from '../../lib/downloadInput';

/** @see https://adventofcode.com/2018/day/6/input */
export const input = once(() =>
  downloadInputSync('2018', '6')
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

function nthLetter(n: number) {
  return String.fromCharCode(65 + n);
}

function pointId(point: Point) {
  if (!point) return '';
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
    map.setBounds(point[0] + 10, point[1] + 10);
    map.setBounds(point[0] - 10, point[1] - 10);
    incMap.inc(id);
  });
  const isOnEdge = new Set<string>();
  for (const [x, y, value] of map.points()) {
    // Skip any locations already set on the map:
    if (value !== undefined) continue;
    const closest = closestPoint([x, y], locations);
    // No closest point found:
    if (!closest) continue;
    const id = pointId(closest);
    // This point is on the edge, don't need to count it:
    if (isOnEdge.has(id)) continue;
    if (map.isOnEdge(x, y)) {
      isOnEdge.add(id);
      incMap.delete(id);
    }
    // Increment the count for this location:
    else incMap.inc(pointId(closest));
  }
  // map.print(([x, y, v]) => (v ? v : '.'/* pointId(closestPoint([x, y], locations)) */));
  const maxId = incMap.minmax()[1];
  return incMap.get(maxId);
}

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
