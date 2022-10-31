// https://adventofcode.com/2015/day/9

import { readFileSync } from 'fs';
import { iter } from 'iteragain';
import once from 'lodash/once';
import { main } from '../../lib/utils';
import { deepStrictEqual as equal } from 'assert';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/));
const testInput1 = once(() =>
  `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`.split(/[\n\r]+/),
);

class Graph {
  public readonly edges: Record<string, Record<string, number>> = {};
  public readonly nodes = new Set<string>();

  constructor(edges?: string[], directed = false) {
    for (const edge of edges) {
      const [start, end, weight] = Graph.parseEdge(edge);
      this.addEdge(start, end, weight, directed);
    }
  }

  static parseEdge(str: string) {
    const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
    return [start, end, parseFloat(weight)] as const;
  }

  addEdge(start: string, end: string, weight: number, directed = false) {
    this.edges[start] = Object.assign(this.edges[start] || {}, { [end]: weight });
    if (!directed) this.edges[end] = Object.assign(this.edges[end] || {}, { [start]: weight });
    this.nodes.add(start).add(end);
  }

  distance(nodes: string[]) {
    let distance = 0;
    for (const [start, end] of iter(nodes).pairwise()) {
      if (!this.edges?.[start]?.[end]) break;
      distance += this.edges[start][end];
    }
    return distance;
  }

  /**
   * Attempts to find a eulerian path starting at `start` node. Note it may not return a full eulerian path if not
   * possible from `start`.
   */
  findEulerianPath(start: string, visited = new Set<string>()) {
    visited = new Set(visited.values());
    visited.add(start);
    const path = [start];
    if (visited.size === this.nodes.size || !this.edges[start]) return path;
    const nextPaths = Object.keys(this.edges[start])
      .filter(node => !visited.has(node))
      .sort((a, b) => this.edges[start][a] - this.edges[start][b])
      .map(node => this.findEulerianPath(node, visited));
    if (!nextPaths.length) return path;
    const pathWithMostNodes = nextPaths.sort((a, b) => b.length - a.length)[0];
    return path.concat(pathWithMostNodes);
  }

  eulerianPaths() {
    return iter(Object.keys(this.edges))
      .map(node => this.findEulerianPath(node))
      .filter(path => path.length === this.nodes.size)
      .map(path => [path, this.distance(path)] as const)
      .tap(console.log);
  }

  shortestEulerianPath() {
    return this.eulerianPaths().min(([_, distance]) => distance);
  }

  longestEulerianPath() {
    return this.eulerianPaths().max(([_, distance]) => distance);
  }
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
  // equal(new Graph(testInput1()).longestEulerianPath()[1], 982);

  // console.log('First Star:', await firstStar());
  // console.log('Second Star:', await secondStar());
});
