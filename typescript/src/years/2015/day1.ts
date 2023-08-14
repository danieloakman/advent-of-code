// https://adventofcode.com/2015/day/1

import once from 'lodash/once';
import { main, downloadInput, Solution } from '../../lib';

const input = once(() => downloadInput('2015', '1'));

const solve = once(async () => {
  let floor = 0;
  let firstBasement = null;
  let charNum = 0;

  for (const char of await input()) {
    charNum++;
    if (char === '(') floor++;
    else floor--;
    if (floor === -1 && firstBasement === null) firstBasement = charNum;
  }

  return { floor, firstBasement };
});

export const solution = new Solution(
  () => solve().then(({ floor }) => floor),
  () => solve().then(({ firstBasement }) => firstBasement),
);

main(module, () => solution.solve());

