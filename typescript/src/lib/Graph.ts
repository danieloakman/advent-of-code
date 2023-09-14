import iter from 'iteragain-es/iter';

/** An edge representing [start, end, weight] */
export type GraphEdgeInput = readonly [string, string, number];

export class Graph {
  public readonly edges: Record<string, Record<string, number>> = {};
  public readonly nodes = new Set<string>();

  constructor(edges?: GraphEdgeInput[], directed = false) {
    for (const edge of edges ?? []) {
      const [start, end, weight] = edge;
      this.addEdge(start, end, weight, directed);
    }
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
    const nextPaths: string[][] = Object.keys(this.edges[start])
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

export default Graph;
