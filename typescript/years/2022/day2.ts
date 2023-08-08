import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import { downloadInputSync } from '../../lib/downloadInput';

/** @see https://adventofcode.com/2022/day/2/input */
export const input = once(() =>
  downloadInputSync('2022', '2').split(/[\n\r]+/)
);

enum RockPaperScissors {
  'ROCK' = 1,
  'PAPER' = 2,
  'SCISSORS' = 3,
};

const WIN = 6;
const DRAW = 3;
const LOSS = 0;

const CONVERT_STAR_1 = {
  A: RockPaperScissors.ROCK,
  B: RockPaperScissors.PAPER,
  C: RockPaperScissors.SCISSORS,
  X: RockPaperScissors.ROCK,
  Y: RockPaperScissors.PAPER,
  Z: RockPaperScissors.SCISSORS,
};

type FirstInputChar  = 'A' | 'B' | 'C';
type SecondInputChar = 'X' | 'Y' | 'Z';

function rockPaperScissors(input: string[]) {
  return iter(input)
    .map(line => {
      const [them, me] = line.split(' ').map(char => CONVERT_STAR_1[char as keyof typeof CONVERT_STAR_1]);

      if (me === them) return DRAW + me;
      if (me === RockPaperScissors.ROCK && them === RockPaperScissors.SCISSORS) return WIN + me;
      if (me === RockPaperScissors.PAPER && them === RockPaperScissors.ROCK) return WIN + me;
      if (me === RockPaperScissors.SCISSORS && them === RockPaperScissors.PAPER) return WIN + me;
      return LOSS + me;
    })
    // .tap(console.log)
    .reduce(sum);
}

/** @see https://adventofcode.com/2022/day/2 First Star */
export async function firstStar() {
  return rockPaperScissors(input());
}

const CONVERT_STAR_2 = {
  A: RockPaperScissors.ROCK,
  B: RockPaperScissors.PAPER,
  C: RockPaperScissors.SCISSORS,
  X: {
    // Need to lose:
    STATE: LOSS,
    [RockPaperScissors.ROCK]: RockPaperScissors.SCISSORS,
    [RockPaperScissors.PAPER]: RockPaperScissors.ROCK,
    [RockPaperScissors.SCISSORS]: RockPaperScissors.PAPER,
  },
  Y: {
    // Need to draw:
    STATE: DRAW,
    [RockPaperScissors.ROCK]: RockPaperScissors.ROCK,
    [RockPaperScissors.PAPER]: RockPaperScissors.PAPER,
    [RockPaperScissors.SCISSORS]: RockPaperScissors.SCISSORS,
  },
  Z: {
    // Need to win:
    STATE: WIN,
    [RockPaperScissors.ROCK]: RockPaperScissors.PAPER,
    [RockPaperScissors.PAPER]: RockPaperScissors.SCISSORS,
    [RockPaperScissors.SCISSORS]: RockPaperScissors.ROCK,
  },
};

function rockPaperScissors2(input: string[]) {
  return iter(input)
    .map(line => {
      const [them, me] = line.split(' ') as [FirstInputChar, SecondInputChar];
      const themMove = CONVERT_STAR_2[them];
      const meMove = CONVERT_STAR_2[me][themMove];
      return CONVERT_STAR_2[me].STATE + meMove;
    })
    // .tap(console.log)
    .reduce(sum);
}

/** @see https://adventofcode.com/2022/day/2#part2 Second Star */
export async function secondStar() {
  return rockPaperScissors2(input());
}

main(module, async () => {
  equal(rockPaperScissors(['A Y', 'B X', 'C Z']), 15);
  console.log('First star:', await firstStar());

  equal(rockPaperScissors2(['A Y', 'B X', 'C Z']), 12);
  console.log('Second star:', await secondStar());
});
