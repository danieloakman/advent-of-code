// https://adventofcode.com/2015/day/9

import once from 'lodash/once';
import { deepStrictEqual as equal } from 'assert';
import { Solution, Graph, GraphEdgeInput, newLine } from '@lib';

const testInput1 = once(() =>
  `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`
    .split(newLine)
    .map(parseEdge),
);

function parseEdge(str: string): GraphEdgeInput {
  const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
  return [start, end, parseFloat(weight)] as const;
}

export const solution = new Solution(2015, 9)
  .firstStar(async input => new Graph(input.split(newLine).map(parseEdge)).shortestEulerianPath()[1])
  .secondStar(async input => new Graph(input.split(newLine).map(parseEdge)).longestEulerianPath()[1])
  .test.todo('examples', () => {
    equal(new Graph(testInput1()).shortestEulerianPath()[1], 605);
    equal(new Graph(testInput1()).longestEulerianPath()[1], 982); // TODO fix
  })
  .main(import.meta.path);
