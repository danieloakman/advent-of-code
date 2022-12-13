import once from 'lodash/once';
import { main } from '../../lib/utils';
import { downloadInputSync } from '../../lib/downloadInput';
import Map2D from '../../lib/Map2D';
import { Point, lineLength } from 'geometric';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import last from 'lodash/last';

/** @see https://adventofcode.com/2022/day/9/input */
export const input = once(() => downloadInputSync('2022', '9').split(/[\n\r]+/));

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
          // TODO: this needs to be redone as the direction here won't be the last direction the last knot moved.
          switch (direction) {
            case 'U':
              this.knots[j] = [this.knots[j - 1][0], this.knots[j - 1][1] + 1];
              break;
            case 'R':
              this.knots[j] = [this.knots[j - 1][0] - 1, this.knots[j - 1][1]];
              break;
            case 'L':
              this.knots[j] = [this.knots[j - 1][0] + 1, this.knots[j - 1][1]];
              break;
            case 'D':
              this.knots[j] = [this.knots[j - 1][0], this.knots[j - 1][1] - 1];
              break;
          }
        }
      }
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
  equal(new Rope(9).journey(testInput).tailVisited(), 36);
  console.log('Second star:', await secondStar());
});
