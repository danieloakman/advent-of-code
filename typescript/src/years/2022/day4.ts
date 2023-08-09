import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
import range from 'iteragain/range';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import RangeIterator from 'iteragain/internal/RangeIterator';
import { downloadInputSync } from '../../lib/downloadInput';

/** @see https://adventofcode.com/2022/day/4/input */
export const input = once(() => downloadInputSync('2022', '4').split(/[\n\r]+/));
const testInput = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`
  .trim()
  .split(/[\n\r]+/);

function toRanges(str: string) {
  return str
    .split(',')
    .map(str => str.split('-').map(Number) as [number, number])
    .map(([start, stop]) => range(start, stop + 1)) as [RangeIterator, RangeIterator];
}

function rangesContain(str: string): boolean {
  const [rangeA, rangeB] = toRanges(str);
  if (rangeA.includes(rangeB.start) && rangeA.includes(rangeB.nth(-1))) return true;
  else if (rangeB.includes(rangeA.start) && rangeB.includes(rangeA.nth(-1))) return true;
  return false;
}

/** @see https://adventofcode.com/2022/day/4 First Star */
export async function firstStar(lines: string[] = input()) {
  return (
    iter(lines)
      .map(line => (rangesContain(line) ? 1 : 0))
      // .tap(console.log)
      .reduce(sum)
  );
}

function rangesOverlap(str: string): boolean {
  const [rangeA, rangeB] = toRanges(str);
  for (const pair of iter(rangeA).windows(2, 1, -1)) {
    if (rangeB.includes(pair[0]) || rangeB.includes(pair[1])) return true;
  }
  return false;
}

/** @see https://adventofcode.com/2022/day/4#part2 Second Star */
export async function secondStar(lines: string[] = input()) {
  return (
    iter(lines)
      .map(line => (rangesOverlap(line) ? 1 : 0))
      // .tap(console.log)
      .reduce(sum)
  );
}

main(module, async () => {
  equal(await firstStar(testInput), 2);
  console.log('First star:', await firstStar());
  equal(await secondStar(testInput), 4);
  console.log('Second star:', await secondStar());
});
