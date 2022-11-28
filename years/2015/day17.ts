import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain/iter';
import range from 'iteragain/range';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2015/day/17/input */
export const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/).map(Number));
const testContainers = [20, 15, 10, 5, 5];

function combinations(litres: number, containers: number[]) {
  const combos: string[] = [];
  for (const size of range(2, containers.length)) {
    for (const combo of iter(containers).enumerate().combinations(size, false)) {
      if (combo.reduce((sum, p) => sum + p[1], 0) !== litres) continue;
      combos.push(combo.sort((a, b) => a[0] - b[0]).map(v => v[0]).join(','));
    }
  }
  return iter(combos).unique().toArray().length;
}

/** @see https://adventofcode.com/2015/day/17 First Star */
export async function firstStar() {
  return combinations(150, input());
}

/** @see https://adventofcode.com/2015/day/17#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(combinations(25, testContainers), 4);

  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
