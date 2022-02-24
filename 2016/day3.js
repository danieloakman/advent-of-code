'use strict';
// https://adventofcode.com/2016/day/3

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.trim().split(/\s+/).map(Number));

function isPossibleTriangle (points) {
  const [a, b, c] = points;
  return (a + b > c) && (a + c > b) && (b + c > a);
}

// First Star:
console.log({ numOfPossibleTriangles: input.filter(isPossibleTriangle).length });

// Second Star:
const { subArrays } = require('../lib/utils');
console.log({
  numOfPossibleTriangles: [...subArrays(input, 3, false)]
    .reduce((arr, points) => {
      arr.push(
        [points[0][0], points[1][0], points[2][0]],
        [points[0][1], points[1][1], points[2][1]],
        [points[0][2], points[1][2], points[2][2]]
      );
      return arr;
    }, [])
    .filter(isPossibleTriangle).length
});

