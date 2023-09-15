// https://adventofcode.com/2015/day/4

import iter from 'iteragain-es/iter';
import { hash, Solution } from '@lib';
import once from 'lodash/once';
import count from 'iteragain-es/count';

const hasher = once((input: string) => iter(count()).map(i => [i, hash(input + i, 'md5')] as const));

// let i = 0;
// const zerosIt = iter(range(1, 7))
//   .map(n => '0'.repeat(n))
//   .cycle();
// const zeros = zerosIt.take(6);
const ZEROS = ['00000', '000000'];

export const solution = new Solution(
  2015,
  4,
  once(
    async input =>
      hasher(input)
        .filter(([, h]) => h.startsWith(ZEROS[0]))
        .next().value[0],
  ),
  once(
    async input =>
      hasher(input)
        .filter(([, h]) => h.startsWith(ZEROS[1]))
        .next().value[0],
  ),
);

solution.main(import.meta.path);
