// https://adventofcode.com/2018/day/3
// https://adventofcode.com/2018/day/3/input

import { readFileSync } from 'fs';
import { Tuple } from 'iteragain-es/internal/types';

import Map2D from '../../lib/Map2D';

class Claim {
  static claims: Claim[] = [];
  static plot = new Map2D<number[]>();

  constructor(
    public id: number,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
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

  static parseInputStr(str: string): Tuple<number, 5> {
    return str.match(/\d+/g).map(Number) as Tuple<number, 5>;
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
