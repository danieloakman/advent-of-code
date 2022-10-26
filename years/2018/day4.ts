// https://adventofcode.com/2018/day/4
// https://adventofcode.com/2018/day/4/input

const { readFileSync } = require('fs');

const events = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [year, month, day, hour, min] = str.match(/\d+/g).map(Number);
    const event = str.replace(/\[.+\]/, '').trim();
    return { year, month, day, hour, min, event };
  })
  .sort(
    (() => {
      const orderOfKeys = ['year', 'month', 'day', 'hour', 'min'];
      return (a, b) => {
        for (const key of orderOfKeys) if (a[key] !== b[key]) return a[key] - b[key];
      };
    })(),
  );

class Guard {
  constructor() {
    this.sleeps = [];
  }
}

// First Star:
let a;

// Second Star:
