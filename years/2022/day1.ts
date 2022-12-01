import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
// import { ok as assert, deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2022/day/1/input */
export const elves = once(() =>
  iter(readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r ]{2,}/))
    .map(line => line.split(/[\n\r ]+/).map(Number))
    .toArray(),
);

/** @see https://adventofcode.com/2022/day/1 First Star */
export async function firstStar() {
  return iter(elves())
    .map(calories => calories.reduce(sum))
    .max();
}

/** @see https://adventofcode.com/2022/day/1#part2 Second Star */
export async function secondStar() {
  return iter(elves())
    .map(calories => calories.reduce(sum))
    .sort((a, b) => b - a)
    .take(3)
    .reduce(sum);
}

main(module, async () => {
  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
