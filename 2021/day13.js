'use strict';

const { readFileSync } = require('fs');

const EMPTY = '.';
const DOT = '#';

class Map2D {
  constructor (xMax, yMax) {
    this.map = Array.from(new Array(yMax), _ => new Array(xMax).fill(EMPTY));
  }

  get xMax () {
    return Math.max(...[...this.dots()].map(p => p.x));
  }

  get yMax () {
    return Math.max(...[...this.dots()].map(p => p.y));
  }

  set (x, y, value) {
    if (this.map[y] === undefined)
      this.map[y] = [];
    this.map[y][x] = value;
  }

  // clear (x, y) {
  //   if (this.map[y]) {
  //     this.map[y][x];
  //     if (!this.map[y].includes(DOT))
  //       delete this.map[y];
  //   }
  // }

  reverseColumn (columnIndex, fromRowIndex = 0) {
    const column = [];
    for (let i = fromRowIndex; i < this.map.length; i++)
      column.shift(this.map[i][columnIndex]);
    return column;
  }

  reverseRow (rowIndex, fromColumnIndex = 0) {
    return this.map[rowIndex]
      .slice(fromColumnIndex)
      .reverse();
  }

  get (x, y) {
    return this.map[y] ? this.map[y][x] : undefined;
  }

  fold (axis, axisValue) {
    if (typeof axisValue !== 'number') axisValue = parseFloat(axisValue);
    // axis === 'x' is fold left, 'y' is fold up.
    for (const p of [...this.dots()]) {
      if (p[axis] >= axisValue) {
        this.set(p.x, p.y, EMPTY);
        if (p[axis] > axisValue) {
          p[axis] = (p[axis] - axisValue) + 1;
          this.set(p.x, p.y, DOT);
        }
      }
    }
  }

  *dots () {
    for (let y = 0; y < this.map.length; y++) {
      if (!this.map[y]) continue;
      for (let x = 0; x < this.map[y].length; x++) {
        const value = this.get(x, y);
        if (value === DOT)
          yield { x, y, value };
      }
    }
  }

  log () {
    console.log(this.map.map(row => row.join('')).join('\n'));
  }
}

// First Star:
const map = new Map2D(20, 20);
readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .forEach(str => {
    if (/^\d+,\d+$/.test(str)) {
      const [x, y] = str.split(',').map(parseFloat);
      map.set(x, y, DOT);
    } else {
      const [axis, value] = str.match(/[xy]=\d+/)[0].split('=');
      map.fold(axis, value);
      console.log({ dots: [...map.dots()] });
    }
  });
console.log();

// Second Star:


