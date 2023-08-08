import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import { flatten } from 'iteragain';

type Packet = number | Packet[];
type PacketPair = [Packet, Packet];

function parseInput(str: string): PacketPair[] {
  return str
    .trim()
    .split(/[\n\r]{2}/)
    .map(pair => pair.split(/[\n\r]+/).map(str => JSON.parse(str))) as any;
}

/** @see https://adventofcode.com/2022/day/13/input */
export const input = once(() => parseInput(downloadInputSync('2022', '13')));

const testInput = parseInput(`
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`);

function isInOrder(a: Packet, b: Packet): boolean {
  const zipFlat = iter([a])
    .flatten()
    .zipLongest(flatten([b]));
  for (const [left, right] of zipFlat) {
    if (typeof left === 'number' && typeof right === 'number') {
      if (left === right) continue;
      return left < right;
    } else if (typeof right !== 'number')
      return false;
    else if (typeof left !== 'number')
      return true;
  }
}

/** @see https://adventofcode.com/2022/day/13 First Star */
export async function firstStar(packetPairs = input()) {
  return iter(packetPairs)
    .enumerate()
    .filterMap(([i, packetPair]) => isInOrder(...packetPair) ? i + 1 : null)
    // .tap(console.log)
    .reduce(sum);
}

/** @see https://adventofcode.com/2022/day/13#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(await firstStar(testInput), 13);
  console.log('First star:', await firstStar()); // TODO: answer too high
  console.log('Second star:', await secondStar());
});
