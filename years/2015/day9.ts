// https://adventofcode.com/2015/day/9

import { readFileSync } from 'fs';
import { iter } from 'iteragain';
import once from 'lodash/once';
import { main } from '../../lib/utils';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/));

function parseEdge(str: string) {
  const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
  return [ start, end, parseFloat(weight) ] as const;
}

// type Node = {
//   id: string;
//   edges: Record<string, number>;
// }

class Graph {
  public readonly edges: Record<string, Record<string, number>> = {};
  public readonly nodes = new Set<string>();

  public addEdge(start: string, end: string, weight: number) {
    this.edges[start] = Object.assign(this.edges[start] || {}, { [end]: weight });
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

  public shortestEulerianPath(): number {
    return iter(Object.keys(this.edges))
      .map(node => this.eulerianPath(node))
      .filter(path => path.length === this.nodes.size)
      .map(path => this.distance(path))
      .min();
  }

  public eulerianPath(start: string): string[] {
    const visited = new Set<string>();
    const path = [start];
    const queue = [start];
    while (queue.length) {
      const start = queue.pop();
      if (!this.edges[start]) continue;
      
    }
    // while (visited.size < Object.keys(this.edges).length) {
    //   if (!this.edges[current]) return [];
    //   const next = Object.keys(this.edges[current]).find(node => !visited.has(node));
    //   if (!next) break;
    //   visited.add(next);
    //   path.push(next);
    //   current = next;
    // }
    if (path.length !== this.nodes.size) return [];
    return path;
  }
}

// class Node {
//   static nodes: Record<string, Node> = {};
//   // static edges: Record<string, number> = {};

//   constructor(public readonly id: string, public readonly edges: Record<string, number> = {}) {
//     Node.nodes[id] = this;
//   }

//   aStar(destId: string): number {
//     const visited = new Set<string>();
//     const queue: [string, number][] = [[this.id, 0 as number]];
//     while (queue.length) {
//       const [id, dist] = queue.shift();
//       if (id === destId) return dist;
//       if (visited.has(id)) continue;
//       visited.add(id);
//       const node = Node.nodes[id];
//       for (const otherId in node.edges)
//         queue.push([otherId, dist + node.edges[otherId]]);
//     }
//     throw new Error('No path found');
//   }

//   shortestPathVisitingAll(): number {
//     const visited = new Set<string>();
//     const queue: [string, number][] = [[this.id, 0 as number]];
//     while (queue.length) {
//       const [id, dist] = queue.shift();
//       if (visited.has(id)) continue;
//       visited.add(id);
//       const node = Node.nodes[id];
//       if (visited.size === Object.keys(Node.nodes).length) return dist;
//       for (const otherId in node.edges)
//         queue.push([otherId, dist + node.edges[otherId]]);
//     }
//     throw new Error('No path found');
//   }
// }

// class Graph {
//   constructor(edges) {
//     this.edges = edges;
//     this.places = Object.keys(edges);
//   }

//   getAllRoutes() {
//     const routes = [];
//     for (let start in this.edges) {
//       const route = [];
//       while (route.length < this.places.length) {
//         route.push(start);
//         start = this.getNext(route);
//         if (!start) break;
//       }
//       for (const end in this.edges[start]) {
//         route.push(this.getRoute(start, end));
//       }
//       routes.push(route);
//     }
//     return routes;
//   }
// }
// const graph = new Graph(edges);

// First Star:
export async function firstStar() {
  const graph = new Graph();
  input().forEach(str => graph.addEdge(...parseEdge(str)));
  return graph.shortestEulerianPath();
}
// const routes = graph.getAllRoutes();

// for (const line of input()) {
//   const edge = parseEdge(line);
//   const start = Node.nodes[edge.start] || new Node(edge.start);
//   const end = Node.nodes[edge.end] || new Node(edge.end);
//   start.edges[end.id] = edge.weight;
// }
// for (const node of Object.values(Node.nodes)) {
//   console.log(node.id, node.shortestPathVisitingAll());
// }

// Second Star:
export async function secondStar() {
  //
}

main(module, async () => {
  console.log('First Star:', await firstStar());
  console.log('Second Star:', await secondStar());
});