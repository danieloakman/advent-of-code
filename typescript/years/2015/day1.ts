// https://adventofcode.com/2015/day/1

import once from 'lodash/once';
import { downloadInput } from '../../lib/downloadInput';
import { main } from '../../lib/utils';

const input = once(() => downloadInput('2015', '1'));

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

