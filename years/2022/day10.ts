import once from 'lodash/once';
import { main, sum, deepCopy, isBetween } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import count from 'iteragain/count';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import Map2D from '../../lib/Map2D';

/** @see https://adventofcode.com/2022/day/10/input */
export const input = once(() => downloadInputSync('2022', '10').split(/[\n\r]+/));

const testInput1 = `
noop
addx 3
addx -5`
  .trim()
  .split(/[\n\r]+/);
const testInput2 = `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`
  .trim()
  .split(/[\n\r]+/);

function signals(input: string[]) {
  const lines = deepCopy(input);
  let signal = 1;
  let add = 0;
  return iter(() => {
    if (add) {
      signal += add;
      add = 0;
      return signal;
    }

    const line = lines.shift();
    if (line) {
      const [cmd, ...args] = line.split(' ');
      switch (cmd) {
        case 'addx':
          add = parseInt(args[0]);
          break;
        default:
          break;
      }
    } else if (!add) return null;

    return signal;
  }, null);
}

/** @see https://adventofcode.com/2022/day/10 First Star */
export async function firstStar(lines = input()) {
  const cyclesToGet = [20, 60, 100, 140, 180, 220].map(n => n - 1);
  return (
    iter(count(1))
      .zip(signals(lines))
      .filter(([cycle]) => cyclesToGet.includes(cycle))
      // .tap(console.log)
      .map(([cycle, signal]) => signal * (cycle + 1))
      .reduce(sum)
  );
}

// TODO: 2nd star
/** @see https://adventofcode.com/2022/day/10#part2 Second Star */
export async function secondStar(lines = input()) {
  const map2d = new Map2D<boolean>();
  for (const [cycle, signal] of signals(lines).prepend([1]).enumerate()) {
    const x = cycle % 40;
    const y = Math.floor(cycle / 40);
    const render = isBetween(x, signal - 1, signal + 1);
    map2d.set(x, y, render);
  }
  map2d.print(([, , v]) => (v ? '#' : ' '));
  return 'Look at print^';
}

main(module, async () => {
  equal(signals(testInput1).toArray(), [1, 1, 4, 4, -1]);
  equal(await firstStar(testInput2), 13140);
  console.log('First star:', await firstStar());
  // await secondStar(testInput2);
  console.log('Second star:', await secondStar());
});
