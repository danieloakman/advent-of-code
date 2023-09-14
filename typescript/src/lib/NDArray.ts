import { Tuple } from 'iteragain/types';
import { MapLike } from '.';
import { iter } from 'iteragain/iter';
import { range } from 'lodash';

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

export interface FixedLengthArray {
  [index: number]: number;
  length: number;
  [Symbol.iterator]: () => IterableIterator<number>;
  set: (value: ArrayLike<number>, offset: number) => void;
  slice: (start?: number, end?: number) => ArrayLike<number>;
  subarray: (start?: number, end?: number) => ArrayLike<number>;
  fill: (value: number, start?: number, end?: number) => void;
  // Add other methods here is they are needed.
}

// Tests what types of arrays can be used with `FixedLengthArray`.
// const arrs: /* ArrayLike<number>[] */FixedLengthArray[] = [
//   new Uint32Array(100),
//   new Float32Array(100),
//   new Float64Array(100),
//   new Int8Array(100),
//   new Int16Array(100),
//   new Int32Array(100),
//   new Uint8Array(100),
//   new Uint16Array(100),
//   new Uint32Array(100),
// ];

export class NDArray<N extends Dimensions> implements MapLike<Tuple<number, N['length']>, number> {
  constructor(
    protected readonly arr: FixedLengthArray,
    protected readonly dimensions: N,
  ) {}

  [Symbol.iterator]() {
    return this.iter();
  }

  has(key: Tuple<number, N['length']>): boolean {
    return this.arr[this.toIndex(key)] !== undefined;
  }

  delete(key: Tuple<number, N['length']>): boolean {
    this.arr.set([undefined as any], this.toIndex(key));
    return true;
  }

  clear(): void {
    this.arr.fill(undefined as any);
  }

  entries(): IterableIterator<[Tuple<number, N['length']>, number]> {
    return this.iter();
  }

  keys(): IterableIterator<Tuple<number, N['length']>> {
    return iter(range(this.arr.length)).map(i => this.toCoord(i));
  }

  values(): IterableIterator<number> {
    return iter(this.arr);
  }

  forEach(callbackfn: (value: number, key: Tuple<number, N['length']>, map: this) => void): void {
    this.iter().forEach(([key, value]) => callbackfn(value, key, this));
  }

  get(coords: Tuple<number, N['length']>): number {
    return this.arr[this.toIndex(coords)];
  }

  set(coords: Tuple<number, N['length']>, value: number): this {
    this.arr[this.toIndex(coords)] = value;
    return this;
  }

  update(coords: Tuple<number, N['length']>, updater: (value: number) => number): void {
    const index = this.toIndex(coords);
    this.arr[index] = updater(this.arr[index]);
  }

  iter() {
    return iter(this.arr)
      .enumerate()
      .map(([i, value]) => [this.toCoord(i), value] as [Tuple<number, N['length']>, number]);
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

// export class Array2D<T> {
//   protected readonly arr: T[];

//   constructor(readonly size: number) {
//     this.arr = new Array(size * size).fill(0);
//   }

//   get(x: number, y: number) {
//     return this.arr[x + y * this.size];
//   }

//   set(value: T, x: number, y: number) {
//     this.arr[x + y * this.size] = value;
//   }

//   update(coords: [x: number, y: number], updater: (value: T) => T) {
//     const index = coords[0] + coords[1] * this.size;
//     this.arr[index] = updater(this.arr[index]);
//   }

//   iter() {
//     return iter(this.arr).enumerate().map(([i, value]) => [i % this.size, Math.floor(i / this.size), value] as const);
//   }

//   // private toIndex(x: number, y: number): number {
//   //   return x + y * this.size;
//   // }
// }

// import.meta.vitest
// if (canTest()) {
// describe('Array2D', () => {
//   it.skip('get & set', () => {
//     // 2D map:
//     const map2d = new NDArray(new Uint32Array(5 * 5), [5, 5]);
//     expect(map2d.get([0, 0])).toBe(0);
//     map2d.set([0, 0], 1);
//     expect(map2d.get([0, 0])).toBe(1);
//     map2d.set([1, 0], 2);
//     expect(map2d.get([1, 0])).toBe(2);
//     map2d.set([0, 1], 3);
//     expect(map2d.get([0, 1])).toBe(3);

//     // Out of bounds, still kind of works.
//     map2d.set([6, 100], 100);
//     expect(map2d.get([6, 100])).toBe(undefined);

//     // 3D map:
//     const map3d = new NDArray(new Float32Array(5 * 5 * 5), [5, 5, 5]);
//     expect(map3d.get([0, 0, 0])).toBe(0);
//     map3d.set([0, 0, 0], -1);
//     expect(map3d.get([0, 0, 0])).toBe(-1);
//     map3d.set([0, 0, 1], 2);
//     expect(
//       map3d
//         .iter()
//         .filterMap(([_, v]) => v)
//         .minmax(),
//     ).toEqual([-1, 2]);
//   });

//   it.skip('performance', async () => {
//     const { setupSuite } = await import('../../../../iteragain/benchmark/bm-util.js');
//     setupSuite({ name: 'NDArray performance' })
//       .add('', () => {})
//       .run();
//   });
// });
// }
