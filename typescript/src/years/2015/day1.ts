// https://adventofcode.com/2015/day/1

import once from 'lodash/once';
import { Solution } from '@lib';

const solve = once((input: string) => {
  let floor = 0;
  let firstBasement = null;
  let charNum = 0;

  for (const char of input) {
    charNum++;
    if (char === '(') floor++;
    else floor--;
    if (floor === -1 && firstBasement === null) firstBasement = charNum;
  }

  return { floor, firstBasement };
});

export const solution = new Solution(
  2015,
  1,
  async input => solve(input).floor,
  async input => solve(input).firstBasement,
);

solution.main(import.meta.path);
