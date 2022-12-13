import once from 'lodash/once';
import { main, deepCopy } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import Map2D from '../../lib/Map2D';
import { Point, lineLength } from 'geometric';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

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

class Rope {
  private head: Point = [0, 0];
  private tail: Point = [0, 0];
  private lastHead: Point = [0, 0];

  constructor(private map2d: Map2D<boolean>) {}

  move(direction: 'U' | 'R' | 'L' | 'D', steps: number) {
    for (let i = 0; i < steps; i++) {
      this.lastHead = deepCopy(this.head);
      switch (direction) {
        case 'U':
          this.head[1]--;
          break;
        case 'R':
          this.head[0]++;
          break;
        case 'L':
          this.head[0]--;
          break;
        case 'D':
          this.head[1]++;
          break;
      }
      if (lineLength([this.head, this.tail]) >= 2)
        this.tail = deepCopy(this.lastHead);
      this.map2d.set(...this.tail, true);
    }
  }
}

function parseLine(line: string) {
  const [direction, steps] = line.split(' ');
  return [direction as 'U' | 'R' | 'L' | 'D', Number(steps)] as const;
}

function tailVisited(lines = input()): number {
  const map2d = new Map2D<boolean>();
  const rope = new Rope(map2d);
  for (const line of lines) {
    const [direction, steps] = parseLine(line);
    rope.move(direction, steps);
  }
  return map2d.values().length();
}

/** @see https://adventofcode.com/2022/day/9 First Star */
export async function firstStar() {
  return tailVisited();
}

/** @see https://adventofcode.com/2022/day/9#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  equal(tailVisited(testInput), 13);
  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
