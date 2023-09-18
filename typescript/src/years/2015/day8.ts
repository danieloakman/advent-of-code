// https://adventofcode.com/2015/day/8

import { Solution, matches, newLine } from '@lib';
import memoize from 'lodash/memoize';

const solve = memoize((input: string) =>
  input.split(newLine).map(str => {
    let memoryStr = str.slice(1, str.length - 1);
    for (const match of matches(/\\x[0-9abcdef]{2}/g, memoryStr))
      memoryStr = memoryStr.replace(match[0], String.fromCharCode(parseInt(match[0], 16)));
    for (const match of matches(/\\[\\"]/g, memoryStr)) memoryStr = memoryStr.replace(match[0], match[0].slice(1));
    return { stringCode: str.length, memoryStr: memoryStr.length };
  }),
);

export const solution = new Solution(2015, 8)
  .firstStar(input => solve(input).reduce((sum, { stringCode, memoryStr }) => sum + (stringCode - memoryStr), 0))
  .main(import.meta.path);
