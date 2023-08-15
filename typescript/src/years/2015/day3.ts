// https://adventofcode.com/2015/day/3

import { newLine, Solution } from '@lib';

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
  2015,
  3,
  async function firstStar(input) {
    const santa = { x: 0, y: 0 };
    const houses = new Houses();
    for (const move of input.split(newLine)) {
      if (move === '^') santa.y--;
      else if (move === 'v') santa.y++;
      else if (move === '>') santa.x++;
      else if (move === '<') santa.x--;
      houses.inc(santa.x, santa.y);
    }
    // console.log({ houses: Object.keys(houses.positions).length });
    return Object.keys(houses.positions).length;
  },
  async function secondStar(input) {
    const lines = input.split(newLine);
    const santa = { x: 0, y: 0 };
    const roboSanta = { x: 0, y: 0 };
    const houses = new Houses();
    for (let i = 0; i < lines.length; i++) {
      const move = lines[i];
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

solution.main(module);
