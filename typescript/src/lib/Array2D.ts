import { canTest } from ".";
import { describe, it, expect } from 'vitest';


export class Array2D<T, NPoints extends readonly number[]> {
  protected readonly arr: T[] = [];

  constructor(readonly dimensions: NPoints) { }
}

if (canTest()) {
  describe('Array2D', () => {
    it('get', () => {
      const map = new Array2D<number, [5, 5]>([5, 5]);
      expect(map.get(0, 0)).toBe(0);
    });
  });
}