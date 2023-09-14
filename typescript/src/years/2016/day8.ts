import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain-es/iter';
import Map2D from '../../lib/Map2D';
// import { ok as assert, deepStrictEqual as equals } from 'assert';

/** @see https://adventofcode.com/2016/day/8/input */
export const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/));

class Screen extends Map2D<string> {
  public static FILLED = '#';
  public static EMPTY = '.';

  constructor(
    public width: number,
    public height: number,
  ) {
    super({ xMax: width - 1, yMax: height - 1 });
    this.rect(width, height, Screen.EMPTY);
  }

  doCommand(str: string) {
    if (str.startsWith('rect')) {
      const [x, y] = str.match(/\d+/g).map(Number);
      this.rect(x, y);
    } else if (str.startsWith('rotate row')) {
      const [y, by] = str.match(/\d+/g).map(Number);
      this.rotateRow(y, by);
    } else if (str.startsWith('rotate column')) {
      const [x, by] = str.match(/\d+/g).map(Number);
      this.rotateColumn(x, by);
    }
  }

  rect(x: number, y: number, char = Screen.FILLED) {
    for (let i = 0; i < y; i++) for (let j = 0; j < x; j++) this.set(j, i, char);
  }

  rotateRow(y: number, by: number) {
    const row = iter(this.getInside({ xMin: 0, xMax: this.width - 1, yMin: y, yMax: y })).toArray();
    for (let i = 0; i < this.width; i++) this.set(i, y, row[(i - by + this.width) % this.width].value);
  }

  rotateColumn(x: number, by: number) {
    const column = iter(this.getInside({ xMin: x, xMax: x, yMin: 0, yMax: this.height - 1 })).toArray();
    for (let i = 0; i < this.height; i++) this.set(x, i, column[(i - by + this.height) % this.height].value);
  }

  count() {
    return iter(this.getValues(v => v)).quantify(({ value }) => value);
  }
}

/** @see https://adventofcode.com/2016/day/8 First Star */
export async function firstStar() {
  const screen = new Screen(50, 6);
  for (const line of input()) screen.doCommand(line);
  return screen.count();
}

/** @see https://adventofcode.com/2016/day/8#part2 Second Star */
export async function secondStar() {
  const screen = new Screen(50, 6);
  for (const line of input()) screen.doCommand(line);
  return screen.toString();
}

main(module, async () => {
  console.log('First star:', await firstStar());
  console.log('Second star:\n' + (await secondStar()));
});
