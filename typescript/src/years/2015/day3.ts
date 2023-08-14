// https://adventofcode.com/2015/day/3

import { downloadInputSync, main, Solution } from '../../lib';
import once from 'lodash/once';

const input = once(() => downloadInputSync(2015, 3).trim());

class Houses {
  readonly positions: Record<string, any> = {};
  constructor() {}

  inc(x: number, y: number) {
    const key = `${x},${y}`;
    if (!this.positions[key]) this.positions[key] = 1;
    else this.positions[key]++;
  }
}

export const solution = new Solution(
  async function firstStar() {
    const santa = { x: 0, y: 0 };
    const houses = new Houses();
    for (const move of input()) {
      if (move === '^') santa.y--;
      else if (move === 'v') santa.y++;
      else if (move === '>') santa.x++;
      else if (move === '<') santa.x--;
      houses.inc(santa.x, santa.y);
    }
    // console.log({ houses: Object.keys(houses.positions).length });
    return Object.keys(houses.positions).length;
  },
  async function secondStar() {
    const santa = { x: 0, y: 0 };
    const roboSanta = { x: 0, y: 0 };
    const houses = new Houses();
    for (let i = 0; i < input().length; i++) {
      const move = input()[i];
      const s = i % 2 === 0 ? santa : roboSanta;
      if (move === '^') s.y--;
      else if (move === 'v') s.y++;
      else if (move === '>') s.x++;
      else if (move === '<') s.x--;
      houses.inc(s.x, s.y);
    }
    return Object.keys(houses.positions).length;
  }
);

main(module, () => solution.solve());
