import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import Map2D from '../../lib/Map2D';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import range from 'iteragain/range';

/** @see https://adventofcode.com/2022/day/8/input */
export const input = once(() => downloadInputSync('2022', '8').split(/[\n\r]+/));

const testInput = `
30373
25512
65332
33549
35390
`.trim().split(/[\n\r]+/);

interface Tree {
  height: number;
  visible?: boolean;
}

class TreeMap extends Map2D<Tree> {
  constructor(input: string[]) {
    super();
    for (const [y, line] of iter(input).enumerate()) {
      for (const [x, char] of iter(line).enumerate()) {
        this.set(x, y, { height: Number(char) });
      }
    }
  }
}

function spiralRange(xMax: number, yMax: number, xMin = 0, yMin = 0) {
  return iter(
    (function* () {
      while(true) {
        // Right:
        yield* iter(range(xMin, xMax)).map(n => [n, yMin] as const);
        yMin++;
        // Down:
        yield* iter(range(yMin, yMax)).map(n => [xMax - 1, n] as const);
        xMax--;
        // Left:
        yield* iter(range(xMax - 1, xMin)).map(n => [n, yMax - 1] as const);
        yMax--;
        // Up:
        yield* iter(range(yMax - 1, yMin)).map(n => [xMin, n] as const);
        xMin++;
      }
    })())
    .take((xMax - xMin) * (yMax - yMin));
}

console.log(iter(spiralRange(3, 3)).toArray());

/** @see https://adventofcode.com/2022/day/8 First Star */
export async function firstStar() {
  //
}

/** @see https://adventofcode.com/2022/day/8#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  // equal

  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
