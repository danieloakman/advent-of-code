// https://adventofcode.com/2015/day/4

import iter from 'iteragain/iter';
import { hash, downloadInputSync, Solution, main } from '../../lib';
import once from 'lodash/once';
import count from 'iteragain/count';

const input = once(() => downloadInputSync(2015, 4).trim());

const hasher = iter(count()).map(i => [i, hash(input() + i, 'md5')] as const);

// let i = 0;
// const zerosIt = iter(range(1, 7))
//   .map(n => '0'.repeat(n))
//   .cycle();
// const zeros = zerosIt.take(6);
const ZEROS = ['00000', '000000'];

export const solution = new Solution(
  once(async () => hasher.filter(([, h]) => h.startsWith(ZEROS[0])).next().value[0]),
  once(async () => hasher.filter(([, h]) => h.startsWith(ZEROS[1])).next().value[0]),
);

main(module, () => solution.solve());
