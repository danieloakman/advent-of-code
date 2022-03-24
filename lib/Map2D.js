'use strict';
// @ts-check

const { iterate } = require('iterare');

module.exports = class Map2D {
  /**
   * @param {{ xMin?: number, xMax?: number, yMin?: number, yMax?: number }} param0
   */
  constructor ({ xMin, xMax, yMin, yMax } = {}) {
    /** @private */
    this.map = {};
    /** @readonly */
    this.xMin = xMin || 0;
    /** @readonly */
    this.xMax = xMax || 0;
    /** @readonly */
    this.yMin = yMin || 0;
    /** @readonly */
    this.yMax = yMax || 0;
  }

  setBounds (x, y) {
    this.xMin = Math.min(this.xMin, x);
    this.xMax = Math.max(this.xMax, x);
    this.yMin = Math.min(this.yMin, y);
    this.yMax = Math.max(this.yMax, y);
  }

  resetBounds () {
    this.xMin = this.xMax = this.yMin = this.yMax = 0;
    Object
      .keys(this.map)
      .forEach(key => this.setBounds(...key.split(',')));
  }

  set (x, y, value) {
    this.setBounds(x, y);
    this.map[`${x},${y}`] = value;
  }

  has (x, y) {
    return this.map[`${x},${y}`] !== undefined;
  }

  get = Object.defineProperties(
    (x, y) => this.map[`${x},${y}`],
    {
      'up': { value: (x, y) => this.map[`${x},${y - 1}`] },
      'down': { value: (x, y) => this.map[`${x},${y + 1}`] },
      'left': { value: (x, y) => this.map[`${x - 1},${y}`] },
      'right': { value: (x, y) => this.map[`${x + 1},${y}`] },
      'upLeft': { value: (x, y) => this.map[`${x - 1},${y - 1}`] },
      'upRight': { value: (x, y) => this.map[`${x + 1},${y - 1}`] },
      'downLeft': { value: (x, y) => this.map[`${x - 1},${y + 1}`] },
      'downRight': { value: (x, y) => this.map[`${x + 1},${y + 1}`] }
    }
  )

  clear (x, y) {
    delete this.map[`${x},${y}`];
  }

  toArray () {
    const arr = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      const row = [];
      for (let x = this.xMin; x <= this.xMax; x++)
        row.push(this.map[`${x},${y}`]);
      arr.push(row);
    }
    return arr;
  }

  toString () {
    return this.toArray().map(row => row.join('')).join('\n');
  }

  /**
   * @param {(value: any, x: number, y: number) => any} predicate
   */
  getAll (predicate = (value, x, y) => typeof value !== 'undefined') {
    return this.getInside(
      { xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax },
      predicate
    );
  }

  /**
   * @param {(value: any, x: number, y: number) => any} predicate
   */
  *getValues (predicate = (value, x, y) => typeof value !== 'undefined') {
    for (const key in this.map) {
      const [x, y] = key.split(',').map(Number);
      const value = this.map[key];
      if (predicate(value, x, y))
        yield { x, y, value };
    }
  }

  /**
   * @param {{ xMin?: number, xMax?: number, yMin?: number, yMax?: number }} param0
   * @param {(value: any, x: number, y: number) => any} predicate
   */
  *getInside(
    bounds = { xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax },
    predicate = (value, x, y) => typeof value !== undefined
  ) {
    for (let y = bounds.yMin; y <= bounds.yMax; y++) {
      for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        const value = this.map[`${x},${y}`];
        if (predicate(value, x, y))
          yield { x, y, value };
      }
    }
  }

  getNeighbours (x, y, yieldUndefinedNeighbours = true) {
    return this.getInside(
      { xMin: x - 1, xMax: x + 1, yMin: y - 1, yMax: y + 1 },
      (value, x2, y2) => `${x},${y}` !== `${x2},${y2}` && (typeof value !== 'undefined' || yieldUndefinedNeighbours)
    );
  }
};
