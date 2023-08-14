// https://adventofcode.com/2015/day/1

import once from 'lodash/once';
import { main, downloadInput, Solution } from '../../lib';

const input = once(() => downloadInput('2015', '1'));

async function solve() {
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
}

export const solution: Solution = {
  firstStar: () => solve().then(({ floor }) => floor),
  secondStar: () => solve().then(({ firstBasement }) => firstBasement),
};

main(module, async () => {
  // First Star:
  let floor = 0;
  let firstBasement = null;
  let charNum = 0;
  for (const char of await input()) {
    charNum++;
    if (char === '(') floor++;
    else floor--;
    if (floor === -1 && firstBasement === null) firstBasement = charNum;
  }
  console.log({ floor });

  // Second Star:
  console.log({ firstBasement });
});

