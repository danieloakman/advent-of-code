'use strict';
// https://adventofcode.com/2015/day/9

const { readFileSync } = require('fs');

const edges = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .reduce((map, str) => {
    const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
    if (!map[start])
      map[start] = {};
    if (!map[end])
      map[end] = {};
    map[start][end] = map[end][start] = parseInt(weight);
    return map;
  }, {});

class Graph {
  constructor (edges) {
    this.edges = edges;
    this.places = Object.keys(edges);
  }

  getAllRoutes () {
    const routes = [];
    for (let start in this.edges) {
      const route = [];
      while (route.length < this.places.length) {
        route.push(start);
        start = this.getNext(route);
        if (!start)
          break;
      }
      for (const end in this.edges[start]) {
        route.push(this.getRoute(start, end));
      }
      routes.push(route);
    }
    return routes;
  }
}
const graph = new Graph(edges);

// First Star:
const routes = graph.getAllRoutes();

// Second Star:


