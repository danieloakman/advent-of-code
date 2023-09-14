import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain-es/iter';
import { downloadInputSync } from '../../lib/downloadInput';
// import { ok as assert, deepStrictEqual as equal } from 'assert';
import { GraphEdgeInput, Graph } from '../../lib/Graph';

/** @see https://adventofcode.com/2018/day/7/input */
export const input = once(() =>
  downloadInputSync('2018', '7')
    .split(/[\n\r]+/)
    .map(parseEdge),
);

const testInput = once(() =>
  `
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
    .trim()
    .split(/[\n\r]+/),
);

function parseEdge(str: string): GraphEdgeInput {
  const [start, end] = str.match(/[Ss]tep [A-z]/g).map(s => s.slice(-1));
  return [start, end, 1] as const;
}

/** @see https://adventofcode.com/2018/day/7 First Star */
export async function firstStar() {
  const graph = new Graph(input(), true);
}

/** @see https://adventofcode.com/2018/day/7#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
