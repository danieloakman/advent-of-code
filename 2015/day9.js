'use strict';
// https://adventofcode.com/2015/day/9

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [start, end, weight] = str.split(/ to | = /).map(str => str.trim());
    return { start, end, weight: parseInt(weight) };
  });

class Graph {
  constructor (places) {
    this.graph = {};
    for (const place of places) {
      if (!this.graph[place.start])
        this.graph[place.start] = [];
      this.graph[place.start].push({ end: place.end, weight: place.weight });
    }
  }

  getAllRoutes () {
    const routes = [];
    
    // for (const start of Object.keys(this.graph)) {
    //   for (const end of this.getRoutes(start)) {
    //     routes.push(`${start} to ${end}`);
    //   }
    // }
    // return routes;
    return routes;
  }
}
const graph = new Graph(input);

// First Star:
let a;

// Second Star:


