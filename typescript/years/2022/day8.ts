import once from 'lodash/once';
import { main, range2D, mult } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import Map2D from '../../lib/Map2D';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2022/day/8/input */
export const input = once(() => downloadInputSync('2022', '8').split(/[\n\r]+/));

const testInput = `
30373
25512
65332
33549
35390
`
  .trim()
  .split(/[\n\r]+/);

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
    return (
      this.points()
        .reduce((sum, v) => sum + (v[2].visible ? 1 : 0), 0)
    );
  }

  scenicScore(x: number, y: number) {
    const tree = this.get(x, y);
    return iter([
      // Up:
      range2D([x, y - 1], [x, -1]),
      // Left:
      range2D([x - 1, y], [-1, y]),
      // Down:
      range2D([x, y + 1], [x, this.height]),
      // Right:
      range2D([x + 1, y], [this.width, y]),
    ])
      .map(line =>
        line
          .map(line => this.get(...line))
          .takeWhile(((end = false) => (other) => {
            if (end) return false;
            if (other.height >= tree.height) end = true;
            return true;
          })())
          .length(),
      )
      .reduce(mult);
  }

  bestScenicScore() {
    return this.points()
      .map(([x, y]) => this.scenicScore(x, y))
      .max();
  }

}

/** @see https://adventofcode.com/2022/day/8 First Star */
export async function firstStar() {
  return new TreeMap(input()).visibleTrees();
}

/** @see https://adventofcode.com/2022/day/8#part2 Second Star */
export async function secondStar() {
  return new TreeMap(input()).bestScenicScore();
}

main(module, async () => {
  equal(new TreeMap(testInput).visibleTrees(), 21);
  console.log('First star:', await firstStar());

  equal(new TreeMap(testInput).bestScenicScore(), 8);
  console.log('Second star:', await secondStar());
});
