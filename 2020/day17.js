'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

// Gold Star:
const map = [readFileSync(join(__dirname, 'day17-input'), { encoding: 'utf-8' })
  .split(/\s+/)
  .filter(v => v)
  .map(v => v.split(''))];

function get (map, x, y, z) {
  if (!map[z])
    map[z] = [];
  if (!map[z][y])
    map[z][y] = [];
  if (!map[z][y][x])
    map[z][y][x] = '.';
  return map[z][y][x];
}

function* neighbours (map, x, y, z) {
  for (let X = x - 1; X < x + 1; X++) {
    for (let Y = x - 1; Y < y + 1; Y++) {
      for (let Z = z - 1; Z < z + 1; Z++) {
        yield { x: X, y: Y, z: Z, state: get(map, X, Y, Z) };
      }
    }
  }
}

function* cubes (map) {
  // for (let z = Math.min(Object.keys(get(map, 0, 0, 0))); z < get(map, 0, 0, z).length; z++) {
  //   for (let y = Math.min(Object.keys(get(map, 0, 0, z))); y < get(map, 0, y, z).length ; y++) {
  //     for (let x = Math.min(Object.keys(get(map, 0, y, z))); x < get(map, x, y, z).length; x++) {
  //       yield { x, y, z, state: get(map, x, y, z) };
  //     }
  //   }
  // }
  
}

const newMap = [];
for (const cube of cubes(map)) {
  for (const neighbour of neighbours(map, cube.x, cube.y, cube.z)) {
    console.log(neighbour);
  }
}
