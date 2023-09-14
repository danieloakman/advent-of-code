import once from 'lodash/once';
import { add, main } from '../../lib/utils';
import { downloadInputSync } from '../../lib/downloadInput';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import { iter, pairwise, range } from 'iteragain-es';

/** @see https://adventofcode.com/2022/day/20/input */
export const input = once(() =>
  downloadInputSync('2022', '20')
    .split(/[\n\r]+/)
    .map(Number),
);

function nthIndex<T>(arr: T[], n: number) {
  n %= arr.length;
  if (n < 0) n += arr.length;
  return n;
}

function nth<T>(arr: T[], n: number) {
  return arr[nthIndex(arr, n)];
}
equal(nth([1, 2, 3], 0), 1);
equal(nth([1, 2, 3], -1), 3);
equal(nth([1, 2, 3], 3), 1);
equal(nth([1, 2, 3], -3), 1);

function swap<T extends Record<number, any> | any[]>(arr: T, idx1: number, idx2: number) {
  const temp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = temp;
}

function move(arr: number[], idx: number, places: number) {
  idx %= arr.length;
  if (idx < 0) idx += arr.length;
  const result = arr.slice();
  const value = result.splice(idx, 1)[0];
  result.splice(nthIndex(arr, idx + places), 0, value);
  return result;
}
equal(move([1, 2, 3], 0, 1), [2, 1, 3]);
equal(move([1, 2, 3], 0, 2), [2, 3, 1]);
equal(move([1, 2, 3], 0, -1), [2, 3, 1]);
equal(move([1, 2, 3], 0, -4), [2, 3, 1]);
equal(move([1, 2, 3], 0, -6), [1, 2, 3]);

// interface Element {
//   originalIdx: number;
//   value: number;
// }

function mix(nums: number[], findIndices: number[]) {
  // /** Map of originalIdx -> currentIdx */
  // const indices: Record<number, number> = nums.reduce((map, _, i) => ((map[i] = i), map), {} as any);
  let indices = nums.map((_, i) => i);
  let values = nums.slice();
  for (const originalIdx of range(nums.length)) {
    let currentIdx = indices[originalIdx];
    let value = values[currentIdx];
    while (value !== 0) {
      const step = Math.sign(value);
      value -= step;
      // const to = nthIndex(values, currentIdx + step);
      values = move(values, currentIdx, step);
      indices = move(indices, currentIdx, step);
      // swap(values, currentIdx, to);
      // swap(indices, currentIdx, to);
      currentIdx += step;
    }
  }
  return iter(findIndices)
    .map(idx => values[nthIndex(values, idx)])
    .tap(console.log)
    .reduce(add);
}

/** @see https://adventofcode.com/2022/day/20 First Star */
export async function firstStar() {
  //
}

/** @see https://adventofcode.com/2022/day/20#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(mix([1, 2, -3, 3, -2, 0, 4], [1000, 2000, 3000]), 3);
  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
