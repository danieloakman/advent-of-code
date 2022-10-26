// https://adventofcode.com/2015/day/4

import { readFileSync } from 'fs';
// import iter from 'iteragain/iter';
// import range from 'iteragain/range';
import { hash } from '../../lib/utils';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8');

// let i = 0;
// const zerosIt = iter(range(1, 7))
//   .map(n => '0'.repeat(n))
//   .cycle();
// const zeros = zerosIt.take(6);
const zeros = ['00000', '000000'];

// First & Second Star:
for (let i = 0; ; i++) {
  const h = hash(input + i, 'md5');
  if (h.startsWith(zeros[0])) {
    console.log(/* zeros[0],  */i);
    zeros.shift();
    if (!zeros.length) break;
  }
}
