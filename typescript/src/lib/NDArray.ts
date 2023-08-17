import { Tuple } from 'iteragain/types';
import { canTest } from '.';
import { describe, it, expect } from 'vitest';
import { iter } from 'iteragain/iter';

export type Dimensions =
  | Tuple<number, 2>
  | Tuple<number, 3>
  | Tuple<number, 4>
  | Tuple<number, 5>
  | Tuple<number, 6>
  | Tuple<number, 7>
  | Tuple<number, 8>
  | Tuple<number, 9>
  | Tuple<number, 10>;

// export interface NDArray

export class NDArray<T, N extends Dimensions> {
  protected readonly arr: T[];

  constructor(
    readonly defaultValue: T,
    readonly dimensions: N,
  ) {
    this.arr = Array.from({ length: dimensions.reduce((acc, dim) => acc * dim) }, () => defaultValue);
  }

  get(...coordinates: Tuple<number, N['length']>): T {
    return this.arr[this.toIndex(coordinates)] ?? this.defaultValue;
  }

  set(value: T, ...coordinates: Tuple<number, N['length']>): void {
    this.arr[this.toIndex(coordinates)] = value;
  }

  update(coordinates: Tuple<number, N['length']>, updater: (value: T) => T): void {
    const index = this.toIndex(coordinates);
    this.arr[index] = updater(this.arr[index] ?? this.defaultValue);
  }

  iter() {
    return iter(this.arr).enumerate().map(([i, value]) => [this.toCoord(i), value ?? this.defaultValue] as const);
  }

  /**
   * Transforms coordinates (x, y...) into an index to pass to `arr`. This doesn't account for when `coordinates` are
   * out of bounds.
   */
  private toIndex(coordinates: Tuple<number, N['length']>): number {
    let index = 0;
    let multiplier = 1;
    for (let i = 0; i < coordinates.length; i++) {
      index += (coordinates as any)[i] * multiplier;
      multiplier *= this.dimensions[i];
    }
    return index;
  }

  private toCoord(index: number): Tuple<number, N['length']> {
    const result: number[] = [];
    let multiplier = 1;
    for (let i = 0; i < this.dimensions.length; i++) {
      result.push(Math.floor(index / multiplier) % this.dimensions[i]);
      multiplier *= this.dimensions[i];
    }
    return result as any;
  }
}

// function toIndex(size: number, x: number, y: number) {
//   return x + y * size;
// }

// export function array2DProxy<T>(): { [x: string]: { [y: string]: T } } {
//   const arr: T[] = [];
//   // eslint-disable-next-line no-undef
//   return new Proxy([], {
//     get: (target, prop) => {
//       // if ()
//     },
//   }) as any;
// }

export class Array2D<T> {
  protected readonly arr: T[];

  constructor(readonly size: number) {
    this.arr = new Array(size * size).fill(0);
  }

  get(x: number, y: number) {
    return this.arr[x + y * this.size];
  }

  set(value: T, x: number, y: number) {
    this.arr[x + y * this.size] = value;
  }

  update(coords: [x: number, y: number], updater: (value: T) => T) {
    const index = coords[0] + coords[1] * this.size;
    this.arr[index] = updater(this.arr[index]);
  }

  iter() {
    return iter(this.arr).enumerate().map(([i, value]) => [i % this.size, Math.floor(i / this.size), value] as const);
  }

  // private toIndex(x: number, y: number): number {
  //   return x + y * this.size;
  // }
}

// import.meta.vitest
if (canTest()) {
  describe('Array2D', () => {
    it('get & set', () => {
      // 2D map:
      const map2d = new NDArray(0, [5, 5]);
      expect(map2d.get(0, 0)).toBe(0);
      map2d.set(1, 0, 0);
      expect(map2d.get(0, 0)).toBe(1);
      map2d.set(2, 1, 0);
      expect(map2d.get(1, 0)).toBe(2);
      map2d.set(3, 0, 1);
      expect(map2d.get(0, 1)).toBe(3);

      // Out of bounds, still kind of works.
      map2d.set(100, 6, 100);
      expect(map2d.get(6, 100)).toBe(100);

      // 3D map:
      const map3d = new NDArray(0, [5, 5, 5]);
      expect(map3d.get(0, 0, 0)).toBe(0);
      map3d.set(-1, 0, 0, 0);
      expect(map3d.get(0, 0, 0)).toBe(-1);
      map3d.set(2, 0, 0, 1);
      expect(map3d.iter().filterMap(([_, v]) => v).minmax()).toEqual([-1, 2]);
    });

    it('performance', async () => {
      const { setupSuite } = await import('../../../../iteragain/benchmark/bm-util.js');
      setupSuite({ name: 'NDArray performance' })
        .add('', () => {})
        .run();
    });
  });
}