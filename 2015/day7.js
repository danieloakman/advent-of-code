'use strict';
// https://adventofcode.com/2015/day/7

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [signalA, op, ] = str.split(' ');
  });

class Circuit {
  constructor (connections) {
    this.connections = connections;
    this.signals = {};
  }
}

// First Star:
const circuit = new Circuit(input);


// Second Star:


