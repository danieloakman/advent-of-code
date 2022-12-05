import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
import { ok as assert, deepStrictEqual as equal } from 'assert';
import IncrementorMap from '../../lib/IncrementorMap';
import { downloadInputSync } from '../../lib/downloadInput';

/** @see https://adventofcode.com/2022/day/3/input */
export const input = once(() => downloadInputSync('2022', '3').split(/[\n\r]+/));
const testInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`
  .trim()
  .split(/[\n\r]+/);

const priority = (
  (LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') =>
    (char: string) =>
      LETTERS.indexOf(char) + 1
)();
equal(priority('a'), 1);
equal(priority('A'), 27);

function rucksackPriorities(input: string[]) {
  return (
    iter(input)
      .map(line => {
        const map = new IncrementorMap();
        const halfway = Math.floor(line.length / 2);
        for (const [i, char] of iter(line).enumerate()) {
          if (i < halfway) map.inc(line[i]);
          else if (map.has(char)) return priority(char);
        }
      })
      // .tap(console.log)
      .reduce(sum)
  );
}

/** @see https://adventofcode.com/2022/day/3 First Star */
export async function firstStar() {
  return rucksackPriorities(input());
}

function rucksackPriorities2(input: string[]) {
  return iter(input)
    .chunks(3)
    .map(lines => {
      const line1 = iter(lines[0]).unique().reduce(sum);
      for (const char of line1) {
        if (lines[1].includes(char) && lines[2].includes(char)) return priority(char);
      }
    })
    // .tap(console.log)
    .reduce(sum);
}

/** @see https://adventofcode.com/2022/day/3#part2 Second Star */
export async function secondStar() {
  return rucksackPriorities2(input());
}

main(module, async () => {
  equal(rucksackPriorities(testInput), 157);
  console.log('First star:', await firstStar());

  equal(rucksackPriorities2(testInput), 70);
  console.log('Second star:', await secondStar());
});
