'use strict';

const { readFileSync } = require('fs');

const map = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.split(''));

function get (x, y) {
  return map[y] ? map[y][x] : undefined;
}

function distance (v1, v2) {
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

function neighbours (v) {
  return [
    get(v.x - 1, v.y), // left
    get(v.x + 1, v.y), // right
    get(v.x, v.y - 1), // up
    get(v.x, v.y + 1) // down
  ].filter(Boolean);
}

function aStar (start, end) {
  let risk = 0;
  let current = start;
  while (current.x !== end.x && current.y !== end.y) {
    
  }
  return risk;
}

// First Star:
const risk = aStar({ x: 0, y: 0 }, { x: 99, y: 99 });

// Second Star:


