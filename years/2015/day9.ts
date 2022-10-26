// https://adventofcode.com/2015/day/9

import { readFileSync } from 'fs';
import once from 'lodash/once';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/));

function parseEdge(str: string) {
  const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
  return [ start, end, parseFloat(weight) ] as const;
}

type Node = {
  id: string;
  edges: Record<string, number>;
}

class Graph {
  public readonly nodes: Record<string, Node> = {};

  public addEdge(start: string, end: string, weight: number) {
    this.nodes[start] = this.nodes[start] || { id: start, edges: {} };
    this.nodes[end] = this.nodes[end] || { id: end, edges: {} };
    this.nodes[start].edges[end] = weight;
  }

  public getShortestPath() {

}

// const edges = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
//   .split(/[\n\r]+/)
//   .reduce((map, str) => {
//     const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
//     if (!map[start]) map[start] = {};
//     if (!map[end]) map[end] = {};
//     map[start][end] = map[end][start] = parseInt(weight);
//     return map;
//   }, {});

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
// const routes = graph.getAllRoutes();
const graph = new Graph();
input().forEach(str => graph.addEdge(...parseEdge(str)));
for (const line of input()) {
  const edge = parseEdge(line);
  const start = Node.nodes[edge.start] || new Node(edge.start);
  const end = Node.nodes[edge.end] || new Node(edge.end);
  start.edges[end.id] = edge.weight;
}
for (const node of Object.values(Node.nodes)) {
  console.log(node.id, node.shortestPathVisitingAll());
}

// Second Star:
