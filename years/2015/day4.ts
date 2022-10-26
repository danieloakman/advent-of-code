// https://adventofcode.com/2015/day/4

import { readFileSync } from 'fs';
import { hash } from '../../lib/utils';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8');

let i = 0;

// First Star:
do {
  const h = hash(input + i, 'md5');
  if (h.startsWith('00000')) {
    console.log(i);
    break;
  }
} while (++i);

// Second Star:
do {
  const h = hash(input + i, 'md5');
  if (h.startsWith('000000')) {
    console.log(i);
    break;
  }
} while (++i);
