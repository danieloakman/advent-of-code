import once from 'lodash/once';
import { main, sum } from '../../lib/utils';
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

    // Set all trees on the edge to visible:
    this.points()
      .filter(([x, y]) => this.isOnEdge(x, y))
      .forEach(([x, y]) => this.set(x, y, { ...this.get(x, y), visible: true }));

    for (const reverse of [false, true]) {
      for (const method of ['rows', 'columns']) {
        for (const rowOrColumn of this[method](reverse)) {
          let highest = 0;
          for (const [x, y, tree] of rowOrColumn) {
            if (tree.height > highest) {
              this.set(x, y, { ...tree, visible: true });
              highest = tree.height;
            }
          }
        }
      }
    }

    // this.print(([,, v]) => v.visible ? '#' : '.');
  }

  visibleTrees() {
    return this.points()
      // .map(([x, y]) => this.isVisible(x, y))
      .reduce((sum, v) => sum + (v[2].visible ? 1 : 0), 0);
  }
}

// /** Iterator of points starting at top left, spiraling inwards clockwise in a 2D grid. */
// function spiralRange(xMax: number, yMax: number, xMin = 0, yMin = 0) {
//   const iterations = (xMax - xMin) * (yMax - yMin);
//   return iter(
//     (function* () {
//       while (true) {
//         // Right:
//         yield iter(range(xMin, xMax)).map(n => [n, yMin] as const);
//         yMin++;
//         // Down:
//         yield iter(range(yMin, yMax)).map(n => [xMax - 1, n] as const);
//         xMax--;
//         // Left:
//         yield iter(range(xMax - 1, xMin - 1)).map(n => [n, yMax - 1] as const);
//         yMax--;
//         // Up:
//         yield iter(range(yMax - 1, yMin - 1)).map(n => [xMin, n] as const);
//         xMin++;
//       }
//     })())
//     .flatten(1)
//     .enumerate()
//     .takeWhile(([i]) => i < iterations)
//     .map(([_, v]) => v);
// }
// equal(spiralRange(3, 3).toArray(), [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [1, 1]]);
// equal(spiralRange(2, 2).toArray(), [[0, 0], [1, 0], [1, 1], [0, 1]]);

/** @see https://adventofcode.com/2022/day/8 First Star */
export async function firstStar() {
  return new TreeMap(input()).visibleTrees();
}

/** @see https://adventofcode.com/2022/day/8#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(new TreeMap(testInput).visibleTrees(), 21);

  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
