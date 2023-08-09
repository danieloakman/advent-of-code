// https://adventofcode.com/2015/day/9

import once from 'lodash/once';
import { main } from '../../lib/utils';
import { deepStrictEqual as equal } from 'assert';
import { downloadInputSync } from '../../lib/downloadInput';
import { Graph, GraphEdgeInput } from '../../lib/Graph';

const input = once(() =>
  downloadInputSync('2015', '9')
    .split(/[\n\r]+/)
    .map(parseEdge),
);
const testInput1 = once(() =>
  `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`
    .split(/[\n\r]+/)
    .map(parseEdge),
);

function parseEdge(str: string): GraphEdgeInput {
  const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
  return [start, end, parseFloat(weight)] as const;
}

// First Star:
export async function firstStar() {
  return new Graph(input()).shortestEulerianPath();
}

// Second Star:
export async function secondStar() {
  return new Graph(input()).longestEulerianPath();
}

main(module, async () => {
  // Tests:
  equal(new Graph(testInput1()).shortestEulerianPath()[1], 605);
  // Tests:
  equal(new Graph(testInput1()).longestEulerianPath()[1], 982); // TODO fix

  // console.log('First Star:', await firstStar());
  // console.log('Second Star:', await secondStar());
});
