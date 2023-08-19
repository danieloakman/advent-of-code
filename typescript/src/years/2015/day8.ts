// https://adventofcode.com/2015/day/8

import { readFileSync } from 'fs';
import { matches } from '../../lib/utils';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    let memoryStr = str.slice(1, str.length - 1);
    for (const match of matches(/\\x[0-9abcdef]{2}/g, memoryStr))
      memoryStr = memoryStr.replace(match[0], String.fromCharCode(parseInt(match[0], 16)));
    for (const match of matches(/\\[\\"]/g, memoryStr)) memoryStr = memoryStr.replace(match[0], match[0].slice(1));
    return { stringCode: str.length, memoryStr: memoryStr.length };
  });

// First Star:
console.log(input.reduce((sum, { stringCode, memoryStr }) => sum + (stringCode - memoryStr), 0));

// Second Star:

export const solution = Solution()