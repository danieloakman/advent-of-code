// https://adventofcode.com/2016/day/1

import { readFileSync } from 'fs';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/, +/);

// First Star:
const pos = { x: 0, y: 0 };
let blocksAwayFromFirstPosVisitedTwice = null;
const positions = {};
let facing = 'N';
for (const cmd of input) {
  const turn = cmd[0];
  const dist = parseInt(cmd.slice(1), 10);
  if (turn === 'L') {
    facing = { N: 'W', W: 'S', S: 'E', E: 'N' }[facing];
  } else {
    facing = { N: 'E', E: 'S', S: 'W', W: 'N' }[facing];
  }
  if (facing === 'N') {
    pos.y += dist;
  } else if (facing === 'S') {
    pos.y -= dist;
  } else if (facing === 'E') {
    pos.x += dist;
  } else if (facing === 'W') {
    pos.x -= dist;
  }

  const key = `${pos.x},${pos.y}`;
  if (!blocksAwayFromFirstPosVisitedTwice && positions[key])
    blocksAwayFromFirstPosVisitedTwice = Math.abs(pos.x) + Math.abs(pos.y);
  else if (!blocksAwayFromFirstPosVisitedTwice) positions[key] = 1;
}
console.log({ blocksAway: Math.abs(pos.x) + Math.abs(pos.y) });

// Second Star:
console.log({ blocksAwayFromFirstPosVisitedTwice });
