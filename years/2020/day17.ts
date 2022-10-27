import { readFileSync } from 'fs';
import { join } from 'path';

// Gold Star:
let map = [
  readFileSync(join(__dirname, 'day17-input'), { encoding: 'utf-8' })
    .split(/\s+/)
    .filter(v => v)
    .map(v => v.split('')),
];

function get(map, x, y, z) {
  if (!map[z]) map[z] = [];
  if (!map[z][y]) map[z][y] = [];
  if (!map[z][y][x]) map[z][y][x] = '.';
  return map[z][y][x];
}

function set(map, x, y, z, state) {
  if (!map[z]) map[z] = [];
  if (!map[z][y]) map[z][y] = [];
  map[z][y][x] = state;
}

function* neighbours(map, x, y, z) {
  for (let X = x - 1; X < x + 1; X++) {
    for (let Y = x - 1; Y < y + 1; Y++) {
      for (let Z = z - 1; Z < z + 1; Z++) {
        yield { x: X, y: Y, z: Z, state: get(map, X, Y, Z) };
      }
    }
  }
}

function* cubes(map) {
  for (let z = Math.min(...Object.keys(map)); z < map.length; z++) {
    for (let y = Math.min(...Object.keys(map[z])); y < map[z].length; y++) {
      for (let x = Math.min(...Object.keys(map[z][y])); x < map[z][y].length; x++) {
        yield { x, y, z, state: get(map, x, y, z) };
      }
    }
  }
}

for (let i = 0; i < 6; i++) {
  // 6 cycles
  const newMap = [];
  for (const cube of cubes(map)) {
    const isActive = cube.state === '#';
    let numOfActiveNeighbours = 0;
    for (const neighbour of neighbours(map, cube.x, cube.y, cube.z)) {
      if (neighbour.state === '#') numOfActiveNeighbours++;
      if ((isActive && numOfActiveNeighbours > 3) || (!isActive && numOfActiveNeighbours > 3)) break;
    }
    // Set newMap:
    set(
      newMap,
      cube.x,
      cube.y,
      cube.z,
      (isActive && (numOfActiveNeighbours === 3 || numOfActiveNeighbours === 2)) ||
        (!isActive && numOfActiveNeighbours === 3)
        ? '#'
        : '.',
    );
  }
  // Replace map with newMap from this cycle.
  map = newMap;
}
let active = 0;
for (const cube of cubes(map)) {
  if (cube.state === '#') active++;
}
console.log({ active });
