// https://adventofcode.com/2016/day/1
import { Solution, canTest } from '../../lib';
import memoize from 'lodash/memoize';
import { describe, expect, it } from 'vitest';

type Point = { x: number; y: number };

const solve = memoize((input: string) => {
  const pos: Point = { x: 0, y: 0 };
  let blocksAwayFromFirstPosVisitedTwice = null;
  const positions = new Set<Point>();
  let facing = 'N';
  for (const cmd of input.split(', ')) {
    const turn = cmd[0];
    const dist = parseInt(cmd.slice(1), 10);
    if (turn === 'L') {
      facing = { N: 'W', W: 'S', S: 'E', E: 'N' }[facing];
    } else {
      facing = { N: 'E', E: 'S', S: 'W', W: 'N' }[facing];
    }
    if (facing === 'N') {
      pos.y -= dist;
    } else if (facing === 'S') {
      pos.y += dist;
    } else if (facing === 'E') {
      pos.x += dist;
    } else if (facing === 'W') {
      pos.x -= dist;
    }

    if (!blocksAwayFromFirstPosVisitedTwice) {
      if (positions.has(pos))
        blocksAwayFromFirstPosVisitedTwice = dist;
      else positions.add(pos);
    }
  }
  return { blocksAway: Math.abs(pos.x) + Math.abs(pos.y), blocksAwayFromFirstPosVisitedTwice };
});

export const solution = new Solution(
  2016,
  1,
  async input => solve(input).blocksAway,
  async input => solve(input).blocksAwayFromFirstPosVisitedTwice,
);

solution.main(module);

// import.meta.vitest
if (canTest()) {
  describe('2016/1', () => {
    it('examples', async () => {
      expect(solve('R2, L3').blocksAway).toEqual(5);
      expect(solve('R2, R2, R2').blocksAway).toEqual(2);
      expect(solve('R5, L5, R5, R3').blocksAway).toEqual(12);
      expect(solve('R8, R4, R4, R8').blocksAwayFromFirstPosVisitedTwice).toEqual(4);
    });
  });
}