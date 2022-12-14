import once from 'lodash/once';
import { main, add } from '../../lib/utils';
import { downloadInputSync } from '../../lib/downloadInput';
import Map2D from '../../lib/Map2D';
import { Point, lineLength } from 'geometric';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import last from 'lodash/last';

/** @see https://adventofcode.com/2022/day/9/input */
export const input = once(() => downloadInputSync('2022', '9').split(/[\n\r]+/));

/** The vector needed to move one space in the direction from "`from`" to "`to`" */
function move(from: Point, to: Point): Point {
  return [Math.sign(to[0] - from[0]), Math.sign(to[1] - from[1])] as Point;
}
equal(move([0, 0], [1, 1]), [1, 1]);
equal(move([0, 0], [1, 0]), [1, 0]);
equal(move([0, 0], [0, 1]), [0, 1]);
equal(move([0, 0], [2, 0]), [1, 0]);

const testInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`
  .trim()
  .split(/[\n\r]+/);

const testInput2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`.trim().split(/[\n\r]+/);

type Direction = 'U' | 'R' | 'L' | 'D';

class Rope {
  // private head: Point = [0, 0];
  // private tail: Point = [0, 0];
  // private lastHead: Point = [0, 0];
  private knots: Point[];
  private map2d = new Map2D<boolean>();

  constructor(numOfKnots: number) {
    this.knots = Array.from({ length: numOfKnots }, () => [0, 0]);
  }

  move(direction: Direction, steps: number) {
    for (let i = 0; i < steps; i++) {
      // Move head:
      switch (direction) {
        case 'U':
          this.knots[0][1]--;
          break;
        case 'R':
          this.knots[0][0]++;
          break;
        case 'L':
          this.knots[0][0]--;
          break;
        case 'D':
          this.knots[0][1]++;
          break;
      }
      // Move all other knots:
      for (let j = 1; j < this.knots.length; j++) {
        if (lineLength([this.knots[j - 1], this.knots[j]]) >= 2) {
          const vector = move(this.knots[j], this.knots[j - 1]);
          this.knots[j] = add(this.knots[j], vector);
        }
      }
      // TODO track tail in a set instead of a map. And use map to track where the rope is, for testing
      this.map2d.set(...last(this.knots), true);
    }
  }

  tailVisited() {
    return this.map2d.values().length();
  }

  journey(lines: string[]) {
    for (const line of lines) {
      const [direction, steps] = parseLine(line);
      this.move(direction, steps);
    }
    return this;
  }
}

function parseLine(line: string) {
  const [direction, steps] = line.split(' ');
  return [direction as 'U' | 'R' | 'L' | 'D', Number(steps)] as const;
}

/** @see https://adventofcode.com/2022/day/9 First Star */
export async function firstStar() {
  return new Rope(2).journey(input()).tailVisited();
}

/** @see https://adventofcode.com/2022/day/9#part2 Second Star */
export async function secondStar() {
  return new Rope(9).journey(input()).tailVisited();
}

main(module, async () => {
  equal(new Rope(2).journey(testInput).tailVisited(), 13);
  console.log('First star:', await firstStar());
  equal(new Rope(9).journey(testInput).tailVisited(), 1);
  equal(new Rope(9).journey(testInput2).tailVisited(), 36);
  console.log('Second star:', await secondStar());
});
