import once from 'lodash/once';
import { main, matches } from '../../lib/utils';
import iter from 'iteragain/iter';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import last from 'lodash/last';
import { downloadInputSync } from '../../lib/downloadInput';

/**
 * @see https://adventofcode.com/2022/day/5/input Note that the input for this puzzle has the first line missing its
 * initial needed space characters. So if the puzzle input is being downloaded for the first time, this needs to be
 * manually fixed and checked to match the input at the specified URL.
 */
export const input = once(() => downloadInputSync('2022', '5').split(/[\n\r]+/));
const testInput = `
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`.split(/[\n\r]+/);

/** @note The */
function processCrateStacks(lines = input(), { firstStar }: { firstStar: boolean }) {
  const stacks: string[][] = [];
  let startLine = 0;
  for (const line of lines) {
    startLine++;
    if (/\d/.test(line)) break;
    for (const match of matches(/[A-Z]/g, line)) {
      const stackIdx = Math.floor(match.index / 4);
      if (!stacks[stackIdx]) stacks[stackIdx] = [];
      stacks[stackIdx].unshift(match[0]);
    }
  }

  for (const line of lines.slice(startLine)) {
    const [move, from, to] = line.match(/\d+/g).map(Number);
    // const crates = takeRight(stacks[from - 1], move);
    const crates = stacks[from - 1].splice(-move);
    if (firstStar) crates.reverse();
    stacks[to - 1].push(...crates);
  }

  return iter(stacks)
    .map(stack => last(stack))
    .join('');
}

/** @see https://adventofcode.com/2022/day/5 First Star */
export async function firstStar() {
  return processCrateStacks(input(), { firstStar: true });
}

/** @see https://adventofcode.com/2022/day/5#part2 Second Star */
export async function secondStar() {
  return processCrateStacks(input(), { firstStar: false });
}

main(module, async () => {
  equal(processCrateStacks(testInput, { firstStar: true }), 'CMZ');
  console.log('First star:', await firstStar());
  equal(processCrateStacks(testInput, { firstStar: false }), 'MCD');
  console.log('Second star:', await secondStar());
});
