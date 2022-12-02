import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2022/day/2/input */
export const input = once(() =>
  readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/)
);

enum RockPaperScissors {
  'ROCK' = 1,
  'PAPER' = 2,
  'SCISSORS' = 3,
};

const WIN = 6;
const DRAW = 3;
const LOSS = 0;

const CONVERT = {
  A: RockPaperScissors.ROCK,
  B: RockPaperScissors.PAPER,
  C: RockPaperScissors.SCISSORS,
  X: RockPaperScissors.ROCK,
  Y: RockPaperScissors.PAPER,
  Z: RockPaperScissors.SCISSORS,
};

function score(me: RockPaperScissors, them: RockPaperScissors) {
  if (me === them) return DRAW + me;
  if (me === RockPaperScissors.ROCK && them === RockPaperScissors.SCISSORS) return WIN + me;
  if (me === RockPaperScissors.PAPER && them === RockPaperScissors.ROCK) return WIN + me;
  if (me === RockPaperScissors.SCISSORS && them === RockPaperScissors.PAPER) return WIN + me;
  return LOSS + me;
}

function parseLine(line: string) {
  const [them, me] = line.split(' ').map(char => CONVERT[char as keyof typeof CONVERT]);
  return score(me, them);
}

function rockPaperScissors(input: string[]) {
  return iter(input)
    .map(parseLine)
    // .tap(console.log)
    .reduce(sum);
}

/** @see https://adventofcode.com/2022/day/2 First Star */
export async function firstStar() {
  return rockPaperScissors(input());
}

/** @see https://adventofcode.com/2022/day/2#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(rockPaperScissors(['A Y', 'B X', 'C Z']), 15);

  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
