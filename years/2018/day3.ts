// https://adventofcode.com/2018/day/3
// https://adventofcode.com/2018/day/3/input

import { readFileSync } from 'fs';

const Map2D = require('../../lib/Map2D');

class Claim {
  /** @type {Claim[]} */
  static claims = [];
  static plot = new Map2D();

  constructor(id, x, y, w, h) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    Claim.claims.push(this);
    for (const { x, y } of this.points()) {
      const v = Claim.plot.get(x, y);
      if (!v) Claim.plot.set(x, y, [this.id]);
      else Claim.plot.set(x, y, [...v, this.id]);
    }
  }

  get doesOverlap() {
    return [...Claim.plot.getAll()].some(({ value }) => value.some(id => id === this.id));
  }

  static parseInputStr(str) {
    return str.match(/\d+/g).map(Number);
  }

  *points() {
    for (let x = this.x; x < this.x + this.w; x++) for (let y = this.y; y < this.y + this.h; y++) yield { x, y };
  }
}

readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => new Claim(...Claim.parseInputStr(str)));

// First Star:
console.log({ squareInchesOfFabricWithinTwoOrMoreClaims: [...Claim.plot.getValues(v => v.length > 1)].length });

// Second Star:
const doesOverlap = [...Claim.plot.getValues()].reduce((map, { value: ids }) => {
  if (ids.length > 1) ids.forEach(id => (map[id] = true));
  return map;
}, {});
console.log({ idOfClaimThatDoesNotOverlap: Claim.claims.find(claim => !doesOverlap[claim.id]).id });
