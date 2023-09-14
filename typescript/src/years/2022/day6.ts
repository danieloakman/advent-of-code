import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain-es/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2022/day/6/input */
export const input = once(() => downloadInputSync('2022', '6'));

function findIndexOfUniqueWindow(str: string, windowSize: number): number {
  return (
    iter(str)
      .windows(windowSize, 1)
      .findIndex(chars => new Set(chars).size === windowSize) + windowSize
  );
}

/** @see https://adventofcode.com/2022/day/6 First Star */
export async function firstStar() {
  return findIndexOfUniqueWindow(input(), 4);
}

/** @see https://adventofcode.com/2022/day/6#part2 Second Star */
export async function secondStar() {
  return findIndexOfUniqueWindow(input(), 14);
}

main(module, async () => {
  equal(findIndexOfUniqueWindow('bvwbjplbgvbhsrlpgdmjqwftvncz', 4), 5);
  equal(findIndexOfUniqueWindow('nppdvjthqldpwncqszvftbrmjlhg', 4), 6);
  equal(findIndexOfUniqueWindow('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 4), 10);
  equal(findIndexOfUniqueWindow('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 4), 11);
  console.log('First star:', await firstStar());

  equal(findIndexOfUniqueWindow('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14), 19);
  equal(findIndexOfUniqueWindow('bvwbjplbgvbhsrlpgdmjqwftvncz', 14), 23);
  equal(findIndexOfUniqueWindow('nppdvjthqldpwncqszvftbrmjlhg', 14), 23);
  equal(findIndexOfUniqueWindow('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 14), 29);
  equal(findIndexOfUniqueWindow('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14), 26);
  console.log('Second star:', await secondStar());
});
